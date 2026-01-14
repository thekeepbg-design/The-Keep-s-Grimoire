import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'vi';

export interface Translations {
  searchPlaceholder: string;
  recordNewEntry: string;
  noResults: string;
  resetSearch: string;
  propertyOf: string;
  wherePotion: string;
  alchemistGrimoire: string;
  examine: string;
  id: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  recipeName: string;
  category: string;
  description: string;
  ingredients: string;
  steps: string;
  notes: string;
  amount: string;
  dragFireLatte: string;
  dragFireLatteDesc: string;
  elvenForestTea: string;
  elvenForestTeaDesc: string;
  espresso: string;
  milk: string;
  cinnamonSyrup: string;
  chiliFlakes: string;
  greenTeaLeaves: string;
  honey: string;
  mintLeaves: string;
  hotWater: string;
  dragFireLatteNotes: string;
  elvenForestTeaNotes: string;
  dragFireLatteSteps: string[];
  elvenForestTeaSteps: string[];
  potion: string;
  elixir: string;
  brew: string;
  enhancedPotion: string;
  dragonBreath: string;
  nectar: string;
  all: string;
}

const enTranslations: Translations = {
  searchPlaceholder: "Search by name or reagent...",
  recordNewEntry: "+ Record New Entry",
  noResults: "No such lore exists in these scrolls...",
  resetSearch: "Reset Archive Search",
  propertyOf: "Property of The Wandering Bard & Alchemist Co.",
  wherePotion: "\"Where potions meet play.\"",
  alchemistGrimoire: "The Alchemist's Grimoire",
  examine: "Examine →",
  id: "ID",
  edit: "Edit",
  delete: "Delete",
  save: "Save Recipe",
  cancel: "Cancel",
  recipeName: "Recipe Name",
  category: "Category",
  description: "Description",
  ingredients: "Ingredients",
  steps: "Steps",
  notes: "Notes",
  amount: "Amount",
  dragFireLatte: "Dragon Fire Latte",
  dragFireLatteDesc: "A spicy, warming concoction that grants the drinker the courage of a knight. Infused with cinnamon and chili flakes.",
  elvenForestTea: "Elven Forest Tea",
  elvenForestTeaDesc: "Fresh and revitalizing. Gathered from the deepest leaves of the Whispering Woods.",
  espresso: "Espresso",
  milk: "Milk",
  cinnamonSyrup: "Cinnamon Syrup",
  chiliFlakes: "Chili Flakes",
  greenTeaLeaves: "Green Tea Leaves",
  honey: "Honey",
  mintLeaves: "Mint Leaves",
  hotWater: "Hot Water",
  dragFireLatteNotes: "Serve in a copper mug for maximum effect.",
  elvenForestTeaNotes: "Best enjoyed while reading a thick tome.",
  dragFireLatteSteps: [
    "Extract 2 shots of espresso into a goblet.",
    "Mix in the cinnamon syrup thoroughly.",
    "Steam milk until velvety foam forms.",
    "Pour milk over espresso.",
    "Garnish with a pinch of chili flakes."
  ],
  elvenForestTeaSteps: [
    "Brew tea leaves in 80°C water for 3 minutes.",
    "Strain into a ceramic vessel.",
    "Stir in honey while chanting softly.",
    "Top with fresh mint."
  ],
  potion: "Potion",
  elixir: "Elixir",
  brew: "Brew",
  enhancedPotion: "Enhanced Potion",
  dragonBreath: "Dragon's Breath",
  nectar: "Nectar",
  all: "All"
};

const viTranslations: Translations = {
  searchPlaceholder: "Tìm kiếm theo tên hoặc thành phần...",
  recordNewEntry: "+ Ghi lại Công thức Mới",
  noResults: "Không có bản ghi nào trong những cuốn sách này...",
  resetSearch: "Đặt lại Tìm kiếm Kho Lưu trữ",
  propertyOf: "Tài sản của Công ty Bard & Alchemist Du Hành",
  wherePotion: "\"Nơi các bình elixir gặp trò chơi.\"",
  alchemistGrimoire: "Sách Phù Thủy của Nhà Giả Kim",
  examine: "Kiểm tra →",
  id: "Mã",
  edit: "Chỉnh sửa",
  delete: "Xóa",
  save: "Lưu Công thức",
  cancel: "Hủy",
  recipeName: "Tên Công thức",
  category: "Danh mục",
  description: "Mô tả",
  ingredients: "Thành phần",
  steps: "Các bước",
  notes: "Ghi chú",
  amount: "Lượng",
  dragFireLatte: "Cà phê Nóng Rồng",
  dragFireLatteDesc: "Một loại nước đựa spicy ấm áp cấp cho người uống can đảm của một hiệp sĩ. Được trộn với quế và mảnh ớt.",
  elvenForestTea: "Trà Rừng Tinh Linh",
  elvenForestTeaDesc: "Tươi mới và sảng khoái. Thu thập từ những lá sâu nhất của các Khu Rừng Thì thầm.",
  espresso: "Espresso",
  milk: "Sữa",
  cinnamonSyrup: "Siro Quế",
  chiliFlakes: "Mảnh Ớt",
  greenTeaLeaves: "Lá Trà Xanh",
  honey: "Mật ong",
  mintLeaves: "Lá Bạc Hà",
  hotWater: "Nước nóng",
  dragFireLatteNotes: "Phục vụ trong một chiếc cốc đồng để có hiệu quả tối đa.",
  elvenForestTeaNotes: "Tốt nhất được thưởng thức khi đọc một cuốn sách dày.",
  dragFireLatteSteps: [
    "Chiết xuất 2 shots espresso vào một cống.",
    "Trộn siro quế kỹ lưỡng.",
    "Đánh sữa cho đến khi tạo thành bọt mịn.",
    "Đổ sữa qua espresso.",
    "Trang trí với một chút mảnh ớt."
  ],
  elvenForestTeaSteps: [
    "Pha trà lá trong nước 80°C trong 3 phút.",
    "Lọc vào một bình gốm.",
    "Khuấy mật ong trong khi hát nhẹ nhàng.",
    "Thêm bạc hà tươi."
  ],
  potion: "Bình elixir",
  elixir: "Nước uống kỳ diệu",
  brew: "Nước pha",
  enhancedPotion: "Bình elixir Tăng cường",
  dragonBreath: "Hơi thở Rồng",
  nectar: "Mật",
  all: "Tất cả"
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string | string[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: keyof Translations): string | string[] => {
    const translations = language === 'en' ? enTranslations : viTranslations;
    return translations[key];
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};
