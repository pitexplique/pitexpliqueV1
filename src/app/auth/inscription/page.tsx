"use client";

import { useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import AuthCard from "../../../components/AuthCard";
import GoogleButton from "../../../components/GoogleButton";

export default function InscriptionPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signUp() {
    setLoading(true);
    setMsg(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setMsg("❌ Erreur : " + error.message);
    } else if (data.user && !data.session) {
      setMsg("📩 Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte mail.");
    } else {
      setMsg("✅ Compte créé. Vous pouvez vous connecter.");
    }
  }

  return (
    <AuthCard title="Créez votre compte" subtitle="Rejoignez Pitexplique">
      <div className="space-y-3">
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={signUp}
          disabled={loading || !email || !password}
          className="w-full py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer un compte"}
        </button>

        <div className="my-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <GoogleButton />

        <div className="mt-4 text-center text-sm">
          Déjà un compte ?{" "}
          <a href="/auth/connexion" className="text-blue-600 hover:underline">
            Se connecter
          </a>
        </div>

        {msg && (
          <p className="text-center text-sm mt-2 text-blue-700 bg-blue-100 rounded p-2">
            {msg}
          </p>
        )}
      </div>
    </AuthCard>
  );
}
