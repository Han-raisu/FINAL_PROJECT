import React, { useEffect, useState } from "react";
import { supabase } from "../components/supabaseClient";

interface Ingredient {
  id: number;
  name: string;
  expiry_date: string;
  remark: string | null;
  created_at: string;
  user_id: string;
  quantity_value: number | null;
  quantity_unit: string | null;
}

const Ingredients = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<Ingredient[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    expiry_date: "",
    remark: "",
    quantity_value: "",
    quantity_unit: "",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    expiry_date: "",
    remark: "",
    quantity_value: "",
    quantity_unit: "",
  });

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) fetchItems(uid);
    };
    fetchSession();
  }, []);

  const fetchItems = async (uid: string) => {
    const { data, error } = await supabase
      .from("ingredients")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    if (!error && data) {
      setItems(data);
    } else {
      console.error("データ取得エラー:", error?.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert("ログインが必要です");
      return;
    }

    const { error } = await supabase.from("ingredients").insert({
      user_id: userId,
      name: formData.name,
      expiry_date: formData.expiry_date,
      remark: formData.remark,
      quantity_value: Number(formData.quantity_value),
      quantity_unit: formData.quantity_unit,
    });

    if (!error) {
      setFormData({
        name: "",
        expiry_date: "",
        remark: "",
        quantity_value: "",
        quantity_unit: "",
      });
      fetchItems(userId);
    } else {
      console.error("登録エラー:", error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!userId) return;

    const { error } = await supabase
      .from("ingredients")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (!error) {
      fetchItems(userId);
    } else {
      console.error("削除エラー:", error.message);
    }
  };

  const startEdit = (item: Ingredient) => {
    setEditId(item.id);
    setEditData({
      name: item.name,
      expiry_date: item.expiry_date,
      remark: item.remark ?? "",
      quantity_value: item.quantity_value?.toString() ?? "",
      quantity_unit: item.quantity_unit ?? "",
    });
  };

  const handleUpdate = async () => {
    if (!userId || editId === null) return;

    const { error } = await supabase
      .from("ingredients")
      .update({
        name: editData.name,
        expiry_date: editData.expiry_date,
        remark: editData.remark,
        quantity_value: Number(editData.quantity_value),
        quantity_unit: editData.quantity_unit,
      })
      .eq("id", editId)
      .eq("user_id", userId);

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
          <form onSubmit={handleSubmit} className="space-y-2 ">
            <div>
              <label className="block font-medium text-gray-900 mb-1 text-xl">
                食材名
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900 mb-1">
                賞味期限
              </label>
              <input
                type="date"
                value={formData.expiry_date}
                onChange={(e) =>
                  setFormData({ ...formData, expiry_date: e.target.value })
                }
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900 mb-1">
                数量
              </label>
              <input
                type="number"
                value={formData.quantity_value}
                onChange={(e) =>
                  setFormData({ ...formData, quantity_value: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900 mb-1 mt-2">
                単位
              </label>
              <select
                value={formData.quantity_unit}
                onChange={(e) =>
                  setFormData({ ...formData, quantity_unit: e.target.value })
                }
                className="border p-2 rounded w-full"
              >
                <option value="">選択してください</option>
                <option value="g">g</option>
                <option value="ml">ml</option>
                <option value="個">個</option>
                <option value="本">本</option>
                <option value="枚">枚</option>
              </select>
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900 mb-1">
                備考
              </label>
              <input
                type="text"
                value={formData.remark}
                onChange={(e) =>
                  setFormData({ ...formData, remark: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded text-xl"
            >
              登録
            </button>
          </form>

          {/* 一覧 + 編集削除 */}
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="border p-2 rounded  leading-relaxed ">
                {editId === item.id ? (
                  <>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="border p-1 rounded w-full mb-1 "
                    />
                    <input
                      type="date"
                      value={editData.expiry_date}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          expiry_date: e.target.value,
                        })
                      }
                      className="border p-1 rounded w-full mb-1 "
                    />
                    <input
                      type="text"
                      value={editData.remark}
                      onChange={(e) =>
                        setEditData({ ...editData, remark: e.target.value })
                      }
                      className="border p-1 rounded w-full mb-1"
                    />
                    <input
                      type="number"
                      value={editData.quantity_value}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          quantity_value: e.target.value,
                        })
                      }
                      className="border p-1 rounded w-full mb-1"
                    />

                    <select
                      value={editData.quantity_unit}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          quantity_unit: e.target.value,
                        })
                      }
                      className="border p-1 rounded w-full mb-1"
                    >
                      <option value="">単位を選択</option>
                      <option value="g">g</option>
                      <option value="ml">ml</option>
                      <option value="個">個</option>
                      <option value="本">本</option>
                      <option value="枚">枚</option>
                    </select>
                    <button
                      onClick={handleUpdate}
                      className="text-green-500 mr-2"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="text-gray-500"
                    >
                      キャンセル
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-xl">食材名: {item.name}</div>
                    <div className="text-xl">賞味期限: {item.expiry_date}</div>
                    <div className="text-xl">備考: {item.remark}</div>
                    <div className="text-xl">
                      数量: {item.quantity_value}
                      {item.quantity_unit ? item.quantity_unit : ""}
                    </div>
                    <button
                      onClick={() => startEdit(item)}
                      className="text-blue-500 mr-2 text-xl"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 text-xl"
                    >
                      削除
                    </button>
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
