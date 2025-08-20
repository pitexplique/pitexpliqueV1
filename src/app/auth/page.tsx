"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function AuthPage() {
  // UI state
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // email/password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modeSignup, setModeSignup] = useState(false);

  // class code (élève)
  const [code, setCode] = useState("");
  const [prenom, setPrenom] = useState("");

  // déjà connecté ? -> rediriger
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) window.location.href = "/dashboard";
    });
  }, []);

  async function onGoogleLogin() {
    setMsg(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:3000/auth/callback" },
    });
    if (error) setMsg("Erreur Google : " + error.message);
  }

  async function onEmailSubmit() {
    setLoading(true);
    setMsg(null);
    try {
      if (modeSignup) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Compte créé ✅. Connecte-toi maintenant.");
        setModeSignup(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/dashboard";
      }
    } catch (e: any) {
      setMsg("Erreur : " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function onEleveCode() {
    setLoading(true);
    setMsg(null);
    try {
      // 1) vérifier le code
      const { data: classe } = await supabase
        .from("class_codes")
        .select("code, active")
        .eq("code", code)
        .eq("active", true)
        .maybeSingle();
      if (!classe) {
        setMsg("Code de classe invalide ou inactif.");
        return;
      }
      // 2) créer une session invité
      const { data, error } = await supabase
        .from("guest_sessions")
        .insert({ class_code: code, prenom })
        .select("id")
        .single();
      if (error) throw error;

      // 3) stocker localement et aller au dashboard
      localStorage.setItem("guest_session_id", data.id);
      localStorage.setItem("guest_prenom", prenom);
      window.location.href = "/dashboard";
    } catch (e: any) {
      setMsg("Erreur (élève) : " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        {/* En-tête style Dyma */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded bg-blue-600" />
          <span className="text-xl font-bold">Pitexplique</span>
        </div>
        <h1 className="text-2xl font-extrabold">Bon retour parmi nous !</h1>
        <p className="text-sm text-gray-500 mb-4">Connecte-toi à ton compte</p>

        {/* Email + mot de passe */}
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full rounded border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={onEmailSubmit}
            disabled={loading || !email || !password}
            className="w-full py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {modeSignup ? (loading ? "Création..." : "Créer un compte") : (loading ? "Connexion..." : "Connexion →")}
          </button>

          <div className="text-center">
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setModeSignup((v) => !v)}
            >
              {modeSignup ? "Déjà inscrit ? Se connecter" : "Vous n'avez pas de compte ? Créer un compte"}
            </button>
          </div>
        </div>

        {/* Google */}
        <div className="my-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          onClick={onGoogleLogin}
          className="w-full py-3 rounded border font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.153,7.961,3.039l5.657-5.657C33.53,6.053,28.982,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.153,7.961,3.039l5.657-5.657 C33.53,6.053,28.982,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.191-5.238C29.211,35.965,26.715,37,24,37 c-5.202,0-9.619-3.317-11.277-7.953l-6.552,5.047C9.466,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-3.996,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.191,5.238C36.995,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
          Connexion avec Google
        </button>

        {/* Élève : classe + code */}
        <div className="mt-6">
          <p className="text-sm font-semibold">Ou entrer en <span className="text-indigo-600">mode élève</span></p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input
              className="col-span-1 border rounded px-3 py-2"
              placeholder="Classe (prénom)"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
            <input
              className="col-span-1 border rounded px-3 py-2"
              placeholder="Code (ex: MAT2025A)"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
          </div>
          <button
            onClick={onEleveCode}
            disabled={loading || !prenom || !code}
            className="mt-2 w-full py-3 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            Entrer en classe →
          </button>
          <p className="text-xs text-gray-500 mt-1">Sans email. Idéal pour une séance en classe.</p>
        </div>

        {msg && <div className="mt-4 text-center text-sm">{msg}</div>}
      </div>
    </main>
  );
}
