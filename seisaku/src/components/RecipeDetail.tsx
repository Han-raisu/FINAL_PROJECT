import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface MealDetail {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  [key: string]: any;
  translatedMeal?: string;
  translatedInstructions?: string;
}

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 翻訳API（中継サーバー経由）
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

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await res.json();
        if (data.meals && data.meals.length > 0) {
          const mealData = data.meals[0];
          // 名前・手順を日本語翻訳
          const [translatedMeal, translatedInstructions] = await Promise.all([
            translateToJapanese(mealData.strMeal),
            translateToJapanese(mealData.strInstructions),
          ]);
          setMeal({
            ...mealData,
            translatedMeal,
            translatedInstructions,
          });
        } else {
          setError("レシピが見つかりませんでした。");
        }
      } catch (err) {
        setError("詳細取得エラー");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  // 材料リストを抽出
  const getIngredients = (meal: MealDetail) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${ingredient} ${measure ? `(${measure})` : ""}`);
      }
    }
    return ingredients;
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {loading ? (
        <p>読み込み中...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : meal ? (
        <div className="space-y-4">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="w-full max-h-80 object-cover rounded"
          />
          <h2 className="text-2xl font-bold text-center">
            {meal.translatedMeal ?? meal.strMeal}
          </h2>
          <div>
            <h3 className="font-semibold">材料</h3>
            <ul className="list-disc list-inside">
              {getIngredients(meal).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">作り方</h3>
            <p className="whitespace-pre-line">
              {meal.translatedInstructions ?? meal.strInstructions}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RecipeDetail;
