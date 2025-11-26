import { Button } from "@/components/ui/button";
// Imports icons used in the features section and buttons (ArrowRight, Shield, Users, CreditCard).
import { ArrowRight, Shield, Users, CreditCard } from "lucide-react";
// Imports the Link component from wouter for client-side navigation.
import { Link } from "wouter";
// Imports the hero background image from a local assets path.
import heroImage from '@assets/generated_images/Students_collaborating_on_campus_4b173564.png';

// -----------------------------------------------------------------------------
// 1. HeroSection Component
// -----------------------------------------------------------------------------

// Defines the main HeroSection component, serving as the landing page header and features block.
export default function HeroSection() {
  return (
    <div className="relative">
      {/* Hero Background and Overlay */}
      <div 
        // Sets the container to a fixed height with background cover properties.
        className="relative h-[600px] bg-cover bg-center bg-no-repeat"
        // Dynamically sets the imported image as the CSS background.
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Dark overlay for text readability */}
        {/* Creates a translucent gradient overlay to ensure white text stands out against the background image. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        
        {/* Hero Content (Text and Buttons) */}
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 leading-tight">
              Buy, Sell, Connect
              {/* Secondary title line using the theme foreground color (for contrast). */}
              <span className="block text-primary-foreground">Your Campus Marketplace</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              Safe, easy, and trusted platform for students to exchange textbooks, electronics, furniture, and more with secure payments.
            </p>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/items">
                {/* Primary Call to Action: Start Browsing */}
                <Button size="lg" className="text-lg px-8 py-6" data-testid="button-start-browsing">
                  Start Browsing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/sell">
                {/* Secondary Call to Action: Sell Now */}
                <Button 
                  variant="outline" 
                  size="lg" 
                  // Custom styling to make the outline button transparent and white, suitable for a dark background.
                  className="text-lg px-8 py-6 bg-background/10 backdrop-blur border-white/20 text-white hover:bg-background/20" 
                  data-testid="button-sell-now"
                >
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
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Why Students Choose CampusMarket</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built specifically for the campus community with safety, simplicity, and trust at the core.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Safety and Security */}
            <div className="text-center p-6 rounded-lg hover-elevate">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Safe & Secure</h3>
              <p className="text-muted-foreground">
                Verified student accounts, secure payments, and trusted transaction protection for peace of mind.
              </p>
            </div>
            
            {/* Feature 2: Campus Community */}
            <div className="text-center p-6 rounded-lg hover-elevate">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Campus Community</h3>
              <p className="text-muted-foreground">
                Connect directly with fellow students on your campus. Easy meetups and local exchanges.
              </p>
            </div>
            
            {/* Feature 3: Easy Payments */}
            <div className="text-center p-6 rounded-lg hover-elevate">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Payments</h3>
              <p className="text-muted-foreground">
                Multiple payment options including Apple Pay, Venmo, and credit cards. Get paid instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}