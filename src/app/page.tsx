"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-4 py-20">
        <h2 className="text-4xl font-bold mb-4">
          Des maths <span className="text-yellow-300">visuelles</span> et interactives
        </h2>
        <p className="text-lg text-gray-200 max-w-xl mb-8">
          Explore les cours de maths en vidéos, quiz, fiches et animations.
        </p>
        <Link href="/auth/inscription">
          <button className="bg-yellow-400 text-black px-6 py-3 font-bold rounded-lg hover:bg-yellow-300 transition">
            Rejoindre gratuitement
          </button>
        </Link>
      </section>

      {/* Stats section */}
      <section className="bg-white text-gray-800 py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <p className="text-3xl font-bold text-blue-600">35+</p>
            <p className="text-sm mt-2">Vidéos pédagogiques</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">12</p>
            <p className="text-sm mt-2">Chapitres couverts</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">100+</p>
            <p className="text-sm mt-2">Quiz interactifs</p>
          </div>
        </div>
      </section>

      {/* Section cours */}
      <section className="py-16 px-4 bg-gray-100 text-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-6">Chapitres disponibles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {["Fonctions", "Second degré", "Probabilités"].map((title, i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition"
              >
                <h4 className="text-lg font-semibold mb-2">{title}</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Découvre ce chapitre en vidéo et quiz.
                </p>
                <Link href="/auth/connexion">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
                    Voir
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white text-center py-6 text-sm">
        © 2025 Pitexplique. Tous droits réservés. |{" "}
        <Link href="/cgu" className="underline">
          Conditions
        </Link>
      </footer>
    </main>
  );
}

