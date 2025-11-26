import { Card, CardContent } from "@/components/ui/card";
// Imports icons used to represent the core values from lucide-react.
import { Users, Shield, Zap, Heart } from "lucide-react";

// -----------------------------------------------------------------------------
// 1. AboutPage Component
// -----------------------------------------------------------------------------

export default function AboutPage() {
  // Array defining the structure and content for the "Our Values" section cards.
  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "Built by students, for students. We prioritize creating a safe and trusted environment for campus communities."
    },
    {
      icon: Shield,
      title: "Safety & Trust",
      description: "Your security is our priority. We implement strict verification and secure payment processing to protect every transaction."
    },
    {
      icon: Zap,
      title: "Simple & Fast",
      description: "List items in minutes, connect with buyers instantly, and complete transactions seamlessly."
    },
    {
      icon: Heart,
      title: "Sustainability",
      description: "Promote reuse and reduce waste by giving items a second life within your campus community."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Title and Subtitle */}
      <h1 className="text-4xl font-bold font-heading mb-4">About CampusMarket</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Your trusted student marketplace for buying, selling, and trading within your campus community
      </p>

      {/* prose-slate class applies default, readable typographic styles to nested HTML elements (like h2, p). */}
      <div className="prose prose-slate dark:prose-invert max-w-none">
        
        {/* Our Mission Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-4">
            CampusMarket was created to solve a simple problem: students need an easy, safe, and trusted way to buy and sell items within their campus community. Whether it's textbooks, furniture, electronics, or everyday essentials, we believe students should be able to exchange goods conveniently while saving money and reducing waste.
          </p>
          <p className="text-muted-foreground mb-4">
            Our platform connects students directly, fostering a sense of community while making campus life more affordable and sustainable.
          </p>
        </section>

        {/* Our Values Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Maps through the 'values' array to render the four core value cards. */}
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* Icon container with primary background styling. */}
                    <div className="p-3 rounded-lg bg-primary/10">
                      <value.icon className="h-6 w-6 text-primary" /> {/* Dynamic icon rendering */}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-4">
            
            {/* Step 1: Create Your Account */}
            <div className="flex gap-4">
              {/* Styled number circle (1) */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Create Your Account</h3>
                <p className="text-muted-foreground">Sign up with your student email to join your campus marketplace.</p>
              </div>
            </div>
            
            {/* Step 2: List Your Items */}
            <div className="flex gap-4">
              {/* Styled number circle (2) */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">List Your Items</h3>
                <p className="text-muted-foreground">Upload photos, set your price, and describe what you're selling.</p>
              </div>
            </div>
            
            {/* Step 3: Connect & Transact */}
            <div className="flex gap-4">
              {/* Styled number circle (3) */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Connect & Transact</h3>
                <p className="text-muted-foreground">Chat with buyers or sellers, arrange meetups, and complete secure transactions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Get In Touch Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Get In Touch</h2>
          <p className="text-muted-foreground mb-4">
            Have questions, feedback, or suggestions? We'd love to hear from you!
          </p>
          <p className="text-muted-foreground">
            {/* Link to contact email. */}
            Email us at: <a href="mailto:hello@campusmarket.com" className="text-primary hover:underline">hello@campusmarket.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}