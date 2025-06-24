import React, { useEffect, useState } from "react";
import { supabase } from "../components/supabaseClient";

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

const Recipes: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [ingredientTried, setIngredientTried] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id ?? null;

      if (uid) {
        const { data, error } = await supabase
          .from("ingredients")
          .select("name")
          .eq("user_id", uid);

        if (!error && data && data.length > 0) {
          for (const item of data) {
            const originalName = item.name.trim();
            console.log(`翻訳中: ${originalName}`);

            // LibreTranslateで英語に翻訳
            const translated = await translateToEnglish(originalName);
            console.log(`翻訳結果: ${translated}`);

            // TheMealDBに問い合わせ
            const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${translated}`);
            const apiData = await res.json();

            if (apiData.meals) {
              setMeals(apiData.meals);
              setIngredientTried(translated);
              setLoading(false);
              return;
            }
          }
        }
      }
      setMeals([]);
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  const translateToEnglish = async (text: string): Promise<string> => {
    try {
      const res = await fetch("https://libretranslate.de/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: "ja",
          target: "en",
          format: "text"
        })
      });
      const data = await res.json();
      return data.translatedText;
    } catch (err) {
      console.error("翻訳エラー:", err);
      return text; // エラー時は元のまま返す
    }
  };

  return (
    <div className="p-4">
      {loading ? (
        <p>読み込み中...</p>
      ) : meals.length === 0 ? (
        <p>該当するレシピが見つかりませんでした。</p>
      ) : (
        <>
          <p className="text-sm text-gray-500">検索に使った英語食材: {ingredientTried}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {meals.map((meal) => (
              <div key={meal.idMeal} className="border rounded p-2 shadow">
                <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-48 object-cover rounded" />
                <p className="text-center mt-2 font-semibold">{meal.strMeal}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Recipes;
