"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("E-mail ou senha incorretos. Tente novamente.");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-purple-100">
        <h1 className="text-2xl font-bold text-purple-900 mb-6 text-center">
          Área Restrita
        </h1>

        {error && (
          <div 
            role="alert" 
            className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 text-sm font-medium"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none text-lg"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none text-lg"
              placeholder="Sua senha secreta"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-purple-700 text-white font-bold text-lg py-3 px-4 rounded-lg hover:bg-purple-800 transition-colors focus:ring-4 focus:ring-purple-300 disabled:opacity-70"
          >
            <LogIn size={20} aria-hidden="true" />
            {loading ? "Entrando..." : "Entrar no Sistema"}
          </button>
        </form>
      </div>
    </div>
  );
}