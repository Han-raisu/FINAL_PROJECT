import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface MealDetail {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  [key: string]: any;
  translatedMeal?: string;
}

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          setMeal({
            ...mealData,
            translatedMeal: null,
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
          <h2 className="text-2xl font-bold text-center">{meal.strMeal}</h2>
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
            {(meal.strInstructions)
              .split(/\r?\n/)
              .filter((line) => line.trim() !== "")
              .map((line, idx) => (
                <p key={idx} className="mb-2 leading-relaxed">
                  {line}
                </p>
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RecipeDetail;
