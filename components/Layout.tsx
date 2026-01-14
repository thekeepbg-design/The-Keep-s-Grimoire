
import React from 'react';
import { useI18n } from '../i18n';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { language, setLanguage } = useI18n();

  return (
    <div className="min-h-screen bg-[#2c1810] pb-12">
      {/* Header */}
      <header className="py-12 text-center relative overflow-hidden">
        {/* Language Switch Button */}
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
            className="bg-[#2c1810] text-[#d4af37] px-4 py-2 rounded-lg font-bold hover:bg-[#3d2b1f] transition-all uppercase tracking-widest border border-[#d4af37]/50 text-sm"
          >
            {language === 'en' ? 'Tiếng Việt' : 'English'}
          </button>
        </div>

        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img 
            src="https://www.transparenttextures.com/patterns/dark-leather.png" 
            alt="texture" 
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-[#d4af37] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-widest mb-2">
          {title}
        </h1>
        <div className="h-1 w-48 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
        <p className="mt-4 text-[#f4e4bc] italic opacity-80 text-lg">"Where potions meet play."</p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4">
        {children}
      </main>

      {/* Decorative Footer */}
      <footer className="mt-20 text-center text-[#d4af37] opacity-50 border-t border-[#d4af37]/30 pt-8">
        <p className="fantasy-font text-sm uppercase tracking-widest">Property of The Wandering Bard & Alchemist Co.</p>
      </footer>
    </div>
  );
};
