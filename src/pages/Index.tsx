import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Shield, Zap, Brain, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">HealthPredict AI</h1>
            </div>
            <div className="flex items-center gap-2">
              {session ? (
                <>
                  <Button variant="ghost" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    {session.user.email}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Brain className="h-5 w-5" />
              <span className="text-sm font-medium">AI-Powered Health Analysis</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              Your Personal Health Assistant
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Enter your symptoms and get instant AI-powered predictions about possible health conditions.
              Fast, reliable, and designed to help you understand your health better.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/symptom-checker')}
                className="text-lg px-8 shadow-medium hover:shadow-large transition-all"
              >
                Start Health Check
              </Button>
              {!session && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/auth')}
                  className="text-lg px-8"
                >
                  Create Account
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-card/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose HealthPredict AI?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="shadow-soft hover:shadow-medium transition-all">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mb-3">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>AI-Powered Analysis</CardTitle>
                  <CardDescription>
                    Advanced machine learning algorithms analyze your symptoms to provide accurate health predictions
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="shadow-soft hover:shadow-medium transition-all">
                <CardHeader>
                  <div className="p-3 bg-accent/10 rounded-lg w-fit mb-3">
                    <Zap className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle>Instant Results</CardTitle>
                  <CardDescription>
                    Get comprehensive health analysis in seconds, not hours. Quick insights when you need them most
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="shadow-soft hover:shadow-medium transition-all">
                <CardHeader>
                  <div className="p-3 bg-success/10 rounded-lg w-fit mb-3">
                    <Shield className="h-8 w-8 text-success" />
                  </div>
                  <CardTitle>Secure & Private</CardTitle>
                  <CardDescription>
                    Your health data is encrypted and secure. We prioritize your privacy above everything else
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Select Your Symptoms</h3>
                  <p className="text-muted-foreground">
                    Choose from a comprehensive list of symptoms you're experiencing, including fever, cough, fatigue, and more
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Add Vital Signs</h3>
                  <p className="text-muted-foreground">
                    Optionally provide your blood pressure and sugar levels for more accurate predictions
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Get AI Analysis</h3>
                  <p className="text-muted-foreground">
                    Our AI analyzes your input and provides possible diagnoses with confidence levels and probabilities
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button
                size="lg"
                onClick={() => navigate('/symptom-checker')}
                className="px-8"
              >
                Try It Now
              </Button>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Medical Disclaimer:</strong> HealthPredict AI is designed to provide general health information
              and should not be used as a substitute for professional medical advice, diagnosis, or treatment.
              Always consult with qualified healthcare providers for medical concerns.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 HealthPredict AI. Advanced health analysis powered by AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
