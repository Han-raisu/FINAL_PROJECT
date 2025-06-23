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
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../components/useAuthStore";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    if (error) {
      console.error("ログインエラー:", error.message);
      return;
    }

    if (data.user) {
      setUser(data.user);
      console.log("ログイン成功:", data.user);
      navigate("/home");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: loginData.email,
      password: loginData.password,
    });

    if (error) {
      console.error("新規登録エラー:", error.message);
      return;
    }

    if (data.user) {
      setUser(data.user);
      console.log("新規登録成功:", data.user);
      navigate("/home");
    }
  };

  return (
    <div className={cn("flex flex-col gap-4")}>
      <Card>
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
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
                />
              </div>
              <div className="flex flex-col gap-3">
                <button type="submit" className="w-full">
                  ログイン
                </button>
                <button type="button" onClick={handleSignUp} className="w-full">
                  新規登録
                </button>
              </div>
            </div>
          </form>
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
