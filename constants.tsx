
import React from 'react';
import { Category } from './types';

export const CATEGORIES: Category[] = [
  'Potion',
  'Elixir',
  'Brew',
  'Tincture',
  'Nectar',
  'Mystic Blend'
];

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    all: 'All',
    searchPlaceholder: 'Search by name or reagent...',
    recordNew: '+ Record New Entry',
    noResults: 'No such lore exists in these scrolls...',
    resetSearch: 'Reset Archive Search',

    // RecipeForm
    formNewTitle: 'Record New Concoction',
    formEditTitle: 'Edit Grimoire Entry',
    labelName: 'Concoction Name',
    labelCategory: 'Category',
    labelDescription: 'Lore & Description',
    aiButton: 'Consult Alchemist AI ✨',
    aiBusy: 'Consulting the Spirits...',
    labelImage: 'Image URL (Web or Google Drive)',
    addIngredient: '+ Add another reagent',
    addStep: '+ Add another ritual step',
    labelNotes: "Secret Notes",
    withdraw: 'Withdraw',
    submit: 'Scribe into Grimoire',
    customCategoryPlaceholder: 'Type a custom category',

    // RecipeCard / Detail
    examine: 'Examine →',
    idLabel: 'ID:',
    returnButton: 'Return to Archive',
    reagents: 'Reagents Needed',
    amend: 'Amend entry',
    banish: 'Banish',
    ritualTitle: 'The Brewing Ritual',
    postscript: "Scribe's Postscript",
    entryCreated: 'Entry created',
    archivalCode: 'Archival Code',

    // Layout
    lang_en: 'EN',
    lang_vi: 'VI'
  },
  vi: {
    all: 'Tất cả',
    searchPlaceholder: 'Tìm theo tên hoặc thành phần...',
    recordNew: '+ Ghi Lại Món Mới',
    noResults: 'Không có ghi chép phù hợp...',
    resetSearch: 'Đặt lại tìm kiếm',

    // RecipeForm
    formNewTitle: 'Ghi Lại Pha Chế Mới',
    formEditTitle: 'Chỉnh Sửa Ghi Chép',
    labelName: 'Tên Pha Chế',
    labelCategory: 'Thể Loại',
    labelDescription: 'Câu Chuyện & Mô Tả',
    aiButton: 'Gọi Trợ Lý Hóa Thuật ✨',
    aiBusy: 'Đang kết nối các linh hồn...',
    labelImage: 'URL Ảnh (Web hoặc Google Drive)',
    addIngredient: '+ Thêm nguyên liệu',
    addStep: '+ Thêm bước nghi thức',
    labelNotes: 'Ghi chú bí mật',
    withdraw: 'Hủy',
    submit: 'Ghi vào Grimoire',
    customCategoryPlaceholder: 'Nhập thể loại tuỳ chỉnh',

    // RecipeCard / Detail
    examine: 'Xem →',
    idLabel: 'Mã:',
    returnButton: 'Quay lại Kho Lưu Trữ',
    reagents: 'Nguyên Liệu Cần Thiết',
    amend: 'Sửa ghi chép',
    banish: 'Xoá',
    ritualTitle: 'Nghi Thức Pha Chế',
    postscript: 'Ghi chú người ghi',
    entryCreated: 'Ngày tạo',
    archivalCode: 'Mã lưu trữ',

    // Layout
    lang_en: 'EN',
    lang_vi: 'VI'
  }
};

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
