"use client";

import { useEffect, useState } from "react";
import { Epi, EpiType } from "../../../../Types";
import { Plus, Save, Shield, X } from "lucide-react";
import { DataTable } from "../../components/atoms/DataTable/DataTable";

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
        const episResponse = await fetch("http://localhost:5500/epis");
        setEpis(await episResponse.json());

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
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const renderTableCell = (epi: Epi) => (
    <>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
        {epi.id}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
        {epi.identifiant_personnalise}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
        {epi.marque}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
        {epi.modèle}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
        {epi.numéro_série}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
        {epi.taille || "N/A"}
      </td>
      {/* <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{epi.couleur || "N/A"}</td> */}
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
        {epiTypes.find((type) => type.id === epi.type_id)?.type || "Inconnu"}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
        {formatDateToMySQL(new Date(epi.date_achat))}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
        {formatDateToMySQL(new Date(epi.date_fabrication))}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
        {formatDateToMySQL(new Date(epi.date_mise_service))}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
        {epi.périodicité_contrôle} jours
      </td>
    </>
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Liste des EPI</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <Shield size={20} />
        Ajouter un EPI
      </button>

      <DataTable
        headers={[
          "ID",
          "Identifiant",
          "Marque",
          "Modèle",
          "Numéro de Série",
          "Taille",
          // "Couleur",
          "Type",
          "Date Achat",
          "Date Fabrication",
          "Date Mise Service",
          "Périodicité",
          "Actions",
        ]}
        data={epis}
        onModify={handleStartEdit}
        onDelete={handleDeleteEpi}
        renderCell={renderTableCell}
        colSpan={13}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div
              className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity"
              onClick={handleCloseModal}
            />

            <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-3">
                  <Shield size={24} className="text-indigo-600" />
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {editingEpi ? "Modifier l'EPI" : "Nouvel EPI"}
                  </h3>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Identifiant personnalisé
                  </label>
                  <input
                    name="identifiant_personnalise"
                    placeholder="Ex: EPI-2024-001"
                    value={
                      editingEpi?.identifiant_personnalise ||
                      newEpi.identifiant_personnalise
                    }
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marque
                  </label>
                  <input
                    name="marque"
                    placeholder="Ex: Petzl"
                    value={editingEpi?.marque || newEpi.marque}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modèle
                  </label>
                  <input
                    name="modèle"
                    placeholder="Ex: Vertex"
                    value={editingEpi?.modèle || newEpi.modèle}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de série
                  </label>
                  <input
                    name="numéro_série"
                    placeholder="Ex: SN-12345"
                    value={editingEpi?.numéro_série || newEpi.numéro_série}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taille
                  </label>
                  <input
                    name="taille"
                    placeholder="Ex: 12 mm"
                    value={editingEpi?.taille || newEpi.taille || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
                  />
                </div>

                {/* <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Couleur
                  </label>
                  <input
                    name="couleur"
                    placeholder="Ex: Rouge"
                    value={editingEpi?.couleur || newEpi.couleur || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
                  />
                </div> */}

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type d'EPI
                  </label>
                  <select
                    name="type_id"
                    value={editingEpi?.type_id || newEpi.type_id || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
                  >
                    <option value="">Sélectionner un type</option>
                    {epiTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Périodicité de contrôle (jours)
                  </label>
                  <input
                    name="périodicité_contrôle"
                    type="number"
                    placeholder="Ex: 365"
                    value={
                      editingEpi?.périodicité_contrôle ||
                      newEpi.périodicité_contrôle
                    }
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fabrication
                  </label>
                  <input
                    name="date_fabrication"
                    type="date"
                    value={formatDateToMySQL(
                      editingEpi?.date_fabrication
                        ? new Date(editingEpi.date_fabrication)
                        : newEpi.date_fabrication
                    )}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de mise en service
                  </label>
                  <input
                    name="date_mise_service"
                    type="date"
                    value={formatDateToMySQL(
                      editingEpi?.date_mise_service
                        ? new Date(editingEpi.date_mise_service)
                        : newEpi.date_mise_service
                    )}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date d'achat
                  </label>
                  <input
                    name="date_achat"
                    type="date"
                    value={formatDateToMySQL(
                      editingEpi?.date_achat
                        ? new Date(editingEpi.date_achat)
                        : newEpi.date_achat
                    )}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <X size={20} />
                  Annuler
                </button>
                <button
                  onClick={editingEpi ? handleEditEpi : handleAddEpi}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 transition-colors flex items-center gap-2"
                >
                  {editingEpi ? (
                    <>
                      <Save size={20} />
                      Sauvegarder
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Ajouter
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
