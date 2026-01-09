
import React, { useState, useEffect } from 'react';
import { Recipe, Category, Ingredient } from '../types';
import { CATEGORIES } from '../constants';
import { enhanceDescription } from '../services/geminiService';

interface RecipeFormProps {
  recipe?: Recipe;
  onSave: (recipe: Recipe) => void;
  onCancel: () => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ recipe, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Recipe, 'id' | 'createdAt'>>({
    name: '',
    category: 'Potion',
    description: '',
    imageUrl: '',
    ingredients: [{ name: '', amount: '' }],
    steps: [''],
    notes: ''
  });
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name,
        category: recipe.category,
        description: recipe.description,
        imageUrl: recipe.imageUrl,
        ingredients: [...recipe.ingredients],
        steps: [...recipe.steps],
        notes: recipe.notes
      });
    }
  }, [recipe]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, { name: '', amount: '' }] }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== index) }));
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    setFormData(prev => ({ ...prev, steps: [...prev.steps, ''] }));
  };

  const removeStep = (index: number) => {
    setFormData(prev => ({ ...prev, steps: prev.steps.filter((_, i) => i !== index) }));
  };

  const handleAIEnhance = async () => {
    if (!formData.name) return alert("Enter a name first!");
    setIsEnhancing(true);
    const names = formData.ingredients.map(i => i.name).filter(n => n);
    const enhanced = await enhanceDescription(formData.name, names);
    setFormData(prev => ({ ...prev, description: enhanced }));
    setIsEnhancing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRecipe: Recipe = {
      ...formData,
      id: recipe?.id || Math.random().toString(36).substr(2, 9),
      createdAt: recipe?.createdAt || Date.now()
    };
    onSave(finalRecipe);
  };

  // Helper to handle Google Drive image link conversion
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let url = e.target.value;
    if (url.includes('drive.google.com')) {
        // Simple conversion attempt for sharing links to view links
        const match = url.match(/\/d\/(.+?)\//);
        if (match && match[1]) {
            url = `https://lh3.googleusercontent.com/u/0/d/${match[1]}=w1000`;
        }
    }
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  return (
    <div className="max-w-4xl mx-auto parchment-bg p-8 medieval-border scroll-shadow relative">
      <h2 className="text-3xl font-bold mb-8 text-[#2c1810] border-b-2 border-[#d4af37] pb-2 uppercase tracking-widest">
        {recipe ? 'Edit Grimoire Entry' : 'Record New Concoction'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block fantasy-font font-bold text-[#3d2b1f]">Concoction Name</label>
            <input 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-white/50 border-2 border-[#8b6b10]/30 p-2 focus:border-[#d4af37] outline-none rounded"
              placeholder="e.g. Phoenix Tear Elixir"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block fantasy-font font-bold text-[#3d2b1f]">Category</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full bg-white/50 border-2 border-[#8b6b10]/30 p-2 focus:border-[#d4af37] outline-none rounded"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block fantasy-font font-bold text-[#3d2b1f]">Lore & Description</label>
            <button 
              type="button"
              onClick={handleAIEnhance}
              disabled={isEnhancing}
              className="text-xs bg-[#d4af37] hover:bg-[#8b6b10] text-[#2c1810] px-3 py-1 rounded font-bold uppercase disabled:opacity-50"
            >
              {isEnhancing ? 'Consulting the Spirits...' : 'Consult Alchemist AI ✨'}
            </button>
          </div>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full bg-white/50 border-2 border-[#8b6b10]/30 p-2 focus:border-[#d4af37] outline-none rounded"
            placeholder="Tell the story of this drink..."
          />
        </div>

        <div className="space-y-2">
          <label className="block fantasy-font font-bold text-[#3d2b1f]">Image URL (Web or Google Drive)</label>
          <input 
            value={formData.imageUrl}
            onChange={handleImageUrlChange}
            className="w-full bg-white/50 border-2 border-[#8b6b10]/30 p-2 focus:border-[#d4af37] outline-none rounded"
            placeholder="Paste direct image link here"
          />
          {formData.imageUrl && (
            <div className="mt-2 h-32 w-48 border-2 border-[#d4af37] rounded overflow-hidden">
                <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <label className="block fantasy-font font-bold text-[#3d2b1f] border-b border-[#3d2b1f]/20">Ingredients</label>
          {formData.ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input 
                value={ing.name}
                onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                placeholder="Ingredient"
                className="flex-grow bg-white/50 border border-[#8b6b10]/30 p-1.5 rounded"
              />
              <input 
                value={ing.amount}
                onChange={(e) => handleIngredientChange(idx, 'amount', e.target.value)}
                placeholder="Quantity"
                className="w-32 bg-white/50 border border-[#8b6b10]/30 p-1.5 rounded"
              />
              <button 
                type="button" 
                onClick={() => removeIngredient(idx)}
                className="text-red-700 font-bold px-2 hover:bg-red-100 rounded"
              >✕</button>
            </div>
          ))}
          <button 
            type="button" 
            onClick={addIngredient}
            className="text-sm font-bold text-[#8b6b10] hover:underline"
          >+ Add another reagent</button>
        </div>

        <div className="space-y-4">
          <label className="block fantasy-font font-bold text-[#3d2b1f] border-b border-[#3d2b1f]/20">Incantations (Steps)</label>
          {formData.steps.map((step, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <span className="mt-2 font-bold opacity-50">{idx + 1}.</span>
              <textarea 
                value={step}
                onChange={(e) => handleStepChange(idx, e.target.value)}
                placeholder={`Step ${idx + 1}`}
                rows={1}
                className="flex-grow bg-white/50 border border-[#8b6b10]/30 p-1.5 rounded resize-none"
              />
              <button 
                type="button" 
                onClick={() => removeStep(idx)}
                className="text-red-700 font-bold px-2 hover:bg-red-100 rounded mt-1"
              >✕</button>
            </div>
          ))}
          <button 
            type="button" 
            onClick={addStep}
            className="text-sm font-bold text-[#8b6b10] hover:underline"
          >+ Add another ritual step</button>
        </div>

        <div className="space-y-2">
          <label className="block fantasy-font font-bold text-[#3d2b1f]">Secret Notes</label>
          <textarea 
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={2}
            className="w-full bg-white/50 border-2 border-[#8b6b10]/30 p-2 focus:border-[#d4af37] outline-none rounded"
            placeholder="Special warnings or brewing tips..."
          />
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-[#d4af37]/30">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-2 border-2 border-[#8b6b10] text-[#8b6b10] font-bold rounded hover:bg-[#8b6b10]/10 transition-colors uppercase tracking-widest text-sm"
          >
            Withdraw
          </button>
          <button 
            type="submit"
            className="px-10 py-2 bg-[#d4af37] text-[#2c1810] font-bold rounded hover:bg-[#8b6b10] transition-all shadow-lg uppercase tracking-widest text-sm"
          >
            Scribe into Grimoire
          </button>
        </div>
      </form>
    </div>
  );
};
