import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Users, DollarSign } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: ShoppingBag,
      title: "Buy & Sell",
      description: "Browse or list textbooks, electronics, furniture, and more from fellow students",
    },
    {
      icon: Users,
      title: "Student Community",
      description: "Connect with other students on campus in a safe, verified marketplace",
    },
    {
      icon: DollarSign,
      title: "Easy Payments",
      description: "Secure payment processing with multiple options including Venmo and Apple Pay",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Campusly
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            The student marketplace for buying, selling, and trading on campus
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-login"
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why UniMart?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="mb-4">
                    <Icon className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start?</h2>
          <p className="text-xl mb-8 text-muted-foreground">
            Join thousands of students buying and selling on campus
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-login-cta"
          >
            Log In to Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
