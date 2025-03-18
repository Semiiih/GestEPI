import React from "react";
import { AlertCircle, Plus, Save, X } from "lucide-react";
import { EpiCheck } from "../../../../../Types";

interface ControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedControle: EpiCheck | null;
  newControle: {
    date_contrôle: string;
    gestionnaire_id: number | null;
    epi_id: number | null;
    status_id: number | null;
    remarques: string | null;
  };
  errors: {
    date_contrôle: string;
    gestionnaire_id: string;
    epi_id: string;
    status_id: string;
  };
  gestionnaires: { id: number; nom: string }[];
  epis: { id: number; identifiant_personnalise: string }[];
  status: { id: number; status: string }[];
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleSauvegarder: () => void;
  handleAjouter: () => void;
}

export const Modal: React.FC<ControlModalProps> = ({
  isOpen,
  onClose,
  selectedControle,
  newControle,
  errors,
  gestionnaires,
  epis,
  status,
  handleInputChange,
  handleSauvegarder,
  handleAjouter,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <h3 className="text-2xl font-semibold text-gray-900">
              {selectedControle ? "Modifier le Contrôle" : "Nouveau Contrôle"}
            </h3>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de Contrôle
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
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
              />
              {errors.date_contrôle && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={16} />
                  {errors.date_contrôle}
                </p>
              )}
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
              >
                <option value="">Sélectionner un gestionnaire</option>
                {gestionnaires.map((gestionnaire) => (
                  <option key={gestionnaire.id} value={gestionnaire.id}>
                    {gestionnaire.nom}
                  </option>
                ))}
              </select>
              {errors.gestionnaire_id && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={16} />
                  {errors.gestionnaire_id}
                </p>
              )}
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
              >
                <option value="">Sélectionner un EPI</option>
                {epis.map((epi) => (
                  <option key={epi.id} value={epi.id}>
                    {epi.identifiant_personnalise}
                  </option>
                ))}
              </select>
              {errors.epi_id && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={16} />
                  {errors.epi_id}
                </p>
              )}
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                name="status_id"
                value={
                  selectedControle
                    ? selectedControle.status_id || ""
                    : newControle.status_id || ""
                }
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
              >
                <option value="">Sélectionner un statut</option>
                {status.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.status}
                  </option>
                ))}
              </select>
              {errors.status_id && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={16} />
                  {errors.status_id}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
                rows={4}
                placeholder="Ajoutez vos remarques ici..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <X size={20} />
              Annuler
            </button>
            <button
              onClick={selectedControle ? handleSauvegarder : handleAjouter}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              {selectedControle ? (
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
  );
};
