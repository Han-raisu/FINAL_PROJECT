import React, { useEffect, useState } from "react";
import { supabase } from "../components/supabaseClient";

const Ingredients = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    expiry_date: "",
    remark: ""
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    expiry_date: "",
    remark: ""
  });

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) fetchItems(uid);
    };
    fetchSession();
  }, []);

  const fetchItems = async (uid: string) => {
    const { data, error } = await supabase
      .from("SyokuzaiKanri")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    if (!error) setItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    const { error } = await supabase.from("SyokuzaiKanri").insert({
      user_id: userId,
      name: formData.name,
      expiry_date: formData.expiry_date,
      remark: formData.remark
    });

    if (!error) {
      setFormData({ name: "", expiry_date: "", remark: "" });
      fetchItems(userId);
    } else {
      console.error("登録エラー:", error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!userId) return;

    const { error } = await supabase.from("SyokuzaiKanri")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (!error) {
      fetchItems(userId);
    } else {
      console.error("削除エラー:", error.message);
    }
  };

  const startEdit = (item: any) => {
    setEditId(item.id);
    setEditData({
      name: item.name,
      expiry_date: item.expiry_date,
      remark: item.remark ?? ""
    });
  };

  const handleUpdate = async () => {
    if (!userId || editId === null) return;

    const { error } = await supabase.from("SyokuzaiKanri").update({
      name: editData.name,
      expiry_date: editData.expiry_date,
      remark: editData.remark
    }).eq("id", editId).eq("user_id", userId);

    if (!error) {
      setEditId(null);
      fetchItems(userId);
    } else {
      console.error("更新エラー:", error.message);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {userId ? (
        <>
          {/* 登録フォーム */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">食材名</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">賞味期限</label>
              <input
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
              <input
                type="text"
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">登録</button>
          </form>

          {/* 一覧 + 編集削除 */}
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="border p-2 rounded">
                {editId === item.id ? (
                  <>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="border p-1 rounded w-full mb-1"
                    />
                    <input
                      type="date"
                      value={editData.expiry_date}
                      onChange={(e) => setEditData({ ...editData, expiry_date: e.target.value })}
                      className="border p-1 rounded w-full mb-1"
                    />
                    <input
                      type="text"
                      value={editData.remark}
                      onChange={(e) => setEditData({ ...editData, remark: e.target.value })}
                      className="border p-1 rounded w-full mb-1"
                    />
                    <button onClick={handleUpdate} className="text-green-500 mr-2">保存</button>
                    <button onClick={() => setEditId(null)} className="text-gray-500">キャンセル</button>
                  </>
                ) : (
                  <>
                    <div>食材名: {item.name}</div>
                    <div>賞味期限: {item.expiry_date}</div>
                    <div>備考: {item.remark}</div>
                    <button onClick={() => startEdit(item)} className="text-blue-500 mr-2">編集</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500">削除</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>ログインが必要です</div>
      )}
    </div>
  );
};

export default Ingredients;

/*import { useState } from "react";
import { supabase } from "../components/supabaseClient";
import { useNavigate } from "react-router-dom";
import type{ SyokuzaiKanri } from "../components/index";


function Ingredients() {
  const [ingredients, setIngredients] = useState<SyokuzaiKanri[]>([]);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    comment: "",
    expiryDate: "",
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    remark: "",
    expiryDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: SyokuzaiKanri = {
      id: Math.random().toString(),
      name: newIngredient.name,
      remark: newIngredient.comment,
      expiryDate: newIngredient.expiryDate,
      createdAt: new Date().toISOString(),
      userId: "1",
    };
    setIngredients([...ingredients, newItem]);
    setNewIngredient({ name: "", comment: "", expiryDate: "" });
  };

  const handleDelete = (id: string) => {
    setIngredients(ingredients.filter((item) => item.id !== id));
  };

  const startEdit = (ingredient: Ingredient) => {
    setEditId(ingredient.id);
    setEditData({
      name: ingredient.name,
      remark: ingredient.remark || "",
      expiryDate: ingredient.expiryDate,
    });
  };

  const saveEdit = () => {
    if (!editId) return;
    setIngredients((prev) =>
      prev.map((item) => (item.id === editId ? { ...item, ...editData } : item))
    );
    setEditId(null);
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  return (
    <div className="mt-4 max-w-4xl mx-auto">

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow mb-8"
      >
        <h2 className="text-xl font-semibold mb-2">新しい食材を追加</h2>
        <p className="flex flex-col gap-3">食材名</p>
        <input
          type="text"
          className="block w-full border p-2 rounded"
          placeholder="食材名"
          value={newIngredient.name}
          onChange={(e) =>
            setNewIngredient({ ...newIngredient, name: e.target.value })
          }
          required
        />
        <input
          type="date"
          className="block w-full border p-2 rounded"
          placeholder="賞味期限"
          value={newIngredient.expiryDate}
          onChange={(e) =>
            setNewIngredient({ ...newIngredient, expiryDate: e.target.value })
          }
        />
         <input
          type="text"
          placeholder="備考"
          value={newIngredient.comment}
          onChange={(e) =>
            setNewIngredient({ ...newIngredient, comment: e.target.value })
          }
          required
          className="block w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          追加
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-sm rounded-lg ">
          <thead>
            <tr className="bg-gray-100 text-left ">
              <th className="px-2 py-2">食材名</th>
              <th className="px-2 py-2">カテゴリー</th>
              <th className="px-2 py-2">賞味期限</th>
              <th className="px-2 py-2">登録日</th>
              <th className="px-2 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => (
              <tr key={ingredient.id} className="border-t whitespace-nowrap">
                {editId === ingredient.id ? (
                  <>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={editData.remark}
                        onChange={(e) =>
                          setEditData({ ...editData, remark: e.target.value })
                        }
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="date"
                        value={editData.expiryDate}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            expiryDate: e.target.value,
                          })
                        }
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="px-2 py-2">
                      {new Date(ingredient.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-2 space-x-2">
                      <button onClick={saveEdit} className="text-green-600">
                        保存
                      </button>
                      <button onClick={cancelEdit} className="text-gray-500">
                        キャンセル
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2">{ingredient.name}</td>
                    <td className="px-4 py-2">{ingredient.remark}</td>
                    <td className="px-4 py-2">{ingredient.expiryDate}</td>
                    <td className="px-4 py-2">
                      {new Date(ingredient.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => startEdit(ingredient)}
                        className="text-blue-600"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDelete(ingredient.id)}
                        className="text-red-600"
                      >
                        削除
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Ingredients;*/
