import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ArrowLeft } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Clock className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="text-3xl font-bold font-heading mb-3">Coming Soon</h1>
          
          <p className="text-muted-foreground mb-6">
            We're working hard to bring you this feature. Check back soon for updates!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline" data-testid="button-go-back">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild data-testid="button-about-us">
              <Link href="/about">
                Learn About Us
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
