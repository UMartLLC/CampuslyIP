import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, Zap, Heart } from "lucide-react";
import CampuslyGreen from '@assets/generated_images/CampuslyGreen.png';

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
    <div id="about" className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold font-heading mb-4">About Campusly</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Your trusted university marketplace for buying, selling, and trading within your campus community
      </p>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-4">
            Campusly was created to address a simple but widespread challenge: university communities need an easy, safe, and 
            trusted way to buy and sell items within their campus community. From textbooks and dorm essentials to 
            electronics and everyday goods, we believe students, faculty, and staff deserve a convenient platform 
            that reduces financial strain while minimizing waste.
          </p>
          <p className="text-muted-foreground mb-4">
            Our mission is to strengthen campus communities by enabling secure peer-to-peer exchanges that make 
            student life more affordable, sustainable, and connected. By promoting reuse and responsible consumption, 
            we hope to empower students to support one another and reduce their environmental footprint.
          </p>
          <p className="text-muted-foreground mb-4">
            Although Campusly is still in active development, we are committed to uplifting the communities we serve. 
            We aim to support local businesses, collaborate with service-oriented organizations, and expand access to 
            essential resources for underserved students. As we grow, our priority is to ensure our platform remains not 
            only practical and reliable, but also aligned with values of equity, accessibility, and community impact.
          </p>
          <p className="text-muted-foreground mb-4">
            Campusly is expected to launch in early 2026.
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

        <section id="green-initiative" className="mb-12">
          <h2  className="text-2xl font-semibold mb-4">
            <span className="inline-flex items-center gap-2 align-middle">
              Our Green Initiative
              <img
                src={CampuslyGreen}
                alt="Leaf icon"
                className="w-6 h-6 m-0 p-0 inline"
              />
            </span>
          </h2>
          <p className="text-muted-foreground mb-4">
            Sustainability is a core pillar at Campusly, and our methods and policies are always changing
            to ensure we can deliver excellent service with a greener environment.
          </p>
          <p className="text-muted-foreground mb-4">
            We're committed to supporting a green campus by extending the lifecycle of everyday items. By enabling students, faculty, and staff to buy and sell
            pre-owned goods within their own university community, our platform reduces unnecessary waste, minimizes the demand for new manufacturing, and lowers the environmental impact associated with shipping.
            Every exchanged textbook, laptop, or piece of furniture helps keep useful items out of landfills and promotes a more sustainable culture of reuse.
          </p>
          <p className="text-muted-foreground mb-4">
            Still curious about our green mission? As Campusly evolves, we'll continue enhancing our eco-friendly initiatives and include more specific information on this page soon.
          </p>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="mb-16">
          <h2 className="text-4xl font-bold font-heading mb-4">How It Works</h2>

          <div className="space-y-12">

            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-6 items-center bg-muted/30 rounded-xl p-4 md:p-6">
              <img
                src="/images/how-1.jpg"
                alt="Create Account"
                className="w-full h-56 md:h-64 object-cover rounded-lg shadow"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">Create Your Account</h3>
                <p className="text-muted-foreground">
                  Sign up using your university credentials to join your verified campus marketplace.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-6 items-center bg-muted/30 rounded-xl p-4 md:p-6">
              <div className="order-2 md:order-1">
                <h3 className="text-xl font-semibold mb-2">List Your Items</h3>
                <p className="text-muted-foreground">
                  Upload photos, set a price, and provide a short description so buyers know exactly what you're offering.
                </p>
              </div>
              <img
                src="/images/how-2.jpg"
                alt="List Items"
                className="order-1 md:order-2 w-full h-56 md:h-64 object-cover rounded-lg shadow"
              />
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-6 items-center bg-muted/30 rounded-xl p-4 md:p-6">
              <img
                src="/images/how-3.jpg"
                alt="Connect & Transact"
                className="w-full h-56 md:h-64 object-cover rounded-lg shadow"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">Connect & Transact</h3>
                <p className="text-muted-foreground">
                  Message buyers or sellers, arrange meetups on campus, and complete secure transactions with confidence.
                </p>
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
