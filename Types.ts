export interface UserType {
  id: number;
  type: string;
}

export interface User {
  id: number;
  nom: string;
  email: string;
  user_type_id: number;
}

export interface EpiType {
  id: number;
  type: string;
}

export interface Epi {
  id: number;
  identifiant_personnalise: string;
  marque: string;
  modèle: string;
  numéro_série: string;
  taille?: string;
  couleur?: string;
  date_achat: Date;
  date_fabrication: Date;
  date_mise_service: Date;
  type_id: number;
  périodicité_contrôle: number;
}

export interface CheckStatus {
  id: number;
  status: string;
}

export interface EpiCheck {
  id: number;
  date_contrôle: Date;
  gestionnaire_id: number;
  epi_id: number;
  status_id: number;
  remarques?: string;
}
