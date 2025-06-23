import React, { useEffect, useState }  from 'react';


interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}


const Recipes: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [ingredient, setIngredient] = useState(''); // 初期値

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data = await res.json();
        setMeals(data.meals || []);
      } catch (error) {
        console.error('エラー:', error);
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [ingredient]);

  return (
    <div>
      <input
        type="text"
        placeholder="食材を入力（例: 鶏肉）"
        value={ingredient}
        onChange={(e) => setIngredient(e.target.value)}
        className="border mt-4 p-2 mb-4"
      />

      {loading ? (
        <p>読み込み中...</p>
      ) : meals.length === 0 ? (
        <p>該当するレシピが見つかりませんでした。</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {meals.map((meal) => (
            <div key={meal.idMeal} className="border rounded-lg p-2 shadow">
              <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-48 object-cover rounded" />
              <p className="text-center mt-2 font-semibold">{meal.strMeal}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;