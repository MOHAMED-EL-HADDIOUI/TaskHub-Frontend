# **TaskHub**
![logo](https://github.com/user-attachments/assets/cfd0f1e8-8f69-4ffc-b296-44c69a311754)


TaskHub est une application de gestion de projets et de tâches, permettant aux utilisateurs de suivre les projets, d'attribuer des tâches et de collaborer efficacement. Ce projet intègre une API sécurisée avec des fonctionnalités avancées pour la gestion des utilisateurs, des projets et des tâches.

---

## **Concept du projet**

Le projet **TaskHub** vise à simplifier la gestion des projets en offrant une plateforme intuitive et sécurisée où les utilisateurs peuvent :

- **Gérer des projets** :  
  Créer, suivre et organiser des projets avec une hiérarchie claire.

- **Collaborer efficacement** :  
  Attribuer des tâches aux membres de l'équipe et suivre leur progression en temps réel.

- **Sécuriser les données** :  
  Assurer une gestion sécurisée des utilisateurs et des rôles via une authentification robuste et des contrôles d'accès basés sur les rôles.

- **Automatiser les processus** :  
  Faciliter la communication et le suivi grâce à des notifications et des fonctionnalités de reporting.

---

## **Structure du projet**

1. **Backend (Django Rest Framework)**
    - Fournit une API RESTful sécurisée pour la gestion des utilisateurs, projets et tâches.
    - Authentification basée sur JWT (JSON Web Tokens).
    - Modèles principaux :
        - **User** : Gestion des utilisateurs.
        - **Project** : Contient des tâches associées.
        - **Task** : Attribuée à un utilisateur pour un projet donné.

2. **Frontend (React avec TypeScript)**
    - Interface utilisateur moderne et interactive.
    - Gestion de l'état des projets et tâches via `useState` et `useEffect`.
    - Appels API sécurisés avec l'intégration des tokens JWT pour chaque requête.

---

## **Instructions pour exécuter le projet**

### **Prérequis**
- Python 3.10
- Node.js 18 ou plus récent

### **Backend**
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/MOHAMED-EL-HADDIOUI/TaskHub-Backend.git
   cd TaskHub-Backend
   ```

2. Créez un environnement virtuel et activez-le :
   ```bash
   python -m venv venv
   source venv/bin/activate  # Sur Windows : venv\Scripts\activate
   ```

3. Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```

4. Configurez la base de données dans `settings.py` et appliquez les migrations :
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Démarrez le serveur :
   ```bash
   python manage.py runserver
   ```

### **Frontend**
2. Clonez le dépôt :
   ```bash
   git clone https://github.com/MOHAMED-EL-HADDIOUI/TaskHub-Frontend.git
   cd TaskHub-Frontend
   ```
1. Allez dans le répertoire `TaskHub-Frontend` :
   ```bash
   cd TaskHub-Frontend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Lancez l'application :
   ```bash
   npm run dev
   ```

4. Accédez à l'application sur [http://localhost:5173](http://localhost:5173).

---

## **Logique du projet**

- **Authentification** :  
  Les utilisateurs s'authentifient avec leurs identifiants. Un token JWT est généré et utilisé pour autoriser les requêtes vers l'API.

- **Gestion des rôles** :  
  Les rôles sont vérifiés au niveau du backend pour restreindre certaines actions (ex. : seuls les managers peuvent créer des projets).

- **Relations entre modèles** :
    - Un projet peut contenir plusieurs tâches.
    - Une tâche est assignée à un utilisateur pour un projet donné.

- **Frontend** :  
  L'interface utilisateur communique avec le backend via des requêtes sécurisées. Les données sont gérées localement avec React et les hooks.

---

## **Observations importantes**

1. **Sécurité** :
    - L'authentification JWT sécurise toutes les requêtes.
    - Les tokens sont stockés dans `localStorage` (utilisez des cookies HTTP-only pour une meilleure sécurité en production).

2. **Performances** :
    - L'utilisation de Django et React garantit une gestion efficace des données et des interfaces utilisateur modernes.
---

## **Auteurs**

- **[MOHAMED EL HADDIOUI]**
- Contact : [mohamedelhaddioui99@exemple.com](mailto:mohamedelhaddioui99@exemple.com)

