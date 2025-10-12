import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using UniMart, you accept and agree to be bound by the terms and 
            provisions of this agreement.
          </p>

          <h2>2. User Responsibilities</h2>
          <p>
            Users are responsible for maintaining the confidentiality of their account and password. 
            You agree to accept responsibility for all activities that occur under your account.
          </p>

          <h2>3. Marketplace Conduct</h2>
          <p>
            Users must provide accurate descriptions of items being sold. Fraudulent listings or 
            misrepresentation of items is strictly prohibited.
          </p>

          <h2>4. Payment and Transactions</h2>
          <p>
            All transactions are between buyers and sellers. UniMart facilitates the marketplace 
            but is not responsible for the quality or delivery of items.
          </p>

          <h2>5. Privacy</h2>
          <p>
            Your privacy is important to us. We collect and use personal information only as 
            necessary to provide our services.
          </p>

          <h2>6. Prohibited Items</h2>
          <p>
            Certain items are prohibited from being sold on UniMart, including but not limited to: 
            weapons, illegal substances, and stolen goods.
          </p>

          <h2>7. Modifications to Terms</h2>
          <p>
            UniMart reserves the right to modify these terms at any time. Users will be notified 
            of significant changes.
          </p>

          <p className="text-sm text-muted-foreground mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
