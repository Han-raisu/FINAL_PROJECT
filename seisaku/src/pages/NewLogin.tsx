import React, { useState } from "react";
import { cn } from "../components/ui/utils";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { supabase } from "../components/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../components/index";

export function NewLogin({ className, ...props }: React.ComponentProps<"div">) {
  const setUserId = useUserStore((state) => state.setUserId);
  const setIsLoggedIn = useUserStore((state) => state.setIsLoggedIn);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!form.email || !form.password) {
      setError("有効なメールアドレスと6文字以上のパスワードを入力してください");
      return false;
    }
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        setUserId(data.user.id);
        setIsLoggedIn(true);
        navigate("/home");
      }
    } catch {
      setError("新規登録処理中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-lime-50 min-h-screen flex flex-col gap-4">
      <div className={cn(" flex flex-col gap-4", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">新規登録</CardTitle>
            <CardDescription>
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email" className="text-lg">
                    メールアドレス
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="border border-gray-900 p-2"
                    placeholder="m@example.com"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-lg">
                      パスワード
                    </Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    className="border border-gray-900 p-2"
                    placeholder="英数字6文字以上"
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    disabled={isLoading}
                  >
                    {isLoading ? "処理中..." : "サインイン"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="border-2 border-black p-4 rounded-lg shadow-md bg-lime-50">
          <h2 className="text-2xl font-semibold mb-4">使い方</h2>
          <ol className="list-decimal list-inside space-y-4 text-gray-700">
            <li>アカウントを作成してログイン</li>
            <li>家にある食材を登録</li>
            <li>登録した食材で作れるレシピを確認</li>
            <li>食材管理してレシピを参考に料理を作ろう！！</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default NewLogin;
