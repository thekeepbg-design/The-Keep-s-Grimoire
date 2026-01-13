
import React from 'react';
import { Category } from './types';

export const CATEGORIES: Category[] = [
  "Potion",
  "Elixir",
  "Brew",
  "Enhanced Potion",
  "Dragon's Breath",
  "Nectar"
];

export const THEME_COLORS = {
  BROWN_DARK: '#2c1810',
  BROWN_MEDIUM: '#3d2b1f',
  GOLD_BRIGHT: '#ffd700',
  GOLD_DULL: '#d4af37',
  PARCHMENT: '#f4e4bc'
};

export const INITIAL_RECIPES = [
  {
    id: '1',
    name: 'Dragon Fire Latte',
    category: 'Potion' as Category,
    description: 'A spicy, warming concoction that grants the drinker the courage of a knight. Infused with cinnamon and chili flakes.',
    imageUrl: 'https://picsum.photos/id/431/800/600',
    ingredients: [
      { name: 'Espresso', amount: '2 shots' },
      { name: 'Milk', amount: '200ml' },
      { name: 'Cinnamon Syrup', amount: '15ml' },
      { name: 'Chili Flakes', amount: '1 pinch' }
    ],
    steps: [
      'Extract 2 shots of espresso into a goblet.',
      'Mix in the cinnamon syrup thoroughly.',
      'Steam milk until velvety foam forms.',
      'Pour milk over espresso.',
      'Garnish with a pinch of chili flakes.'
    ],
    notes: 'Serve in a copper mug for maximum effect.',
    createdAt: Date.now()
  },
  {
    id: '2',
    name: 'Elven Forest Tea',
    category: 'Nectar' as Category,
    description: 'Fresh and revitalizing. Gathered from the deepest leaves of the Whispering Woods.',
    imageUrl: 'https://picsum.photos/id/102/800/600',
    ingredients: [
      { name: 'Green Tea Leaves', amount: '5g' },
      { name: 'Honey', amount: '1 tsp' },
      { name: 'Mint Leaves', amount: '3 leaves' },
      { name: 'Hot Water', amount: '300ml' }
    ],
    steps: [
      'Brew tea leaves in 80°C water for 3 minutes.',
      'Strain into a ceramic vessel.',
      'Stir in honey while chanting softly.',
      'Top with fresh mint.'
    ],
    notes: 'Best enjoyed while reading a thick tome.',
    createdAt: Date.now() - 100000
  }
];
