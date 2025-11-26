export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold font-heading mb-4">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: November 9, 2024</p>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="text-muted-foreground mb-4">
            This Privacy Policy describes how CampusMarket collects, uses, and protects your personal information when you use our marketplace platform. We are committed to protecting your privacy and ensuring the security of your personal data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p className="text-muted-foreground mb-4">We collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
            <li>Account information (name, email address, username, password)</li>
            <li>Profile information (profile picture, contact preferences)</li>
            <li>Listing information (item descriptions, photos, pricing)</li>
            <li>Transaction information (purchase history, payment details)</li>
            <li>Communication data (messages between buyers and sellers)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Protect against fraudulent or illegal activity</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
          <p className="text-muted-foreground mb-4">
            We do not sell your personal information. We may share your information only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
            <li>With your consent</li>
            <li>To comply with legal requirements</li>
            <li>To protect our rights and prevent fraud</li>
            <li>With service providers who assist in our operations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p className="text-muted-foreground mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p className="text-muted-foreground mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
            <li>Access and review your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to or restrict certain processing</li>
            <li>Download your data in a portable format</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If you have questions about this Privacy Policy, please contact us at privacy@campusmarket.com
          </p>
        </section>
      </div>
    </div>
  );
}
