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
