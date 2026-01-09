
import React from 'react';
import { Recipe } from '../types';

interface RecipeDetailProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onEdit, onDelete, onBack }) => {
  return (
    <div className="max-w-5xl mx-auto parchment-bg medieval-border scroll-shadow relative overflow-hidden flex flex-col md:flex-row">
      {/* Decorative background image */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <img 
          src="https://www.transparenttextures.com/patterns/papyros.png" 
          alt="texture" 
          className="w-full h-full"
        />
      </div>

      {/* Sidebar/Image Section */}
      <div className="md:w-2/5 p-8 border-r border-[#d4af37]/30 bg-[#2c1810]/5 z-10">
        <button 
            onClick={onBack}
            className="mb-6 text-[#8b6b10] hover:text-[#d4af37] font-bold flex items-center gap-2 group"
        >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Archive
        </button>

        <div className="rounded-xl overflow-hidden shadow-xl border-4 border-[#d4af37]/20 mb-6">
          <img src={recipe.imageUrl} alt={recipe.name} className="w-full aspect-square object-cover" />
        </div>

        <div className="space-y-6">
          <div className="bg-[#2c1810]/10 p-4 rounded border-l-4 border-[#d4af37]">
            <h4 className="fantasy-font text-lg font-bold text-[#8b6b10] mb-3 border-b border-[#8b6b10]/20 pb-1 uppercase tracking-tight">Reagents Needed</h4>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex justify-between text-sm italic">
                  <span>{ing.name}</span>
                  <span className="font-bold text-[#8b6b10]">{ing.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => onEdit(recipe)}
              className="flex-grow py-2 bg-[#d4af37]/80 hover:bg-[#d4af37] text-[#2c1810] font-bold rounded uppercase text-xs tracking-widest transition-colors"
            >
              Amend entry
            </button>
            <button 
              onClick={() => { if(confirm("Erase this knowledge forever?")) onDelete(recipe.id); }}
              className="px-4 py-2 border border-red-800 text-red-800 hover:bg-red-50 rounded uppercase text-xs font-bold transition-colors"
            >
              Banish
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="md:w-3/5 p-8 md:p-12 z-10">
        <div className="mb-8">
          <span className="text-xs font-bold bg-[#8b6b10] text-[#f4e4bc] px-3 py-1 rounded-full fantasy-font mb-4 inline-block uppercase tracking-widest">
            {recipe.category}
          </span>
          <h2 className="text-5xl font-bold text-[#2c1810] mb-4 drop-shadow-sm leading-tight">
            {recipe.name}
          </h2>
          <p className="text-xl italic text-[#3d2b1f]/70 leading-relaxed font-serif">
            "{recipe.description}"
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="fantasy-font text-2xl font-bold text-[#8b6b10] mb-4 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#d4af37]"></span> The Brewing Ritual
            </h3>
            <ol className="space-y-6">
              {recipe.steps.map((step, i) => (
                <li key={i} className="relative pl-12">
                  <span className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-[#d4af37] flex items-center justify-center font-bold text-[#8b6b10] text-sm">
                    {i + 1}
                  </span>
                  <p className="text-lg leading-relaxed text-[#3d2b1f]">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {recipe.notes && (
            <div className="bg-[#fcf7e6] p-6 border-2 border-dashed border-[#d4af37]/50 rounded-lg relative mt-12">
              <div className="absolute -top-3 left-6 bg-[#fcf7e6] px-2 text-xs font-bold text-[#8b6b10] uppercase tracking-[0.2em]">
                Scribe's Postscript
              </div>
              <p className="italic text-base text-[#3d2b1f]/80 leading-relaxed">
                {recipe.notes}
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-12 pt-6 border-t border-[#d4af37]/20 flex justify-between text-xs text-[#3d2b1f]/40 font-mono italic">
            <span>Entry created: {new Date(recipe.createdAt).toLocaleDateString()}</span>
            <span>Archival Code: {recipe.id}</span>
        </div>
      </div>
    </div>
  );
};
