import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Activity, CheckCircle2, Home } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Prediction {
  disease: string;
  confidence: number;
  probabilities: Array<{
    disease: string;
    probability: number;
  }>;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prediction = location.state?.prediction as Prediction;

  if (!prediction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Results Found</CardTitle>
            <CardDescription>
              Please complete the symptom assessment first
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/symptom-checker')} className="w-full">
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">HealthPredict AI</h1>
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="shadow-large mb-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Activity className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl mb-2">Analysis Complete</CardTitle>
            <CardDescription className="text-base">
              Based on your symptoms, here's what we found
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-gradient-card rounded-lg border-2 border-primary">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="h-6 w-6 text-success" />
                <h3 className="text-xl font-semibold">Primary Diagnosis</h3>
              </div>
              <p className="text-3xl font-bold text-primary mb-2">{prediction.disease}</p>
              <p className="text-muted-foreground">
                Confidence: {(prediction.confidence * 100).toFixed(1)}%
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Important Notice</AlertTitle>
              <AlertDescription>
                This is an AI-powered prediction and should not replace professional medical advice.
                Please consult with a healthcare provider for proper diagnosis and treatment.
              </AlertDescription>
            </Alert>

            <div>
              <h3 className="text-xl font-semibold mb-4">Probability Distribution</h3>
              <div className="space-y-4">
                {prediction.probabilities
                  .sort((a, b) => b.probability - a.probability)
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.disease}</span>
                        <span className="text-sm text-muted-foreground">
                          {(item.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={item.probability * 100} className="h-2" />
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate('/symptom-checker')}
                variant="outline"
                className="flex-1"
              >
                New Assessment
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Results;