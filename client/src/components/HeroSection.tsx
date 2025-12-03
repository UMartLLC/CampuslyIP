import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, CreditCard } from "lucide-react";
import { Link } from "wouter";
import heroImage from '@assets/generated_images/Students_collaborating_on_campus_4b173564.png';

export default function HeroSection() {
  return (
    <div className="relative">
      {/* Hero Background */}
      <div 
        className="relative h-[600px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        
        {/* Hero Content */}
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 leading-tight">
              Buy, Sell, Connect
              <span className="block text-primary-foreground">Your Campus Marketplace</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              Join a simple, safe, and streamlined marketplace built for your university community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/coming-soon">
                <Button size="lg" className="text-lg px-8 py-6" data-testid="button-start-browsing">
                  Start Browsing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/coming-soon">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-background/10 backdrop-blur border-white/20 text-white hover:bg-background/20" data-testid="button-sell-now">
                  Sell Your Items
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Why Your University Chooses Campusly</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built specifically for the campus community with safety, simplicity, and trust at the core.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover-elevate">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Safe & Secure</h3>
              <p className="text-muted-foreground">
                Verified student and faculty/staff accounts, secure payments, and trusted transaction protection for peace of mind.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover-elevate">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Campus Community</h3>
              <p className="text-muted-foreground">
                Connect directly with the university community on your campus with in-app messaging and designated meetup spots.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover-elevate">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Hassle-Free Payments</h3>
              <p className="text-muted-foreground">
                Multiple payment options including Apple Pay, Venmo, and common credit cards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}