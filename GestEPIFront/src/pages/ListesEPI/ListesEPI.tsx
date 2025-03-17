"use client";

import { useEffect, useState } from "react";
import { Epi, EpiType } from "../../../../Types";

export default function ListesEPI() {
  const [epis, setEpis] = useState<Epi[]>([]);
  const [epiTypes, setEpiTypes] = useState<EpiType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEpi, setEditingEpi] = useState<Epi | null>(null);

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
    const fetchData = async () => {
      try {
        // Charger les EPI
        const episResponse = await fetch("http://localhost:5500/epis");
        setEpis(await episResponse.json());

        // Charger les types d'EPI
        const typesResponse = await fetch("http://localhost:5500/epiTypes");
        const typesData: EpiType[] = await typesResponse.json();
        setEpiTypes(typesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Gestion des changements d'input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const updatedValue =
      type === "date"
        ? new Date(value)
        : name === "type_id" || name === "périodicité_contrôle"
        ? Number(value)
        : value;

    if (editingEpi) {
      setEditingEpi((prev) => ({ ...prev!, [name]: updatedValue }));
    } else {
      setNewEpi((prev) => ({ ...prev, [name]: updatedValue }));
    }
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

  const handleEditEpi = async () => {
    if (!editingEpi) return;

    try {
      const formattedEpi = {
        ...editingEpi,
        date_achat: formatDateToMySQL(new Date(editingEpi.date_achat)),
        date_fabrication: formatDateToMySQL(
          new Date(editingEpi.date_fabrication)
        ),
        date_mise_service: formatDateToMySQL(
          new Date(editingEpi.date_mise_service)
        ),
      };

      const response = await fetch(
        `http://localhost:5500/epis/${editingEpi.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedEpi),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error: ${response.status}`);
      }

      const updatedResponse = await fetch("http://localhost:5500/epis");
      const updatedData = await updatedResponse.json();
      setEpis(updatedData);
      setIsModalOpen(false);
      setEditingEpi(null);
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
      alert(`Erreur lors de la modification : ${error}`);
    }
  };

  const handleStartEdit = (epi: Epi) => {
    setEditingEpi(epi);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEpi(null);
  };

  const handleDeleteEpi = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce contrôle ?"))
      return;
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
              {editingEpi ? "Modifier l'EPI" : "Ajouter une nouvelle EPI"}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="identifiant_personnalise"
                placeholder="Identifiant personnalisé"
                value={
                  editingEpi?.identifiant_personnalise ||
                  newEpi.identifiant_personnalise
                }
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <input
                name="marque"
                placeholder="Marque"
                value={editingEpi?.marque || newEpi.marque}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <input
                name="modèle"
                placeholder="Modèle"
                value={editingEpi?.modèle || newEpi.modèle}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <input
                name="numéro_série"
                placeholder="Numéro de Série"
                value={editingEpi?.numéro_série || newEpi.numéro_série}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <input
                name="taille"
                placeholder="Taille"
                value={editingEpi?.taille || newEpi.taille || ""}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <input
                name="couleur"
                placeholder="Couleur"
                value={editingEpi?.couleur || newEpi.couleur || ""}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <div className="flex flex-col">
                <p>Type d'EPI</p>

                <select
                  name="type_id"
                  value={editingEpi?.type_id || newEpi.type_id || ""}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                >
                  <option value="">Sélectionner un type d'EPI</option>
                  {epiTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <p>périodicité_contrôle</p>
                <input
                  name="périodicité_contrôle"
                  type="number"
                  placeholder="Périodicité (jours)"
                  value={
                    editingEpi?.périodicité_contrôle ||
                    newEpi.périodicité_contrôle
                  }
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                />
              </div>
              <div className="flex flex-col">
                <p>date_fabrication</p>
                <input
                  name="date_fabrication"
                  type="date"
                  value={formatDateToMySQL(
                    editingEpi?.date_fabrication
                      ? new Date(editingEpi.date_fabrication)
                      : newEpi.date_fabrication
                  )}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                />
              </div>
              <div className="flex flex-col">
                <p>date_mise_service</p>
                <input
                  name="date_mise_service"
                  type="date"
                  value={formatDateToMySQL(
                    editingEpi?.date_mise_service
                      ? new Date(editingEpi.date_mise_service)
                      : newEpi.date_mise_service
                  )}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                />
              </div>
              <div className="flex flex-col">
                <p>date_achat</p>
                <input
                  name="date_achat"
                  type="date"
                  value={formatDateToMySQL(
                    editingEpi?.date_achat
                      ? new Date(editingEpi.date_achat)
                      : newEpi.date_achat
                  )}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                onClick={editingEpi ? handleEditEpi : handleAddEpi}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                {editingEpi ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-900">
            <thead className="text-xs text-blue-600 uppercase bg-blue-50">
              <tr>
                <th scope="col" className="px-4 py-6">
                  ID
                </th>
                <th scope="col" className="px-4 py-6">
                  Identifiant
                </th>
                <th scope="col" className="px-4 py-6">
                  Marque
                </th>
                <th scope="col" className="px-4 py-6">
                  Modèle
                </th>
                <th scope="col" className="px-4 py-6">
                  Numéro de Série
                </th>
                <th scope="col" className="px-4 py-6">
                  Taille
                </th>
                <th scope="col" className="px-4 py-6">
                  Couleur
                </th>
                <th scope="col" className="px-4 py-6">
                  Types
                </th>
                <th scope="col" className="px-4 py-6">
                  Date d'Achat
                </th>
                <th scope="col" className="px-4 py-6">
                  Date de Fabrication
                </th>
                <th scope="col" className="px-4 py-6">
                  Date de Service
                </th>
                <th scope="col" className="px-4 py-6">
                  Périodicité
                </th>
                <th scope="col" className="px-4 py-6 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {epis.map((epi) => (
                <tr
                  key={epi.id}
                  className="bg-white border-b hover:bg-gray-50 transition duration-200 ease-in-out"
                >
                  <td
                    className="px-4 py-6 font-medium text-gray-900"
                    onClick={() => handleStartEdit(epi)}
                  >
                    {epi.id}
                  </td>
                  <td
                    className="px-4 py-6"
                    onClick={() => handleStartEdit(epi)}
                  >
                    {epi.identifiant_personnalise}
                  </td>
                  <td
                    className="px-4 py-6"
                    onClick={() => handleStartEdit(epi)}
                  >
                    {epi.marque}
                  </td>
                  <td
                    className="px-4 py-6"
                    onClick={() => handleStartEdit(epi)}
                  >
                    {epi.modèle}
                  </td>
                  <td
                    className="px-4 py-6"
                    onClick={() => handleStartEdit(epi)}
                  >
                    {epi.numéro_série}
                  </td>
                  <td
                    className="px-4 py-6"
                    onClick={() => handleStartEdit(epi)}
                  >
                    {epi.taille || "N/A"}
                  </td>
                  <td
                    className="px-4 py-6"
                    onClick={() => handleStartEdit(epi)}
                  >
                    {epi.couleur || "N/A"}
                  </td>
                  <td
                    className="px-4 py-6"
                    onClick={() => handleStartEdit(epi)}
                  >
                    {epiTypes.find((type) => type.id === epi.type_id)?.type}
                  </td>
                  <td
                    className="px-4 py-6"
                    onClick={() => handleStartEdit(epi)}
                  >
                    {new Date(epi.date_achat).toISOString().split("T")[0]}
                  </td>
                  <td
                    className="px-4 py-6"
                    onClick={() => handleStartEdit(epi)}
                  >
                    {new Date(epi.date_fabrication).toISOString().split("T")[0]}
                  </td>
                  <td className="px-4 py-6 onClick={() => handleStartEdit(epi)}">
                    {
                      new Date(epi.date_mise_service)
                        .toISOString()
                        .split("T")[0]
                    }
                  </td>
                  <td
                    className="px-4 py-6"
                    onClick={() => handleStartEdit(epi)}
                  >
                    {epi.périodicité_contrôle} jours
                  </td>

                  <td className="flex px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleStartEdit(epi)}
                      className="text-blue-600 hover:bg-blue-100 p-2 rounded transition transform hover:scale-125"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <div className="border-r-2 " />
                    <button
                      onClick={() => handleDeleteEpi(epi.id)}
                      className="text-red-600 hover:bg-red-100 p-2 rounded transition transform hover:scale-125"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </td>
                  {/* <td className="flex px-6 py-4 whitespace-nowrap text-sm space-x-2">
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
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
