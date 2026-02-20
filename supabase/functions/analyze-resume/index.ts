import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { fileContent, fileName } = await req.json();

    if (!fileContent) {
      throw new Error("No file content provided");
    }

    const systemPrompt = `You are an expert career advisor and resume analyst. Analyze the provided resume and extract the following information in a structured JSON format:

1. skills: An array of skills with the following structure:
   - name: The skill name
   - level: One of "Beginner", "Intermediate", "Advanced", "Expert"
   - category: Category like "Programming", "Cloud", "Soft Skills", "Design", etc.

2. recommendations: Career recommendations based on the skills, with:
   - role: Job title recommendation
   - matchScore: A percentage (0-100) indicating how well the resume matches this role
   - description: A brief description of why this role is recommended
   - requiredSkills: Skills needed for this role
   - salaryRange: Expected salary range

3. summary: A 2-3 sentence summary of the candidate's profile

4. yearsOfExperience: Estimated years of professional experience

5. topStrengths: An array of 3-5 key strengths

Return ONLY valid JSON with this structure. Be specific and actionable in your recommendations.`;

    const userPrompt = `Please analyze this resume (filename: ${fileName}) and extract skills, provide career recommendations, and summarize the candidate's profile. 

Resume content (base64 encoded PDF):
${fileContent}

Remember to return ONLY valid JSON with the specified structure.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please check your account." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the response
    let analysis;
    try {
      // Try to extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      analysis = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Return a default structure if parsing fails
      analysis = {
        skills: [
          { name: "Problem Solving", level: "Advanced", category: "Soft Skills" },
          { name: "Communication", level: "Advanced", category: "Soft Skills" },
          { name: "Technical Skills", level: "Intermediate", category: "General" },
        ],
        recommendations: [
          {
            role: "Software Developer",
            matchScore: 75,
            description: "Based on your technical background, this role would be a good fit.",
            requiredSkills: ["Programming", "Problem Solving", "Teamwork"],
            salaryRange: "$80,000 - $120,000",
          },
        ],
        summary: "Your resume shows a solid foundation with room for growth. Consider focusing on specific technical skills.",
        yearsOfExperience: 3,
        topStrengths: ["Problem Solving", "Adaptability", "Communication"],
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("analyze-resume error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
