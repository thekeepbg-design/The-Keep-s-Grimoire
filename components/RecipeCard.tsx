
import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (id: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  return (
    <div 
      onClick={() => onClick(recipe.id)}
      className="parchment-bg medieval-border cursor-pointer group hover:scale-[1.02] transition-transform duration-300 overflow-hidden shadow-2xl relative"
    >
      <div className="h-48 overflow-hidden relative">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.name} 
          className="w-full h-full object-cover filter sepia-[0.3] group-hover:sepia-0 transition-all duration-500"
        />
        <div className="absolute top-2 right-2 bg-[#2c1810]/80 text-[#d4af37] px-3 py-1 text-xs rounded border border-[#d4af37]/50 font-bold fantasy-font uppercase">
          {recipe.category}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-2xl font-bold mb-2 text-[#2c1810] border-b border-[#3d2b1f]/20 pb-1">{recipe.name}</h3>
        <p className="text-sm italic text-[#3d2b1f]/80 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-[#3d2b1f]/60 font-mono">ID: {recipe.id.slice(0, 5)}</span>
          <button className="text-[#8b6b10] hover:text-[#d4af37] font-bold text-sm uppercase tracking-wider">
            Examine →
          </button>
        </div>
      </div>
      {/* Corner decorations */}
      <div className="absolute bottom-0 right-0 w-8 h-8 opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 100" className="fill-[#3d2b1f]">
          <path d="M100,0 L100,100 L0,100 Q50,50 100,0 Z" />
        </svg>
      </div>
    </div>
  );
};
