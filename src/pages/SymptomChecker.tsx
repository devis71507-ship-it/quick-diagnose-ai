import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Activity, Heart, Thermometer, Wind, Brain, Pill, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const symptoms = [
  { id: "fever", label: "Fever", icon: Thermometer },
  { id: "cough", label: "Cough", icon: Wind },
  { id: "fatigue", label: "Fatigue", icon: Activity },
  { id: "headache", label: "Headache", icon: Brain },
  { id: "nausea", label: "Nausea", icon: Heart },
  { id: "vomiting", label: "Vomiting", icon: Pill },
  { id: "chestPain", label: "Chest Pain", icon: Heart },
  { id: "shortnessOfBreath", label: "Shortness of Breath", icon: Wind },
  { id: "stomachPain", label: "Stomach Pain", icon: Activity },
  { id: "jointPain", label: "Joint Pain", icon: Activity },
  { id: "skinRash", label: "Skin Rash", icon: Activity },
  { id: "soreThroat", label: "Sore Throat", icon: Wind },
  { id: "lossOfAppetite", label: "Loss of Appetite", icon: Pill },
];

const SymptomChecker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [bloodPressure, setBloodPressure] = useState("");
  const [sugarLevel, setSugarLevel] = useState("");

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(s => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSymptoms.length === 0) {
      toast({
        title: "No symptoms selected",
        description: "Please select at least one symptom to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('predict-disease', {
        body: {
          symptoms: selectedSymptoms,
          bloodPressure: bloodPressure ? parseFloat(bloodPressure) : null,
          sugarLevel: sugarLevel ? parseFloat(sugarLevel) : null,
        }
      });

      if (error) throw error;

      navigate('/results', { state: { prediction: data } });
    } catch (error: any) {
      console.error('Error predicting disease:', error);
      toast({
        title: "Prediction failed",
        description: error.message || "Unable to analyze symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">HealthPredict AI</h1>
            <Button variant="ghost" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-3xl">Symptom Assessment</CardTitle>
            <CardDescription className="text-base">
              Select all symptoms you're currently experiencing and provide your vital signs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Symptoms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {symptoms.map(({ id, label, icon: Icon }) => (
                    <div
                      key={id}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                        selectedSymptoms.includes(id)
                          ? 'border-primary bg-secondary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Checkbox
                        id={id}
                        checked={selectedSymptoms.includes(id)}
                        onCheckedChange={() => handleSymptomToggle(id)}
                      />
                      <Icon className="h-5 w-5 text-primary" />
                      <Label htmlFor={id} className="cursor-pointer flex-1">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Vital Signs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
                    <Input
                      id="bloodPressure"
                      type="number"
                      placeholder="e.g., 120"
                      value={bloodPressure}
                      onChange={(e) => setBloodPressure(e.target.value)}
                      min="0"
                      max="300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sugarLevel">Blood Sugar Level (mg/dL)</Label>
                    <Input
                      id="sugarLevel"
                      type="number"
                      placeholder="e.g., 100"
                      value={sugarLevel}
                      onChange={(e) => setSugarLevel(e.target.value)}
                      min="0"
                      max="600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="min-w-[200px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Get Diagnosis'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SymptomChecker;