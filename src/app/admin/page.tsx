"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { isAdmin } from "../../../lib/utils";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const userEmail = data.user?.email ?? null;
      setEmail(userEmail);
      setLoading(false);

      if (!isAdmin(userEmail)) {
        router.push("/dashboard");
      }
    });
  }, []);

  if (loading) return <main className="p-8">Chargement...</main>;
  if (!isAdmin(email)) return null;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Espace administrateur</h1>
      <p>Bienvenue, {email}</p>
      <ul className="mt-4 list-disc list-inside">
        <li>Accès à la liste des élèves</li>
        <li>Suivi des progressions</li>
        <li>Gestion des cours et des classes</li>
      </ul>
    </main>
  );
}
