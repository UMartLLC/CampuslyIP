import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, Zap, Heart } from "lucide-react";

export default function AboutPage() {
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
      <h1 className="text-4xl font-bold font-heading mb-4">About CampusMarket</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Your trusted university marketplace for buying, selling, and trading within your campus community
      </p>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-4">
            Campusly was created to solve a simple problem: students need an easy, safe, and trusted way to buy and sell items within their campus community. Whether it's textbooks, furniture, electronics, or everyday essentials, we believe students should be able to exchange goods conveniently while saving money and reducing waste.
          </p>
          <p className="text-muted-foreground mb-4">
            Our platform connects students directly, fostering a sense of community while making campus life more affordable and sustainable.
          </p>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <value.icon className="h-6 w-6 text-primary" />
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
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Green Initiative</h2>
          <p className="text-muted-foreground mb-4">
            We’re committed to supporting a greener campus by extending the lifecycle of everyday items. By enabling students, faculty, and staff to buy and sell 
            pre-owned goods within their own university community, our platform reduces unnecessary waste, minimizes the demand for new manufacturing, and lowers the environmental impact associated with shipping. 
            Every exchanged textbook, laptop, or piece of furniture helps keep useful items out of landfills and promotes a more sustainable culture of reuse.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Create Your Account</h3>
                <p className="text-muted-foreground">Sign up with your student email to join your campus marketplace.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">List Your Items</h3>
                <p className="text-muted-foreground">Upload photos, set your price, and describe what you're selling.</p>
              </div>
            </div>
            <div className="flex gap-4">
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

        <section>
          <h2 className="text-2xl font-semibold mb-4">Get In Touch</h2>
          <p className="text-muted-foreground mb-4">
            Have questions, feedback, or suggestions? We'd love to hear from you!
          </p>
          <p className="text-muted-foreground">
            Email us at: <a href="mailto:hello@campusmarket.com" className="text-primary hover:underline">hello@campusmarket.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
