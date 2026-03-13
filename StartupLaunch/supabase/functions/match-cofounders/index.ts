import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const userId = claimsData.claims.sub;

    // Get current user profile
    const { data: myProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!myProfile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404, headers: corsHeaders });
    }

    // Get all other profiles with skills
    const { data: allProfiles } = await supabase
      .from("profiles")
      .select("*")
      .neq("user_id", userId);

    if (!allProfiles || allProfiles.length === 0) {
      return new Response(JSON.stringify({ matches: [] }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const mySkills = (myProfile.skills || []).map((s: string) => s.toLowerCase());
    const myInterests = (myProfile.interests || []).map((s: string) => s.toLowerCase());

    // Score each profile
    const scored = allProfiles.map((profile: any) => {
      const theirSkills = (profile.skills || []).map((s: string) => s.toLowerCase());
      const theirInterests = (profile.interests || []).map((s: string) => s.toLowerCase());

      // Complementary skills (they have what you don't)
      const complementarySkills = theirSkills.filter((s: string) => !mySkills.includes(s)).length;
      // Shared interests
      const sharedInterests = theirInterests.filter((s: string) => myInterests.includes(s)).length;
      // Domain match
      const domainMatch = myProfile.startup_domain && profile.startup_domain && 
        myProfile.startup_domain.toLowerCase() === profile.startup_domain.toLowerCase() ? 3 : 0;

      const score = complementarySkills * 2 + sharedInterests * 3 + domainMatch;

      return { ...profile, match_score: score, complementary_skills: complementarySkills, shared_interests: sharedInterests };
    });

    // Sort by score, return top matches
    const matches = scored.filter((p: any) => p.match_score > 0).sort((a: any, b: any) => b.match_score - a.match_score).slice(0, 20);

    return new Response(JSON.stringify({ matches }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("match-cofounders error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});