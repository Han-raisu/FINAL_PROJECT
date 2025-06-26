// foodTranslator.ts
import dictionaryJson from "../assets/food_dictionary.json";

const dictionary: Record<string, string> = Array.isArray(dictionaryJson)
  ? dictionaryJson.reduce((acc: Record<string, string>, item: { jp: string[]; en: string }) => {
      item.jp.forEach(jpWord => {
        acc[jpWord] = item.en;
      });
      return acc;
    }, {})
  : {};

export const translateToEnglish = (text: string): string | null => {
  const cleaned = text.trim();
  return dictionary[cleaned] ?? null;
};
