"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { isAdmin } from "../../../lib/utils";

type Guest = { id: string; prenom: string } | null;

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [guest, setGuest] = useState<Guest>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (user?.email) {
        if (isAdmin(user.email)) {
          // Redirection vers le dashboard admin
          window.location.href = "/admin";
        } else {
          setEmail(user.email);
        }
      } else {
        // Vérifie s'il y a une session élève invitée
        const id = localStorage.getItem("guest_session_id");
        const prenom = localStorage.getItem("guest_prenom");
        if (id && prenom) {
          setGuest({ id, prenom });
        }
      }
      setLoading(false);
    });
  }, []);

  async function logoutAll() {
    await supabase.auth.signOut().catch(() => {});
    localStorage.removeItem("guest_session_id");
    localStorage.removeItem("guest_prenom");
    location.href = "/";
  }

  if (loading) return <main className="p-8">Chargement…</main>;

  if (!email && !guest) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-3 p-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <a href="/auth/connexion" className="px-4 py-2 border rounded hover:bg-gray-50">
          Se connecter
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      {email ? (
        <>
          <h1 className="text-2xl font-bold">Bonjour {email}</h1>
          <p className="text-sm opacity-70">Dashboard élève connecté</p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold">Bonjour {guest?.prenom}</h1>
          <p className="text-sm opacity-70">Mode élève invité</p>
        </>
      )}

      <button onClick={logoutAll} className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700">
        Se déconnecter
      </button>
    </main>
  );
}
