import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../components/supabaseClient";
import { useAuthStore } from "./useAuthStore";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { setUser } = useAuthStore();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
      if (session?.user) {
        setUser(session.user);
      }
    };
    checkSession();
  }, [setUser]);

  if (isAuthenticated === null) {
    return <div className="text-center mt-8">認証確認中...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
