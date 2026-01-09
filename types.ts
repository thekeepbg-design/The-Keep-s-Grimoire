
export interface Ingredient {
  name: string;
  amount: string;
}

export type Category = string;

export interface Recipe {
  id: string;
  name: string;
  category: Category;
  description: string;
  imageUrl: string;
  ingredients: Ingredient[];
  steps: string[];
  notes: string;
  createdAt: number;
}

export enum View {
  LIST = 'LIST',
  DETAIL = 'DETAIL',
  FORM = 'FORM'
}
