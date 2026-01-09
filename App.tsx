
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Recipe, View } from './types';
import { recipeService } from './services/recipeService';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetail } from './components/RecipeDetail';
import { RecipeForm } from './components/RecipeForm';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.LIST);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    setRecipes(recipeService.getRecipes());
  }, []);

  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      const matchesSearch = 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.ingredients.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = activeCategory === 'All' || r.category === activeCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => b.createdAt - a.createdAt);
  }, [recipes, searchTerm, activeCategory]);

  const handleSaveRecipe = (recipe: Recipe) => {
    recipeService.saveRecipe(recipe);
    setRecipes(recipeService.getRecipes());
    setSelectedRecipe(recipe);
    setView(View.DETAIL);
  };

  const handleDeleteRecipe = (id: string) => {
    recipeService.deleteRecipe(id);
    setRecipes(recipeService.getRecipes());
    setView(View.LIST);
  };

  const categories = ['All', ...new Set(recipes.map(r => r.category))];
  const t = require('./constants').TRANSLATIONS[language] || require('./constants').TRANSLATIONS.en;

  return (
    <Layout title="The Alchemist's Grimoire" language={language} onLanguageChange={setLanguage}>
      {view === View.LIST && (
        <div className="space-y-12">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-[#f4e4bc]/90 p-6 rounded-lg medieval-border scroll-shadow">
            <div className="relative w-full md:w-1/3">
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                className="w-full bg-white/50 border-2 border-[#8b6b10]/40 p-3 pl-12 rounded focus:border-[#d4af37] outline-none fantasy-font"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b6b10]">🔍</span>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    activeCategory === cat 
                    ? 'bg-[#d4af37] text-[#2c1810]' 
                    : 'bg-[#2c1810]/10 text-[#8b6b10] hover:bg-[#2c1810]/20'
                  }`}
                >
                  {cat === 'All' ? t.all : cat}
                </button>
              ))}
            </div>

            <button 
              onClick={() => { setSelectedRecipe(undefined); setView(View.FORM); }}
              className="bg-[#2c1810] text-[#d4af37] px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-bold hover:bg-[#3d2b1f] transition-all uppercase tracking-widest shadow-lg border border-[#d4af37]/30"
            >
              {t.recordNew}
            </button>
          </div>

          {/* Grid */}
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredRecipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  onClick={(id) => {
                    const r = recipes.find(r => r.id === id);
                    setSelectedRecipe(r);
                    setView(View.DETAIL);
                  }}
                  language={language}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#f4e4bc]/50 rounded-xl border-2 border-dashed border-[#d4af37]/30">
              <p className="text-2xl italic text-[#3d2b1f]/60 font-serif">{t.noResults}</p>
              <button 
                onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                className="mt-4 text-[#8b6b10] font-bold underline"
              >
                {t.resetSearch}
              </button>
            </div>
          )}
        </div>
      )}

      {view === View.DETAIL && selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe}
          onBack={() => setView(View.LIST)}
          onEdit={() => setView(View.FORM)}
          onDelete={handleDeleteRecipe}
          language={language}
        />
      )}

      {view === View.FORM && (
        <RecipeForm 
          recipe={selectedRecipe}
          onSave={handleSaveRecipe}
          onCancel={() => {
            if (selectedRecipe) setView(View.DETAIL);
            else setView(View.LIST);
          }}
          language={language}
        />
      )}
    </Layout>
  );
};

export default App;
