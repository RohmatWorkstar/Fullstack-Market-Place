import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="container-custom max-w-4xl py-16 animate-fade-in">
      <div className="mb-12 border-b border-surface-200 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-surface-900 tracking-tight">Terms of Service</h1>
        <p className="text-surface-500 mt-4 text-lg">Last Updated: March 2026</p>
      </div>

      <div className="space-y-12 text-surface-600 leading-relaxed text-lg">
        <p className="text-xl">
          Welcome to Marketplace. By accessing or using our website and services, you agree to be bound by these Terms of Service. Please read them carefully before using our platform.
        </p>

        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-sm shrink-0">1</span>
            <h3 className="text-2xl font-bold text-surface-900 tracking-tight">User Accounts</h3>
          </div>
          <div className="pl-12">
            <p>
              To use certain features of our platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process. You are responsible for safeguarding your password and for all activities that occur under your account. You must notify us immediately of any unauthorized use.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-sm shrink-0">2</span>
            <h3 className="text-2xl font-bold text-surface-900 tracking-tight">Seller Responsibilities</h3>
          </div>
          <div className="pl-12">
            <p>
              If you register as a seller, you agree that your product listings will be accurate and that you possess the necessary rights and inventory to fulfill orders. We reserve the right to suspend or terminate accounts that violate our policies, sell counterfeit goods, or provide consistently poor customer experiences.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-sm shrink-0">3</span>
            <h3 className="text-2xl font-bold text-surface-900 tracking-tight">Prohibited Activities</h3>
          </div>
          <div className="pl-12">
            <p className="mb-4">Users of our platform agree not to engage in any of the following:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violating any applicable laws or trading regulations.</li>
              <li>Infringing on intellectual property rights of third parties.</li>
              <li>Distributing viruses, malware, or any harmful code.</li>
              <li>Attempting to interfere with the network, data security, or infrastructure of the platform.</li>
              <li>Engaging in fraudulent or deceptive practices.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-sm shrink-0">4</span>
            <h3 className="text-2xl font-bold text-surface-900 tracking-tight">Payment & Transactions</h3>
          </div>
          <div className="pl-12">
            <p>
              All payments are processed securely by our third-party payment providers. Buyers agree to pay the listed price plus any applicable taxes and shipping fees. We reserve the right to cancel any orders that appear fraudulent or violate our terms. Funds for sellers are held in escrow until the delivery is confirmed.
            </p>
          </div>
        </section>

        <section className="bg-surface-50 p-8 rounded-3xl border border-surface-200 mt-16">
          <h3 className="text-2xl font-bold text-surface-900 mb-3">Questions about our Terms?</h3>
          <p className="text-surface-600 mb-6">
            If you require clarification on any of the points above, please reach out to our legal team before proceeding to use the platform.
          </p>
          <Link href="/contact" className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-medium bg-white border-2 border-surface-200 text-surface-700 hover:bg-surface-50 transition-colors">
            Contact Support
          </Link>
        </section>
      </div>
    </div>
  );
}
