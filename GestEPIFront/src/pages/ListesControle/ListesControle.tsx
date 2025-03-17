import React, { useState, useEffect } from "react";
import { EpiCheck } from "../../../../Types";

const ListesControle = () => {
  const [controles, setControles] = useState<EpiCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedControle, setSelectedControle] = useState<EpiCheck | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEpiChecks = async () => {
      try {
        const response = await fetch("http://localhost:5500/episChecks");

        if (!response.ok) {
          throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Format de données incorrect");
        }

        const sortedChecks = data.sort(
          (a: EpiCheck, b: EpiCheck) => a.id - b.id
        );

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

  const handleModifier = (controle: EpiCheck) => {
    setSelectedControle({ ...controle });
    setIsModalOpen(true);
  };

  const handleSauvegarder = async () => {
    if (!selectedControle) return;

    try {
      const formattedDate = selectedControle.date_contrôle
        ? new Date(selectedControle.date_contrôle).toISOString().split("T")[0]
        : null;

      const response = await fetch(
        `http://localhost:5500/episChecks/${selectedControle.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedControle.id,
            date_contrôle: formattedDate,
            gestionnaire_id: selectedControle.gestionnaire_id || null,
            epi_id: selectedControle.epi_id || null,
            status_id: selectedControle.status_id || null,
            remarques: selectedControle.remarques || null,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erreur lors de la mise à jour");
      }

      const result = await response.json();
      console.log("Résultat de la mise à jour :", result);

      setControles(
        controles.map((c) =>
          c.id === selectedControle.id ? selectedControle : c
        )
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de mettre à jour le contrôle"
      );
    }
  };

  const handleSupprimer = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce contrôle ?"))
      return;

    try {
      const response = await fetch(`http://localhost:5500/episChecks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setControles(controles.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Erreur de suppression :", error);
      setError("Impossible de supprimer le contrôle");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (selectedControle) {
      setSelectedControle({
        ...selectedControle,
        [e.target.name]: e.target.value,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-blue-500">
        Chargement des contrôles...
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="">
      <h1 className="text-2xl font-semibold mb-4">Liste des controles</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Ajouter un controle
      </button>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 space-y-6">
        <table className="w-full">
          <thead className="bg-blue-50">
            <tr>
              {[
                "ID",
                "Date Contrôle",
                "Gestionnaire ID",
                "EPI ID",
                "Statut ID",
                "Remarques",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {controles.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Aucun contrôle trouvé
                </td>
              </tr>
            ) : (
              controles.map((controle) => (
                <tr
                  key={controle.id}
                  className="hover:bg-gray-50 transition-colors"
                  onClick={() => handleModifier(controle)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {controle.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {controle.date_contrôle
                      ? new Date(controle.date_contrôle).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {controle.gestionnaire_id || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {controle.epi_id || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {controle.status_id || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {controle.remarques || "N/A"}
                  </td>
                  <td className="flex px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleModifier(controle)}
                      className="text-blue-600 hover:bg-blue-100 p-2 rounded transition-colors"
                    >
                      ✏️
                    </button>
                    <div className="border-r-2 " />
                    <button
                      onClick={() => handleSupprimer(controle.id)}
                      className="text-red-600 hover:bg-red-100 p-2 rounded transition-colors"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de modification */}
      {isModalOpen && selectedControle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[500px]">
            <h2 className="text-xl font-semibold mb-4">Modifier le Contrôle</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date Contrôle
                </label>
                <input
                  type="date"
                  name="date_contrôle"
                  value={
                    selectedControle.date_contrôle
                      ? new Date(selectedControle.date_contrôle)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gestionnaire ID
                </label>
                <input
                  type="number"
                  name="gestionnaire_id"
                  value={selectedControle.gestionnaire_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Remarques
                </label>
                <textarea
                  name="remarques"
                  value={selectedControle.remarques || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSauvegarder}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListesControle;
