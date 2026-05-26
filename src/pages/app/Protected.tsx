import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/app/useAuth";

export default function Protected(){
  const {user,loading}=useAuth();
  if(loading) return <div className="min-h-screen grid place-items-center">Loading...</div>;
  if(!user) return <Navigate to="/app/auth" replace />;
  return <Outlet/>;
}
