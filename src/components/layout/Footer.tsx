import Link from 'next/link';
import Translate from '@/components/Translate';

export default function Footer() {
  return (
    <footer className="bg-surface-50 dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 mt-auto">
      <div className="container-custom py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="text-xl font-bold gradient-text">
              Marketplace
            </Link>
            {/* <p className="text-surface-500 dark:text-surface-400 text-sm mt-2">
              <Translate section="footer" textKey="tagline" />
            </p> */}
          </div>
          
          <div className="flex space-x-6 text-sm text-surface-500 dark:text-surface-300">
            <Link href="/about" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"><Translate section="footer" textKey="aboutUs" /></Link>
            <Link href="/terms" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"><Translate section="footer" textKey="termsOfService" /></Link>
            <Link href="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"><Translate section="footer" textKey="privacyPolicy" /></Link>
            <Link href="/contact" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"><Translate section="footer" textKey="contactSupport" /></Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-surface-100 dark:border-surface-800 text-center text-sm text-surface-500 dark:text-surface-400">
          &copy; {new Date().getFullYear()} Rohmat's Portfolio. <Translate section="footer" textKey="rights" />
        </div>
      </div>
    </footer>
  );
}
