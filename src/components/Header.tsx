// components/Header.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import { isAdmin } from "../../lib/utils";

export default function Header() {
  const [email, setEmail] = useState<string | null>(null);
  const [guest, setGuest] = useState<{ id: string; prenom: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (u?.email) {
        setEmail(u.email);
        setGuest(null);
      } else {
        const id = localStorage.getItem("guest_session_id");
        const prenom = localStorage.getItem("guest_prenom");
        if (id && prenom) {
          setGuest({ id, prenom });
        } else {
          setGuest(null);
        }
      }
    });
  }, []);

  async function logoutAll() {
    await supabase.auth.signOut().catch(() => {});
    localStorage.removeItem("guest_session_id");
    localStorage.removeItem("guest_prenom");
    location.href = "/";
  }

  const displayName = guest?.prenom || email || "";

  return (
    <header className="w-full bg-indigo-800 text-white px-6 py-4 flex justify-between items-center shadow">
      <Link href="/" className="text-2xl font-bold">
        <span className="text-yellow-300">π</span> Pitexplique
      </Link>

      {email || guest ? (
        <div className="flex items-center gap-4">
          {/* Nom ou prénom + menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-indigo-700 px-4 py-2 rounded hover:bg-indigo-600 transition"
            >
              {displayName.split("@")[0]}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md z-50">
                <ul>
                  {isAdmin(email) && (
                    <li>
                      <Link
                        href="/admin"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Admin
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Tableau de bord
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Déconnexion */}
          <button
            onClick={logoutAll}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Déconnexion
          </button>
        </div>
      ) : (
        <div className="space-x-4">
          <Link href="/auth/connexion">
            <button className="bg-white text-indigo-800 font-semibold px-4 py-2 rounded hover:bg-gray-200 transition">
              Connexion
            </button>
          </Link>
          <Link href="/auth/inscription">
            <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition">
              Commencer
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
