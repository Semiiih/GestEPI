import React, { useState, useEffect } from "react";
import { EpiCheck } from "../../../../Types";

const ListesControle = () => {
  const [controles, setControles] = useState<EpiCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpiChecks = async () => {
      try {
        console.log("Début de la récupération des EpiChecks");
        const response = await fetch("http://localhost:5500/episChecks");

        console.log("Réponse du serveur :", response);

        if (!response.ok) {
          throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }

        const data = await response.json();

        console.log("Données reçues :", data);

        if (!Array.isArray(data)) {
          console.error("Les données reçues ne sont pas un tableau", data);
          throw new Error("Format de données incorrect");
        }

        const sortedChecks = data.sort(
          (a: EpiCheck, b: EpiCheck) => a.id - b.id
        );

        console.log("Contrôles triés :", sortedChecks);

        setControles(sortedChecks);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des EpiChecks :", error);
        setError(
          error instanceof Error
            ? error.message
            : "Une erreur inconnue s'est produite"
        );
        setIsLoading(false);
      }
    };

    fetchEpiChecks();
  }, []);

  if (isLoading) {
    return <div className="p-6 text-center">Chargement des contrôles...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Contrôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gestionnaire ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EPI ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remarques
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {controles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Aucun contrôle trouvé
                  </td>
                </tr>
              ) : (
                controles.map((controle) => {
                  console.log("Détails du contrôle :", controle);
                  return (
                    <tr key={controle.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {controle.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {controle.date_contrôle
                          ? new Date(
                              controle.date_contrôle
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {controle.gestionnaire_id || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {controle.epi_id || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {controle.status_id || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {controle.remarques || "N/A"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListesControle;
