// src/utils/foodTranslator.ts
import foodDictionary from '../assets/food_dictionary.json';

export const translateToEnglish = (jpInput: string): string | null => {
  const input = jpInput.trim();

  for (const entry of foodDictionary) {
    if (entry.jp.includes(input)) {
      return entry.en;
    }
  }

  return null; // 辞書に見つからない場合
};
