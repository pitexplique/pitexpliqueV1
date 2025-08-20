"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import AuthCard from "../../../components/AuthCard";
import GoogleButton from "../../..//components/GoogleButton";

export default function ConnexionPage() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [msg,setMsg]=useState<string|null>(null); const [loading,setLoading]=useState(false);

  // Mode élève (code classe)
  const [code, setCode] = useState("");
  const [prenom, setPrenom] = useState("");

  useEffect(()=>{ supabase.auth.getUser().then(({data})=>{
    if (data.user) window.location.href="/dashboard";
  })},[]);

  async function signIn() {
    setLoading(true); setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setMsg("Erreur : " + error.message);
    else window.location.href="/dashboard";
  }

  async function signInWithClassCode() {
    setLoading(true); setMsg(null);
    try {
      // Vérifier que le code existe et est actif
      const { data: classe } = await supabase
        .from("class_codes")
        .select("code, active")
        .eq("code", code)
        .eq("active", true)
        .maybeSingle();

      if (!classe) { setMsg("Code invalide ou inactif."); return; }

      // Créer la session invité
      const { data, error } = await supabase
        .from("guest_sessions")
        .insert({ class_code: code, prenom })
        .select("id")
        .single();

      if (error) throw error;

      localStorage.setItem("guest_session_id", data.id);
      localStorage.setItem("guest_prenom", prenom);
      window.location.href="/dashboard";
    } catch (e:any) {
      setMsg("Erreur (mode élève) : " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Bon retour parmi nous !" subtitle="Connectez-vous à votre compte">
      <div className="space-y-3">
        {/* Email / Mot de passe */}
        <input
          className="w-full rounded border px-3 py-2" placeholder="Email"
          type="email" value={email} onChange={e=>setEmail(e.target.value)}
        />
        <input
          className="w-full rounded border px-3 py-2" placeholder="Mot de passe"
          type="password" value={password} onChange={e=>setPassword(e.target.value)}
        />
        <button
          onClick={signIn}
          disabled={loading || !email || !password}
          className="w-full py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Connexion →"}
        </button>

        {/* Google */}
        <div className="my-3">
          <GoogleButton />
        </div>

        <div className="text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">Mot de passe oublié ?</a>
        </div>

        <div className="my-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Mode élève par code */}
        <p className="text-sm font-semibold">Entrer en <span className="text-indigo-600">mode élève</span></p>
        <div className="grid grid-cols-2 gap-2">
          <input
            className="col-span-1 border rounded px-3 py-2" placeholder="Prénom"
            value={prenom} onChange={e=>setPrenom(e.target.value)}
          />
          <input
            className="col-span-1 border rounded px-3 py-2" placeholder="Code (ex: MAT2025A)"
            value={code} onChange={e=>setCode(e.target.value.toUpperCase())}
          />
        </div>
        <button
          onClick={signInWithClassCode}
          disabled={loading || !prenom || !code}
          className="w-full py-3 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          Entrer en classe →
        </button>

        <div className="mt-4 text-center text-sm">
          Pas encore de compte ?{" "}
          <a href="/auth/inscription" className="text-blue-600 hover:underline">Créer un compte</a>
        </div>

        {msg && <p className="text-center text-sm mt-2">{msg}</p>}
      </div>
    </AuthCard>
  );
}
