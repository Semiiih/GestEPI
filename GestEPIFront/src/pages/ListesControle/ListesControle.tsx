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
  const [newControle, setNewControle] = useState({
    date_contrôle: new Date().toISOString().split("T")[0],
    gestionnaire_id: null,
    epi_id: null,
    status_id: null,
    remarques: null,
  });

  const [gestionnaires, setGestionnaires] = useState<
    { id: number; nom: string }[]
  >([]);
  const [epis, setEpis] = useState<
    { id: number; identifiant_personnalise: string }[]
  >([]);
  const [status, setStatus] = useState<{ id: number; status: string }[]>([]);

  const [errors, setErrors] = useState({
    date_contrôle: "",
    gestionnaire_id: "",
    epi_id: "",
    status_id: "",
  });

  // Modifiez le gestionnaire d'événements pour le bouton "Ajouter un controle"
  const handleAjouterClick = () => {
    setSelectedControle(null); // On ne sélectionne pas de contrôle existant
    setIsModalOpen(true);
  };

  // Ajoutez une fonction pour ajouter un nouveau contrôle
  const handleAjouter = async () => {
    let newErrors = {
      date_contrôle: newControle.date_contrôle
        ? ""
        : "La date de contrôle est obligatoire.",
      gestionnaire_id: newControle.gestionnaire_id
        ? ""
        : "Veuillez sélectionner un gestionnaire.",
      epi_id: newControle.epi_id ? "" : "Veuillez sélectionner un EPI.",
      status_id: newControle.status_id
        ? ""
        : "Veuillez sélectionner un statut.",
    };

    setErrors(newErrors);

    // Vérifier s'il y a des erreurs avant d'envoyer la requête
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5500/episChecks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date_contrôle: newControle.date_contrôle,
          gestionnaire_id: newControle.gestionnaire_id || null,
          epi_id: newControle.epi_id || null, // This is being set to null if not provided
          status_id: newControle.status_id || null,
          remarques: newControle.remarques || null,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erreur lors de l'ajout");
      }

      const result = await response.json();

      // Actualiser la liste des contrôles
      const updatedResponse = await fetch("http://localhost:5500/episChecks");
      const updatedData = await updatedResponse.json();
      const sortedChecks = updatedData.sort(
        (a: EpiCheck, b: EpiCheck) => a.id - b.id
      );
      setControles(sortedChecks);

      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur de création :", error);
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de créer le contrôle"
      );
    }
  };

  // Modifiez la fonction handleInputChange pour gérer à la fois l'édition et l'ajout
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (selectedControle) {
      // Mode édition
      setSelectedControle((prev) => ({
        ...prev!,
        [name]: value,
      }));
    } else {
      // Mode ajout
      setNewControle((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les gestionnaires (utilisateurs)
        const gestionnairesResponse = await fetch(
          "http://localhost:5500/users"
        );
        const gestionnairesData = await gestionnairesResponse.json();
        setGestionnaires(gestionnairesData);

        // Charger les EPI
        const episResponse = await fetch("http://localhost:5500/epis");
        const episData = await episResponse.json();
        setEpis(episData);

        // Charger les statuts
        const statusesResponse = await fetch(
          "http://localhost:5500/checkStatus"
        );
        const statusesData = await statusesResponse.json();
        setStatus(statusesData);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    fetchData();
  }, []);

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
      window.location.reload();
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
        onClick={handleAjouterClick}
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
                >
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                    onClick={() => handleModifier(controle)}
                  >
                    {controle.id}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                    onClick={() => handleModifier(controle)}
                  >
                    {controle.date_contrôle
                      ? new Date(controle.date_contrôle).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                    onClick={() => handleModifier(controle)}
                  >
                    {
                      gestionnaires.find(
                        (g) => g.id === controle.gestionnaire_id
                      )?.nom
                    }
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                    onClick={() => handleModifier(controle)}
                  >
                    {
                      epis.find((e) => e.id === controle.epi_id)
                        ?.identifiant_personnalise
                    }
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                    onClick={() => handleModifier(controle)}
                  >
                    {status.find((s) => s.id === controle.status_id)?.status}
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-gray-700"
                    onClick={() => handleModifier(controle)}
                  >
                    {controle.remarques || "N/A"}
                  </td>
                  <td className="flex px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleModifier(controle)}
                      className="text-blue-600 hover:bg-blue-100 p-2 rounded transition transform hover:scale-125"
                    >
                      ✏️
                    </button>
                    <div className="border-r-2 " />
                    <button
                      onClick={() => handleSupprimer(controle.id)}
                      className="text-red-600 hover:bg-red-100 p-2 rounded transition transform hover:scale-125"
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

      {/* Modal de modification/ajout */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[500px]">
            <h2 className="text-xl font-semibold mb-4">
              {selectedControle
                ? "Modifier le Contrôle"
                : "Ajouter un Contrôle"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date Contrôle
                </label>
                <input
                  type="date"
                  name="date_contrôle"
                  value={
                    selectedControle
                      ? selectedControle.date_contrôle
                        ? new Date(selectedControle.date_contrôle)
                            .toISOString()
                            .split("T")[0]
                        : ""
                      : newControle.date_contrôle
                  }
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gestionnaire
                </label>
                <select
                  name="gestionnaire_id"
                  value={
                    selectedControle
                      ? selectedControle.gestionnaire_id || ""
                      : newControle.gestionnaire_id || ""
                  }
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  required
                >
                  <option value="">Sélectionner un gestionnaire</option>
                  {gestionnaires.map((gestionnaire) => (
                    <option key={gestionnaire.id} value={gestionnaire.id}>
                      {gestionnaire.nom}
                    </option>
                  ))}
                </select>
                {errors.gestionnaire_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gestionnaire_id}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  EPI
                </label>
                <select
                  name="epi_id"
                  value={
                    selectedControle
                      ? selectedControle.epi_id || ""
                      : newControle.epi_id || ""
                  }
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  required
                >
                  <option value="">Sélectionner un EPI</option>
                  {epis.map((epi) => (
                    <option key={epi.id} value={epi.id}>
                      {epi.identifiant_personnalise}
                    </option>
                  ))}
                </select>
                {errors.epi_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.epi_id}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status ID
                </label>
                <div>
                  <select
                    name="status_id"
                    value={
                      selectedControle
                        ? selectedControle.status_id || ""
                        : newControle.status_id || ""
                    }
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    required
                  >
                    <option value="">Sélectionner un statut</option>
                    {status.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.status}
                      </option>
                    ))}
                  </select>
                  {errors.status_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.status_id}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Remarques
                </label>
                <textarea
                  name="remarques"
                  value={
                    selectedControle
                      ? selectedControle.remarques || ""
                      : newControle.remarques || ""
                  }
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  rows={3}
                  required
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
                  onClick={selectedControle ? handleSauvegarder : handleAjouter}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {selectedControle ? "Sauvegarder" : "Ajouter"}
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
