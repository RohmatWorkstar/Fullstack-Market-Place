import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-surface-200 mt-auto">
      <div className="container-custom py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="text-xl font-bold gradient-text">
              Marketplace
            </Link>
            <p className="text-surface-500 text-sm mt-2">
              Portfolio project built with Next.js & Supabase.
            </p>
          </div>
          
          <div className="flex space-x-6 text-sm text-surface-500">
            <a href="#" className="hover:text-primary-600 transition-colors">About</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Contact</a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-surface-100 text-center text-sm text-surface-400">
          &copy; {new Date().getFullYear()} Marketplace Portfolio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
