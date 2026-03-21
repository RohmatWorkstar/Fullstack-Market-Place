import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="container-custom max-w-4xl py-16 animate-fade-in">
      <div className="mb-12 border-b border-surface-200 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-surface-900 tracking-tight">Privacy Policy</h1>
        <p className="text-surface-500 mt-4 text-lg">Last Updated: March 2026</p>
      </div>

      <div className="space-y-12 text-surface-600 leading-relaxed text-lg">
        <p className="text-xl">
          At Marketplace, we take your privacy seriously. This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you visit our website and use our services.
        </p>

        <section className="space-y-4">
           <h3 className="text-2xl font-bold text-surface-900 tracking-tight">1. Information We Collect</h3>
           <p>
            We collect information that you provide directly to us, such as when you create or modify your
            account, request on-demand services, contact customer support, or otherwise communicate with us.
            This information may include:
           </p>
           <ul className="list-disc pl-6 space-y-2 text-surface-700 bg-surface-50 p-6 rounded-2xl border border-surface-100">
             <li>Name and contact data</li>
             <li>Email address and phone number</li>
             <li>Profile pictures and preferences</li>
             <li>Payment information (processed securely via third-party providers)</li>
           </ul>
        </section>

        <section className="space-y-4">
           <h3 className="text-2xl font-bold text-surface-900 tracking-tight">2. How We Use Your Information</h3>
           <p>We use the information we collect about you to:</p>
           <ul className="list-disc pl-6 space-y-2">
             <li>Provide, maintain, and improve our Services.</li>
             <li>Process transactions and send related information.</li>
             <li>Send support and administrative messages.</li>
             <li>Respond to your comments, questions, and requests.</li>
             <li>Personalize and improve the overall Marketplace experience.</li>
           </ul>
        </section>

        <section className="space-y-4">
           <h3 className="text-2xl font-bold text-surface-900 tracking-tight">3. Sharing of Information</h3>
           <p>We do not sell your personal data. We may share your information as follows:</p>
           <ul className="list-disc pl-6 space-y-2">
             <li>With logistics and shipping partners to fulfill your orders.</li>
             <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</li>
             <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process.</li>
           </ul>
        </section>

        <section className="space-y-4">
            <h3 className="text-2xl font-bold text-surface-900 tracking-tight">4. Data Security</h3>
            <p>
             We take robust, industry-standard measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. All payment and authentication transactions are encrypted using secure protocols. However, no data transmission over the Internet can be guaranteed to be 100% secure.
            </p>
        </section>

        <section className="bg-primary-50 p-8 rounded-3xl border border-primary-100 mt-16">
          <h3 className="text-2xl font-bold text-primary-900 mb-3">Contact Us</h3>
          <p className="text-primary-700 mb-4">
            If you have any questions about this Privacy Policy, your data rights, or how we handle your personal information, please don't hesitate to contact us.
          </p>
          <Link href="/contact" className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-medium bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl">
             Submit Privacy Inquiry
          </Link>
        </section>
      </div>
    </div>
  );
}
