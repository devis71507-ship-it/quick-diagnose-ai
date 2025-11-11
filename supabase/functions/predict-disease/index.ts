import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Disease database with symptoms mapping
const diseases = [
  {
    name: "Common Cold",
    symptoms: ["cough", "soreThroat", "fever", "fatigue"],
    severity: "mild"
  },
  {
    name: "Influenza (Flu)",
    symptoms: ["fever", "cough", "fatigue", "headache", "jointPain"],
    severity: "moderate"
  },
  {
    name: "COVID-19",
    symptoms: ["fever", "cough", "fatigue", "shortnessOfBreath", "lossOfAppetite"],
    severity: "moderate"
  },
  {
    name: "Gastroenteritis",
    symptoms: ["nausea", "vomiting", "stomachPain", "fatigue", "lossOfAppetite"],
    severity: "moderate"
  },
  {
    name: "Migraine",
    symptoms: ["headache", "nausea", "fatigue"],
    severity: "moderate"
  },
  {
    name: "Bronchitis",
    symptoms: ["cough", "fever", "fatigue", "chestPain"],
    severity: "moderate"
  },
  {
    name: "Pneumonia",
    symptoms: ["fever", "cough", "shortnessOfBreath", "chestPain", "fatigue"],
    severity: "severe"
  },
  {
    name: "Allergic Reaction",
    symptoms: ["skinRash", "shortnessOfBreath", "nausea"],
    severity: "mild"
  },
  {
    name: "Strep Throat",
    symptoms: ["soreThroat", "fever", "headache", "fatigue"],
    severity: "moderate"
  },
  {
    name: "Food Poisoning",
    symptoms: ["nausea", "vomiting", "stomachPain", "fatigue"],
    severity: "moderate"
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, bloodPressure, sugarLevel } = await req.json();

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      throw new Error('Invalid symptoms data');
    }

    console.log('Analyzing symptoms:', symptoms);
    console.log('Vital signs - BP:', bloodPressure, 'Sugar:', sugarLevel);

    // Calculate match scores for each disease
    const predictions = diseases.map(disease => {
      const matchedSymptoms = symptoms.filter(s => disease.symptoms.includes(s));
      const matchScore = matchedSymptoms.length / disease.symptoms.length;
      
      // Boost score if vital signs are abnormal and relevant to the disease
      let vitalBoost = 0;
      if (bloodPressure && (bloodPressure > 140 || bloodPressure < 90)) {
        vitalBoost += 0.1;
      }
      if (sugarLevel && (sugarLevel > 180 || sugarLevel < 70)) {
        vitalBoost += 0.1;
      }

      const finalScore = Math.min(matchScore + vitalBoost, 1.0);
      
      return {
        disease: disease.name,
        probability: finalScore,
        severity: disease.severity
      };
    });

    // Sort by probability
    predictions.sort((a, b) => b.probability - a.probability);

    // Normalize probabilities to sum to 1
    const totalProb = predictions.reduce((sum, p) => sum + p.probability, 0);
    const normalizedPredictions = predictions.map(p => ({
      ...p,
      probability: totalProb > 0 ? p.probability / totalProb : 0
    }));

    const topPrediction = normalizedPredictions[0];

    // Use Lovable AI to generate more detailed analysis
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    let aiEnhancedDescription = "";
    
    if (LOVABLE_API_KEY) {
      try {
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: 'You are a medical assistant providing brief, helpful information about diseases. Keep responses under 100 words.'
              },
              {
                role: 'user',
                content: `Provide a brief description and general advice for someone potentially showing symptoms of ${topPrediction.disease}. Include when they should seek medical attention.`
              }
            ]
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          aiEnhancedDescription = aiData.choices[0]?.message?.content || "";
          console.log('AI enhanced description generated');
        }
      } catch (error) {
        console.error('AI enhancement error:', error);
      }
    }

    const response = {
      disease: topPrediction.disease,
      confidence: topPrediction.probability,
      severity: topPrediction.severity,
      probabilities: normalizedPredictions.slice(0, 5),
      description: aiEnhancedDescription,
      timestamp: new Date().toISOString()
    };

    console.log('Prediction complete:', response.disease);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in predict-disease function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});