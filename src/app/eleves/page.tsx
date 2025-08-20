import { supabase } from "../../../lib/supabaseClient";

export const revalidate = 0; // pas de cache en dev

export default async function ElevesPage() {
  const { data: eleves, error } = await supabase
    .from("eleves")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <main className="p-6">Erreur: {error.message}</main>;
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Élèves (test lecture)</h1>
      {!eleves?.length ? (
        <p>Aucun élève.</p>
      ) : (
        <table className="w-full border border-gray-200 rounded overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2 border-b">Nom</th>
              <th className="text-left p-2 border-b">Cycle</th>
              <th className="text-left p-2 border-b">Progression</th>
            </tr>
          </thead>
          <tbody>
            {eleves.map((e: any) => (
              <tr key={e.id} className="odd:bg-white even:bg-gray-50">
                <td className="p-2 border-b">{e.nom}</td>
                <td className="p-2 border-b">{e.cycle}</td>
                <td className="p-2 border-b">{e.progression}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
