"use client";

import { useEffect, useState } from "react";
import { Epi } from "../../../../Types";

export default function ListesEPI() {
  const [epis, setEpis] = useState<Epi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [newEpi, setNewEpi] = useState<Omit<Epi, "id">>({
    identifiant_personnalise: "",
    marque: "",
    modèle: "",
    numéro_série: "",
    taille: "",
    couleur: "",
    date_achat: new Date(),
    date_fabrication: new Date(),
    date_mise_service: new Date(),
    type_id: 0,
    périodicité_contrôle: 0,
  });

  useEffect(() => {
    const fetchEpis = async () => {
      try {
        const response = await fetch("http://localhost:5500/epis");
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des données.");
        const data: Epi[] = await response.json();
        setEpis(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpis();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setNewEpi((prev) => ({
      ...prev,
      [name]:
        type === "date"
          ? new Date(value)
          : name === "type_id"
          ? Number(value)
          : value,
    }));
  };

  const formatDateToMySQL = (date: Date): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "";
    }
    return date.toISOString().split("T")[0];
  };

  const handleAddEpi = async () => {
    try {
      const formattedEpi = {
        ...newEpi,
        date_achat: formatDateToMySQL(newEpi.date_achat),
        date_fabrication: formatDateToMySQL(newEpi.date_fabrication),
        date_mise_service: formatDateToMySQL(newEpi.date_mise_service),
      };

      const response = await fetch("http://localhost:5500/epis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedEpi),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error: ${response.status}`);
      }

      const updatedResponse = await fetch("http://localhost:5500/epis");
      const updatedData = await updatedResponse.json();
      setEpis(updatedData);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert(`Erreur lors de l'ajout : ${error}`);
    }
  };

  const handleDeleteEpi = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5500/epis/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

      setEpis((prev) => prev.filter((epi) => epi.id !== id));
      console.log(`EPI avec l'ID ${id} supprimé`);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Liste des EPI</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Ajouter une EPI
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">
              Ajouter une nouvelle EPI
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="identifiant_personnalise"
                placeholder="Identifiant personnalisé"
                value={newEpi.identifiant_personnalise}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <input
                name="marque"
                placeholder="Marque"
                value={newEpi.marque}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <input
                name="modèle"
                placeholder="Modèle"
                value={newEpi.modèle}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <input
                name="numéro_série"
                placeholder="Numéro de Série"
                value={newEpi.numéro_série}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <input
                name="taille"
                placeholder="Taille"
                value={newEpi.taille || ""}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <input
                name="couleur"
                placeholder="Couleur"
                value={newEpi.couleur || ""}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <div className="flex flex-col">
                <p>Type d'EPI</p>
                <input
                  name="type_id"
                  type="number"
                  placeholder="Type ID"
                  value={newEpi.type_id || ""}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                />
              </div>
              <div className="flex flex-col">
                <p>périodicité_contrôle</p>
                <input
                  name="périodicité_contrôle"
                  type="number"
                  placeholder="Périodicité (jours)"
                  value={newEpi.périodicité_contrôle}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                />
              </div>
              <div className="flex flex-col">
                <p>date_fabrication</p>
                <input
                  name="date_fabrication"
                  type="date"
                  value={newEpi.date_fabrication.toISOString().split("T")[0]}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                />
              </div>
              <div className="flex flex-col">
                <p>date_mise_service</p>
                <input
                  name="date_mise_service"
                  type="date"
                  value={newEpi.date_mise_service.toISOString().split("T")[0]}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                />
              </div>
              <div className="flex flex-col">
                <p>date_achat</p>
                <input
                  name="date_achat"
                  type="date"
                  value={newEpi.date_achat.toISOString().split("T")[0]}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                onClick={handleAddEpi}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 bg-white">supprimer</th>
              <th className="border p-2">ID</th>
              <th className="border p-2">Identifiant</th>
              <th className="border p-2">Marque</th>
              <th className="border p-2">Modèle</th>
              <th className="border p-2">Numéro de Série</th>
              <th className="border p-2">Taille</th>
              <th className="border p-2">Couleur</th>
              <th className="border p-2">Date d'Achat</th>
              <th className="border p-2">Date de fabrication</th>
              <th className="border p-2">Date de service</th>
              <th className="border p-2">Périodicité</th>
            </tr>
          </thead>
          <tbody>
            {epis.map((epi) => (
              <tr key={epi.id} className="hover:bg-gray-50">
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleDeleteEpi(epi.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </td>
                <td className="border p-2.5 text-center">{epi.id}</td>
                <td className="border p-2.5">{epi.identifiant_personnalise}</td>
                <td className="border p-2.5">{epi.marque}</td>
                <td className="border p-2.5">{epi.modèle}</td>
                <td className="border p-2.5">{epi.numéro_série}</td>
                <td className="border p-2.5">{epi.taille || "N/A"}</td>
                <td className="border p-2.5">{epi.couleur || "N/A"}</td>
                <td className="border p-2.5">
                  {epi.date_achat.toString().split("T")[0]}
                </td>
                <td className="border p-2.5">
                  {epi.date_fabrication.toString().split("T")[0]}
                </td>
                <td className="border p-2.5">
                  {epi.date_mise_service.toString().split("T")[0]}
                </td>
                <td className="border p-2.5">
                  {epi.périodicité_contrôle} jours
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
