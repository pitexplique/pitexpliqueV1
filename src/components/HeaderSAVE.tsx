// components/Header.tsx
"use client";


import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { isAdmin } from "../../lib/utils";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [email, setEmail] = useState<string | null>(null);
  const [prenom, setPrenom] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (u?.email) {
        setEmail(u.email);
      } else {
        const g = localStorage.getItem("guest_prenom");
        if (g) setPrenom(g);
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut().catch(() => {});
    localStorage.removeItem("guest_session_id");
    localStorage.removeItem("guest_prenom");
    location.href = "/";
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const displayName = email || prenom;

  return (
    <header className="w-full bg-indigo-900 text-white px-4 py-3 flex items-center justify-between shadow-md">
      <Link href="/">
        <h1 className="text-xl font-bold">
          <span className="text-blue-300">π</span> Pitexplique
        </h1>
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center space-x-4">
        {displayName ? (
          <>
            <span className="text-sm opacity-80">Bonjour {displayName}</span>
            {isAdmin(email) && (
              <Link
                href="/admin/page"
                className="hover:underline text-sm"
              >
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/connexion">
              <button className="bg-white text-indigo-900 px-4 py-2 rounded hover:bg-gray-100">
                Connexion
              </button>
            </Link>
            <Link href="/auth/inscription">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Commencer
              </button>
            </Link>
          </>
        )}
      </nav>

      {/* Mobile menu toggle */}
      <div className="md:hidden">
        <button onClick={toggleMenu}>{menuOpen ? <X /> : <Menu />}</button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-indigo-800 text-white flex flex-col space-y-2 p-4 shadow-md md:hidden z-50">
          {displayName ? (
            <>
              <span className="text-sm">Bonjour {displayName}</span>
              {isAdmin(email) && (
                <Link href="/admin/page" className="hover:underline">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/connexion">
                <button className="bg-white text-indigo-900 px-4 py-2 rounded hover:bg-gray-100 w-full">
                  Connexion
                </button>
              </Link>
              <Link href="/auth/inscription">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                  Commencer
                </button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

