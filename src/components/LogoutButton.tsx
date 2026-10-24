"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 bg-white text-purple-700 border border-purple-200 font-bold py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors focus:ring-4 focus:ring-purple-300"
      aria-label="Sair do sistema"
    >
      <LogOut size={20} aria-hidden="true" />
      Sair
    </button>
  );
}