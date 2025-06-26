import React, { useEffect, useState } from "react";
import { supabase } from "../components/supabaseClient";
import { Link } from "react-router-dom";
import { translateToEnglish as dictionaryTranslate } from "../components/foodTranslator";

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

const Recipespege: React.FC = () => {
  // 日本語→英語翻訳関数
  const translateToEnglish = (text: string): string => {
    const cleaned = text.trim().toLowerCase().replace(/\s/g, "");
    const translated = dictionaryTranslate(cleaned);
    return translated ?? cleaned;
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
            const translatedIngredient = translateToEnglish(ingredientName); // ←翻訳ここ！

            const res = await fetch(
              `https://www.themealdb.com/api/json/v1/1/filter.php?i=${translatedIngredient}`
            );
            const apiData = await res.json();

            if (apiData.meals) {
              setMeals(apiData.meals);
              setIngredientTried(item.name); // 元の表示名（日本語）のままでOK
              setLoading(false);
              return;
            }
          }

          setMeals([]);
          setLoading(false);
        } else {
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
      const translatedInput = translateToEnglish(
        searchInput.trim().toLowerCase()
      );

      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${translatedInput}`
      );
      const data = await res.json();

      if (data.meals) {
        setMeals(data.meals);
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
                <p className="text-center mt-2 font-semibold">{meal.strMeal}</p>
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
