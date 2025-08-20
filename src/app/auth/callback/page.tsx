"use client";
import { useEffect } from "react";
import { supabase } from "../../../../lib/supabaseClient";

export default function CallbackPage() {
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/auth/connexion";
      }
    });
  }, []);

  return <p className="p-8">Connexion en cours...</p>;
}
