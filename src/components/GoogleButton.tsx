"use client";
import { supabase } from "../../lib/supabaseClient";

export default function GoogleButton() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback", // ou ton domaine
      },
    });
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full py-3 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
    >
      Connexion avec Google
    </button>
  );
}

