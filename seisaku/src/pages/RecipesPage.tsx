import React, { useEffect, useState } from "react";
import { supabase } from "../components/supabaseClient";
import { Link } from "react-router-dom";
import { translateToEnglish as dictionaryTranslate } from "../components/foodTranslator";

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  translatedMeal?: string;
}

const Recipespege: React.FC = () => {
  // 日本語→英語翻訳関数
  const translateToEnglish = async (text: string): Promise<string> => {
    const cleaned = text.trim();
    const fromDictionary = dictionaryTranslate(cleaned);
    if (fromDictionary) return fromDictionary;

    try {
      const res = await fetch("http://localhost:3001/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: cleaned,
          source: "ja",
          target: "en",
          format: "text",
        }),
      });
      const data = await res.json();
      return data.translatedText;
    } catch (err) {
      console.error("翻訳エラー:", err);
      return cleaned;
    }
  };

  // 英語→日本語翻訳関数
  const translateToJapanese = async (text: string): Promise<string> => {
    try {
      const res = await fetch("http://localhost:3001/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: "en",
          target: "ja",
          format: "text",
        }),
      });
      const data = await res.json();
      return data.translatedText;
    } catch (err) {
      console.error("翻訳エラー:", err);
      return text;
    }
  };
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ingredientTried, setIngredientTried] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");

  // 初期：登録済み食材からレシピ候補を表示
  useEffect(() => {
    const fetchUserAndIngredients = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const uid = session?.user?.id ?? null;

      if (uid) {
        const { data, error } = await supabase
          .from("ingredients")
          .select("name")
          .eq("user_id", uid);

        if (!error && data && data.length > 0) {
          for (const item of data) {
            const ingredientName = item.name.trim().toLowerCase();
            console.log(`試行中: ${ingredientName}`);

            // 日本語→英語翻訳してからAPIに投げる
            const translatedIngredient = await translateToEnglish(
              ingredientName
            );
            console.log(`翻訳後: ${translatedIngredient}`);

            const res = await fetch(
              `https://www.themealdb.com/api/json/v1/1/filter.php?i=${translatedIngredient}`
            );
            const apiData = await res.json();
            if (apiData.meals) {
              const translatedMeals: Meal[] = await Promise.all(
                apiData.meals.map(async (meal: Meal) => {
                  const translated = await translateToJapanese(meal.strMeal);
                  return { ...meal, translatedMeal: translated };
                })
              );
              setMeals(translatedMeals);
              setIngredientTried(ingredientName);
              setLoading(false);
              return;
            }
          }
          setMeals([]);
          setLoading(false);
        } else {
          console.warn("食材が登録されていません。");
          setMeals([]);
          setLoading(false);
        }
      }
    };

    fetchUserAndIngredients();
  }, []);

  // 自由検索
  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    setLoading(true);
    try {
      // 日本語→英語翻訳してからAPIに投げる
      const translatedInput = await translateToEnglish(
        searchInput.trim().toLowerCase()
      );
      console.log(`検索翻訳後: ${translatedInput}`);

      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${translatedInput}`
      );
      const data = await res.json();

      if (data.meals) {
        // レシピ名を日本語翻訳
        const translatedMeals: Meal[] = await Promise.all(
          data.meals.map(async (meal: Meal) => {
            const translated = await translateToJapanese(meal.strMeal);
            return { ...meal, translatedMeal: translated };
          })
        );
        setMeals(translatedMeals);
      } else {
        setMeals([]);
      }
      setIngredientTried(searchInput.trim().toLowerCase());
    } catch (err) {
      console.error("検索エラー:", err);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="食材名を入力（例: 鶏肉、たまご）"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 rounded"
        >
          検索
        </button>
      </div>

      {loading ? (
        <p>読み込み中...</p>
      ) : meals.length === 0 ? (
        <p>該当するレシピが見つかりませんでした。</p>
      ) : (
        <>
          <p className="text-sm text-gray-500">
            検索に使った食材: {ingredientTried}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {meals.map((meal) => (
              <div key={meal.idMeal} className="border rounded p-2 shadow">
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  className="w-full h-48 object-cover rounded"
                />
                <p className="text-center mt-2 font-semibold">
                  {" "}
                  {meal.translatedMeal ?? meal.strMeal}
                </p>
                <Link
                  to={`/recipes/${meal.idMeal}`}
                  className="block text-blue-500 text-center mt-1 underline"
                >
                  詳細を見る
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Recipespege;
