
import { Recipe } from '../types';
import { INITIAL_RECIPES } from '../constants';

const STORAGE_KEY = 'alchemist_grimoire_recipes';

export const recipeService = {
  getRecipes: (): Recipe[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RECIPES));
      return INITIAL_RECIPES;
    }
    return JSON.parse(data);
  },

  saveRecipe: (recipe: Recipe): void => {
    const recipes = recipeService.getRecipes();
    const index = recipes.findIndex(r => r.id === recipe.id);
    
    if (index > -1) {
      recipes[index] = recipe;
    } else {
      recipes.push(recipe);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  },

  deleteRecipe: (id: string): void => {
    const recipes = recipeService.getRecipes();
    const filtered = recipes.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
