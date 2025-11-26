import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// -----------------------------------------------------------------------------
// 1. FAQPage Component
// -----------------------------------------------------------------------------

export default function FAQPage() {
  // Array defining the static list of frequently asked questions and their answers.
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Click the 'Sign Up' button and fill out the registration form with your information. You'll need to verify your email address to activate your account."
    },
    {
      question: "How do I list an item for sale?",
      answer: "Once logged in, click 'Sell Items' in the navigation menu. Fill out the item details including title, description, price, category, and upload photos. Your listing will be visible immediately."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept credit cards, debit cards, Apple Pay, and Venmo for secure transactions."
    },
    {
      question: "How do I contact a seller?",
      answer: "Click on any item listing and use the 'Contact Seller' button to send a direct message to the seller."
    },
    {
      question: "Can I edit my listing after posting?",
      answer: "Yes, you can edit your listings from your 'My Market' section in your account dashboard."
    },
    {
      question: "Is my personal information safe?",
      answer: "Yes, we take privacy seriously. Your personal information is encrypted and never shared with third parties without your consent."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Title and Subtitle */}
      <h1 className="text-4xl font-bold font-heading mb-4">Frequently Asked Questions</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Find answers to common questions about using our marketplace
      </p>

      {/* FAQ List */}
      <div className="space-y-4">
        {/* Maps through the 'faqs' array to render each question and answer inside a Card. */}
        {faqs.map((faq, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-xl">{faq.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Information Card */}
      <Card className="mt-8">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground">
            Contact our support team at support@campusmarket.com or visit our Help Center for more information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}