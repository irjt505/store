import { Suspense } from "react";
import LoginPageClient from "./LoginPageClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#A855F7]">
          <div className="text-white text-lg">جاري التحميل...</div>
        </div>
      }
    >
      <LoginPageClient />
    </Suspense>
  );
}
