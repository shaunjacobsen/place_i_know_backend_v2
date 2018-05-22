![logo](https://res.cloudinary.com/placeiknow/image/upload/c_scale,w_200/v1503588668/logo_shhvcy.png)
# Backend
:us: :ca: :uk:
This is a project to move the backend travel management system of _Place I Know_, my part-time business, from a monolithic Ruby application to an API-based Node.js application, which can be used as the backend layer for both the frontend customer-facing React.js application and iOS app, as well as the frontend admin application.

:fr: :ca:
Ce project est pour le backend (serveur principal) de mon entreprise à temps partiel, _Place I Know_, qui est aujourd'hui écrit en Ruby. Je souhaite utiliser un API écrit en Node.js avec pourque le logiciel soit plus utilisable avec une application front-end React.js, ou pour une nouvelle application mobile écrit en React Native.

## Technology, Integrations, & Dependencies
:us: :ca: :uk:
- **Javascript** (Node.js and Express.js)
- Sequelize ORM to interact with a **PostgreSQL** database
- **Amazon Web Services (AWS)**
  - Uses Simple Storage Service (S3) with signed, expirable URLs to allow customers to securely download travel documents
- **Cloudinary** for the retrieval and uploading of images, including destination photos and user avatars
- **Pusher ChatKit** for integrating realtime chat with customers
  - Customers may chat one-on-one with their travel planner, or group chat with all other travellers on their trip
  - Includes presence indicators and realtime typing indicators

:fr: :ca:
- **Javascript** (Node.js et Express.js)
- Sequelize MOR pour intéragit avec la base de données **PostgreSQL**
- **Amazon Web Services (AWS)**
  - Intégration avec Simple Storage Service (S3, stockage dans le cloud) avec les URL pre-signées pourque les clients puissent télécharger leurs documents de voyage
- **Cloudinary** pour le téléchargement des images
- **Pusher ChatKit** pour le tchat en temps réel
  - Les clients peuvent tchatter en temps réel avec leur planificat/-eur/-rice, ou en groupe avec l'ensemble des voyageurs sur leur voyage
  - Les indicateurs de présence et de saisie de texte y sont compris


# Copyright
Copyright © 2018 Shaun Jacobsen. All Rights Reserved.
You may not copy, redistribute, or otherwise use this code for any purposes, including for hobby, educational, or commercial purposes.

Copyright © 2018 Shaun Jacobsen. Tous droits réservés.
Vous n'avez pas la permission de redistribuer, copier, ou utiliser ce code pour aucune raison, y compris pour les raisons récreatives, pédagogiques, ou commerciales.