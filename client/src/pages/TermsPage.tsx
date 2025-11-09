export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold font-heading mb-4">Terms and Conditions</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: November 9, 2024</p>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground mb-4">
            By accessing and using CampusMarket, you accept and agree to be bound by these terms and conditions. 
            If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
          <p className="text-muted-foreground mb-4">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities 
            that occur under your account. You must immediately notify us of any unauthorized use of your account.
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
            <li>You must be at least 18 years old to use this service</li>
            <li>You must provide accurate and complete information</li>
            <li>You may not impersonate another person or entity</li>
            <li>One account per user is permitted</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Marketplace Conduct</h2>
          <p className="text-muted-foreground mb-4">When using CampusMarket, you agree to:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
            <li>Provide accurate and honest descriptions of items</li>
            <li>Honor your commitments to buy or sell items</li>
            <li>Communicate respectfully with other users</li>
            <li>Meet in safe, public locations for transactions</li>
            <li>Report any suspicious or fraudulent activity</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Prohibited Items and Activities</h2>
          <p className="text-muted-foreground mb-4">The following items and activities are strictly prohibited:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
            <li>Weapons, explosives, or hazardous materials</li>
            <li>Illegal substances or prescription medications</li>
            <li>Stolen or counterfeit goods</li>
            <li>Spam, scams, or fraudulent listings</li>
            <li>Adult content or services</li>
            <li>Items that violate intellectual property rights</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Payment and Fees</h2>
          <p className="text-muted-foreground mb-4">
            CampusMarket facilitates transactions between buyers and sellers. Payment processing fees may apply 
            depending on the payment method used. We are not responsible for disputes between buyers and sellers 
            regarding payment or item quality.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
          <p className="text-muted-foreground mb-4">
            All content on CampusMarket, including logos, designs, text, and software, is owned by CampusMarket 
            or its licensors. You may not use, copy, or distribute our content without permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
          <p className="text-muted-foreground mb-4">
            CampusMarket provides the platform "as is" and makes no warranties about the quality, safety, or legality 
            of items listed. We are not liable for any damages arising from transactions between users, including but 
            not limited to fraud, defective items, or personal injury.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
          <p className="text-muted-foreground mb-4">
            We reserve the right to suspend or terminate your account at any time for violations of these terms, 
            illegal activity, or other reasons at our discretion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
          <p className="text-muted-foreground mb-4">
            We may modify these terms at any time. Continued use of CampusMarket after changes constitutes 
            acceptance of the updated terms. We will notify users of significant changes via email or platform notification.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
          <p className="text-muted-foreground mb-4">
            If you have questions about these Terms and Conditions, please contact us at legal@campusmarket.com
          </p>
        </section>
      </div>
    </div>
  );
}
