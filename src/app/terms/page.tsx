import Link from 'next/link';
import Translate from '@/components/Translate';

export default function TermsPage() {
  return (
    <div className="container-custom max-w-4xl py-16 animate-fade-in">
      <div className="mb-12 border-b border-surface-200 dark:border-surface-800 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-surface-900 dark:text-surface-50 tracking-tight"><Translate section="terms" textKey="title" /></h1>
        <p className="text-surface-500 dark:text-surface-300 mt-4 text-lg"><Translate section="terms" textKey="lastUpdated" /></p>
      </div>

      <div className="space-y-12 text-surface-600 dark:text-surface-200 leading-relaxed text-lg">
        <p className="text-xl">
          <Translate section="terms" textKey="intro" />
        </p>

        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold text-sm shrink-0">1</span>
            <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight"><Translate section="terms" textKey="accounts" /></h3>
          </div>
          <div className="pl-12">
            <p><Translate section="terms" textKey="accountsDesc" /></p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold text-sm shrink-0">2</span>
            <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight"><Translate section="terms" textKey="sellerResp" /></h3>
          </div>
          <div className="pl-12">
            <p><Translate section="terms" textKey="sellerRespDesc" /></p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold text-sm shrink-0">3</span>
            <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight"><Translate section="terms" textKey="prohibited" /></h3>
          </div>
          <div className="pl-12">
            <p><Translate section="terms" textKey="prohibitedDesc" /></p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold text-sm shrink-0">4</span>
            <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight"><Translate section="terms" textKey="payment" /></h3>
          </div>
          <div className="pl-12">
            <p><Translate section="terms" textKey="paymentDesc" /></p>
          </div>
        </section>

        <section className="bg-surface-50 dark:bg-surface-900/50 p-8 rounded-3xl border border-surface-200 dark:border-surface-700 mt-16">
          <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-3"><Translate section="terms" textKey="questions" /></h3>
          <p className="text-surface-600 dark:text-surface-300 mb-6">
            <Translate section="terms" textKey="questionsDesc" />
          </p>
          <Link href="/contact" className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-medium bg-white dark:bg-surface-900 border-2 border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
            <Translate section="terms" textKey="contactSupport" />
          </Link>
        </section>
      </div>
    </div>
  );
}
