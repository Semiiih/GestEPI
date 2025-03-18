import React, { useState, useEffect } from "react";
import { EpiCheck } from "../../../../Types";
import { AlertCircle } from "lucide-react";
import { Modal } from "../../components/atoms/Modal/index";
import { DataTable } from "../../components/atoms/DataTable/index";

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
    setSelectedControle(null);
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
          epi_id: newControle.epi_id || null,
          status_id: newControle.status_id || null,
          remarques: newControle.remarques || null,
        }),
      });

      // Vérification si la requête a échoué
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erreur lors de l'ajout");
      }

      // Actualiser la liste des contrôles
      const updatedResponse = await fetch("http://localhost:5500/episChecks");
      const updatedData = await updatedResponse.json();

      // Trier les contrôles par ID
      const sortedChecks = updatedData.sort(
        (a: EpiCheck, b: EpiCheck) => a.id - b.id
      );
      setControles(sortedChecks);

      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur de création :", error);
    }
  };

  // gérer à la fois la modification et l'ajout
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
        const gestionnairesResponse = await fetch(
          "http://localhost:5500/users"
        );
        const gestionnairesData = await gestionnairesResponse.json();
        setGestionnaires(gestionnairesData);

        const episResponse = await fetch("http://localhost:5500/epis");
        const episData = await episResponse.json();
        setEpis(episData);

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

        const data = await response.json();

        const sortedChecks = data.sort(
          (a: EpiCheck, b: EpiCheck) => a.id - b.id
        );

        setControles(sortedChecks);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des EpiChecks :", error);
        setIsLoading(false);
      }
    };

    fetchEpiChecks();
  }, []);

  const handleModifier = (controle: EpiCheck) => {
    // Met à jour l état selectedControle avec les données du contrôle sélectionné
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

      // Met à jour la liste des controles avec les nouvelles donnees
      setControles(
        controles.map((c) =>
          c.id === selectedControle.id ? selectedControle : c
        )
      );

      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
    }
  };

  const handleSupprimer = async (id: number) => {
    //demande de confiramtion
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

  // pour remplir les colonnes du tableau Datatable
  const renderTableCell = (controle: EpiCheck) => {
    return (
      <>
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
          {gestionnaires.find((g) => g.id === controle.gestionnaire_id)?.nom ||
            "Inconnu"}
        </td>
        <td
          className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
          onClick={() => handleModifier(controle)}
        >
          {epis.find((e) => e.id === controle.epi_id)
            ?.identifiant_personnalise || "Inconnu"}
        </td>
        <td
          className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
          onClick={() => handleModifier(controle)}
        >
          {status.find((s) => s.id === controle.status_id)?.status || "Inconnu"}
        </td>
        <td
          className="px-6 py-4 text-sm text-gray-700"
          onClick={() => handleModifier(controle)}
        >
          {controle.remarques || "N/A"}
        </td>
      </>
    );
  };

  return (
    <div className="">
      <h1 className="text-2xl font-semibold mb-4">Liste des controles</h1>

      <button
        onClick={handleAjouterClick}
        className="mb-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <AlertCircle size={20} />
        Ajouter un controle
      </button>

      <DataTable
        headers={[
          "ID",
          "Date Contrôle",
          "Gestionnaire",
          "EPI",
          "Statut",
          "Remarques",
          "Actions",
        ]}
        data={controles}
        emptyMessage="Aucun contrôle trouvé"
        onModify={handleModifier}
        onDelete={handleSupprimer}
        renderCell={renderTableCell}
        colSpan={7}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedControle={selectedControle}
        newControle={newControle}
        errors={errors}
        gestionnaires={gestionnaires}
        epis={epis}
        status={status}
        handleInputChange={handleInputChange}
        handleSauvegarder={handleSauvegarder}
        handleAjouter={handleAjouter}
      />
    </div>
  );
};

export default ListesControle;
