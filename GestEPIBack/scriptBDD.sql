
CREATE TABLE usersTypes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    user_type_id INT,
    FOREIGN KEY (user_type_id) REFERENCES usersTypes(id)
);

CREATE TABLE epiTypes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL
);

CREATE TABLE epi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identifiant_personnalise VARCHAR(50) NOT NULL,
    marque VARCHAR(100) NOT NULL,
    modèle VARCHAR(100) NOT NULL,
    numéro_série VARCHAR(100) NOT NULL,
    taille VARCHAR(20), 
    couleur VARCHAR(20), 
    date_achat DATE NOT NULL,
    date_fabrication DATE NOT NULL,
    date_mise_service DATE NOT NULL,
    type_id INT,
    périodicité_contrôle INT NOT NULL,
    FOREIGN KEY (type_id) REFERENCES epiTypes(id)
);

CREATE TABLE checkStatus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(100) NOT NULL
);

CREATE TABLE epiCheck (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_contrôle DATE NOT NULL,
    gestionnaire_id INT,
    epi_id INT,
    status_id INT,
    remarques TEXT,
    FOREIGN KEY (gestionnaire_id) REFERENCES users(id),
    FOREIGN KEY (epi_id) REFERENCES epi(id),
    FOREIGN KEY (status_id) REFERENCES checkStatus(id)
);




-- ///////////////Jeu de données /////////////////////
INSERT INTO usersTypes (type) VALUES
('Admin'),
('Manager'),
('User');


INSERT INTO users (nom, email, user_type_id) VALUES
('Titi Adm', 'Titi.Adm@example.com', 1),
('Tata Mana', 'Tata.Mana@example.com', 2),
('Toto Use', 'Toto.Use@example.com', 3);


INSERT INTO epiTypes (type) VALUES
('Corde'),
('Longe'),
('Mousqueton'),
('Baudrier'),
('Casque'),
('Système d’assurage');


INSERT INTO epi (identifiant_personnalise, marque, modèle, numéro_série, taille, couleur, date_achat, date_fabrication, date_mise_service, type_id, périodicité_contrôle) VALUES
('EPI001', 'Petzl', 'Volta', 'SN001', '10mm', 'Rouge', '2023-02-01', '2023-01-15', '2023-02-20', 1, 12), 
('EPI002', 'Beal', 'Contract', 'SN002', '15m', 'Bleu', '2022-06-01', '2022-05-10', '2022-06-15', 2, 24),
('EPI003', 'Black Diamond', 'GridLock', 'SN003', NULL, 'Gris', '2021-10-01', '2021-09-15', '2021-10-10', 3, 36),
('EPI004', 'Mammut', 'Ophir', 'SN004', 'L', 'Noir', '2022-03-01', '2022-02-20', '2022-03-10', 4, 24),
('EPI005', 'Petzl', 'Vertex', 'SN005', NULL, 'Blanc', '2021-07-01', '2021-06-20', '2021-07-15', 5, 24),
('EPI006', 'Kong', 'Argon', 'SN006', NULL, NULL, '2023-04-01', '2023-03-15', '2023-04-20', 6, 48);


INSERT INTO checkStatus (status) VALUES
('Opérationnel'),
('Réparation nécessaire'),
('Mis au rebut');


INSERT INTO epiCheck (date_contrôle, gestionnaire_id, epi_id, status_id, remarques) VALUES
('2023-05-10', 1, 1, 1, 'Tout est en bon état, aucun problème détecté.'),
('2023-08-01', 1, 2, 2, 'Fissure détectée sur la longe, nécessite une réparation.'),
('2023-07-15', 2, 3, 1, 'Opérationnel après contrôle.'),
('2023-06-05', 2, 4, 3, 'Usure excessive, mise au rebut.'),
('2023-09-10', 1, 5, 1, 'Contrôle périodique, tout est en ordre.'),
('2023-08-20', 3, 6, 2, 'Problème avec le mousqueton, nécessite remplacement.');
