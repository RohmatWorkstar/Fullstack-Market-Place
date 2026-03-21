export default function PrivacyPage() {
  return (
    <div className="container-custom max-w-3xl py-16 animate-fade-in">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-surface-900 tracking-tight">Privacy Policy</h1>
        <p className="text-surface-500 mt-4">Last Updated: March 2026</p>
      </div>

      <div className="prose prose-surface prose-lg max-w-none">
        <p>
          At Marketplace, we take your privacy seriously. This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you visit our website and use our services.
        </p>

        <h3>1. Information We Collect</h3>
        <p>
          We collect information that you provide directly to us, such as when you create or modify your
          account, request on-demand services, contact customer support, or otherwise communicate with us.
          This information may include: name, email, phone number, postal address, profile picture, payment
          method, items requested, and other information you choose to provide.
        </p>

        <h3>2. How We Use Your Information</h3>
        <p>We may use the information we collect about you to:</p>
        <ul>
          <li>Provide, maintain, and improve our Services.</li>
          <li>Process transactions and send related information.</li>
          <li>Send support and administrative messages.</li>
          <li>Respond to your comments, questions, and requests.</li>
          <li>Personalize and improve the Services.</li>
        </ul>

        <h3>3. Sharing of Information</h3>
        <p>
          We may share your information as follows:
        </p>
        <ul>
          <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</li>
          <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process.</li>
          <li>Between and among Marketplace and our current and future parents, affiliates, subsidiaries, and other companies under common control and ownership.</li>
        </ul>

        <h3>4. Security</h3>
        <p>
          We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. All payment transactions are encrypted using industry-standard protocols.
        </p>

        <h3>5. Contact Us</h3>
        <p>
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@marketplace.example.com" className="text-primary-600 hover:underline">privacy@marketplace.example.com</a>.
        </p>
      </div>
    </div>
  );
}
