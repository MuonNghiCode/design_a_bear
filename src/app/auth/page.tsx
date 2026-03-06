import AuthBackground from "@/components/auth/AuthBackground";
import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import AuthFormPanel from "@/components/auth/AuthFormPanel";

export default function AuthPage() {
  return (
    <div className="h-screen -mt-20 overflow-hidden relative flex">
      <AuthBackground />
      <AuthBrandPanel />
      <AuthFormPanel />
    </div>
  );
}
