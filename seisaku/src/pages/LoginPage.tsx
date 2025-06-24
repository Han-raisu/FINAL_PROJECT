import { cn } from "../components/ui/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import React, { useState } from "react";
import { supabase } from "../components/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { useUserStore } from "../components/index";

const Login = () => {
  const setUserId = useUserStore((state) => state.setUserId);
  const userId = useUserStore((state) => state.userId);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useUserStore((state) => state.setIsLoggedIn);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // バリデーション
  const validate = () => {
    if (!loginData.email || !loginData.password) {
      setError("メールアドレスとパスワードを入力してください");
      return false;
    }
    // 形式チェックや長さチェックはしない
    return true;
  };
  // ログイン
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("メールアドレスまたはパスワードが正しくありません");
        } else if (error.message.includes("Email not confirmed")) {
          setError("メールアドレスの確認が必要です。メールをご確認ください");
        } else {
          setError(error.message);
        }
        return;
      }

      if (data.user) {
        setUserId(data.user.id);
        setIsLoggedIn(true);
        navigate("/home");
      }
    } catch (err) {
      setError("ログイン処理中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  // ログアウト
  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await supabase.auth.signOut();
      setUserId(null);
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      setError("ログアウト処理中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4")}>
      <Card>
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
          <CardDescription>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isLoggedIn ? (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">メールアドレス</Label>
                  <input
                    id="email"
                    type="email"
                    className="border border-gray-900 p-2"
                    placeholder="m@example.com"
                    required
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">パスワード</Label>
                  </div>
                  <input
                    id="password"
                    type="password"
                    className="border border-gray-900 p-2"
                    required
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    disabled={isLoading}
                  >
                    {isLoading ? "処理中..." : "ログイン"}
                  </button>
                </div>
              </div>
              <div>
                {/* ...ログインフォーム... */}
                <div style={{ marginTop: 16 }}>
                  <Link to="/newLogin">新規登録はこちら</Link>
                </div>
              </div>
            </form>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              ログアウト
            </button>
          )}
        </CardContent>
      </Card>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">使い方</h2>
        <ol className="list-decimal list-inside space-y-4 text-gray-700">
          <li>アカウントを作成してログインします</li>
          <li>家にある食材を登録します</li>
          <li>登録した食材で作れるレシピを確認します</li>
          <li>レシピを参考に料理を作ろう！！</li>
        </ol>
      </div>
    </div>
  );
};

export default Login;
