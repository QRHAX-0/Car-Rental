import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-20 border-t bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12 font-['Plus_Jakarta_Sans'] text-sm">
        <div className="space-y-6">
          <a className="text-xl font-bold tracking-tighter text-slate-900 dark:text-slate-50" href="#">LUXE</a>
          <p className="text-slate-500 max-w-xs leading-relaxed">
            Elevating the car rental experience with a curated selection of premium vehicles and bespoke concierge services.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-24">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-slate-50 uppercase tracking-widest text-[10px]">Company</h4>
            <nav className="flex flex-col gap-3">
              <a className="text-slate-500 hover:text-slate-900 transition-colors" href="#">Privacy Policy</a>
              <a className="text-slate-500 hover:text-slate-900 transition-colors" href="#">Terms of Service</a>
              <a className="text-slate-500 hover:text-slate-900 transition-colors" href="#">Fleet</a>
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-slate-50 uppercase tracking-widest text-[10px]">Support</h4>
            <nav className="flex flex-col gap-3">
              <a className="text-slate-500 hover:text-slate-900 transition-colors" href="#">Contact</a>
              <a className="text-slate-500 hover:text-slate-900 transition-colors" href="#">Locations</a>
              <a className="text-slate-500 hover:text-slate-900 transition-colors" href="#">FAQ</a>
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-slate-50 uppercase tracking-widest text-[10px]">Social</h4>
            <div className="flex gap-4">
              <a className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition-colors" href="#">
                <span className="material-symbols-outlined text-sm">share</span>
              </a>
              <a className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition-colors" href="#">
                <span className="material-symbols-outlined text-sm">alternate_email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
        <p>© 2024 Luxe Rentals. All rights reserved.</p>
        <div className="flex gap-8">
          <a className="hover:text-slate-900 transition-colors" href="#">Cookies</a>
          <a className="hover:text-slate-900 transition-colors" href="#">Accessibility</a>
          <a className="hover:text-slate-900 transition-colors" href="#">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
