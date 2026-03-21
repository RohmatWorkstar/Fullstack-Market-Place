import Link from 'next/link';
import Translate from '@/components/Translate';

export default function PrivacyPage() {
  return (
    <div className="container-custom max-w-4xl py-16 animate-fade-in">
      <div className="mb-12 border-b border-surface-200 dark:border-surface-800 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-surface-900 dark:text-surface-50 tracking-tight"><Translate section="privacy" textKey="title" /></h1>
        <p className="text-surface-500 dark:text-surface-300 mt-4 text-lg"><Translate section="privacy" textKey="lastUpdated" /></p>
      </div>

      <div className="space-y-12 text-surface-600 dark:text-surface-200 leading-relaxed text-lg">
        <p className="text-xl">
          <Translate section="privacy" textKey="intro" />
        </p>

        <section className="space-y-4">
           <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight"><Translate section="privacy" textKey="collect" /></h3>
           <p><Translate section="privacy" textKey="collectDesc" /></p>
        </section>

        <section className="space-y-4">
           <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight"><Translate section="privacy" textKey="use" /></h3>
           <p><Translate section="privacy" textKey="useDesc" /></p>
        </section>

        <section className="space-y-4">
           <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight"><Translate section="privacy" textKey="share" /></h3>
           <p><Translate section="privacy" textKey="shareDesc" /></p>
        </section>

        <section className="space-y-4">
            <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100 tracking-tight"><Translate section="privacy" textKey="security" /></h3>
            <p><Translate section="privacy" textKey="securityDesc" /></p>
        </section>

        <section className="bg-primary-50 dark:bg-primary-950/20 p-8 rounded-3xl border border-primary-100 dark:border-primary-900/30 mt-16">
          <h3 className="text-2xl font-bold text-primary-900 dark:text-primary-300 mb-3"><Translate section="privacy" textKey="contact" /></h3>
          <p className="text-primary-700 dark:text-primary-400 mb-4">
            <Translate section="privacy" textKey="contactDesc" />
          </p>
          <Link href="/contact" className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-medium bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl">
             <Translate section="privacy" textKey="submit" />
          </Link>
        </section>
      </div>
    </div>
  );
}
