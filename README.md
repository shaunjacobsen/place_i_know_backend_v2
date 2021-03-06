![logo](https://res.cloudinary.com/placeiknow/image/upload/c_scale,w_200/v1503588668/logo_shhvcy.png)
# Backend
:us: :uk:
This is a project to move the backend travel management system of _Place I Know_, my part-time business, from a monolithic Ruby application to an API-based Node.js application, which can be used as the backend layer for both the [frontend customer-facing React.js application](https://github.com/shaunjacobsen/place_i_know_frontend_v2) and [iOS app](https://itunes.apple.com/us/app/place-i-know/id1310882149?mt=8), as well as the frontend admin application.

:fr:
Ce project est pour le backend (serveur principal) de mon entreprise à temps partiel, _Place I Know_, qui est aujourd'hui écrit en Ruby. Je souhaite utiliser un API écrit en Node.js pourque le logiciel soit plus utilisable avec une [application front-end React.js](https://github.com/shaunjacobsen/place_i_know_frontend_v2) et [l'appli iOS](https://itunes.apple.com/us/app/place-i-know/id1310882149?mt=8), ou pour une nouvelle application mobile écrit en React Native.

---

### Objective
To decouple the backend from the frontend of the business software, as it previously existed in the Ruby application, and to introduce microservices to decouple more intensive and time-insensitive operations from the application.

### Objectif
J'ai voulu découpler le backend du frontend du logiciel, comme il était avec le logiciel Ruby. J'ai aussi voulu intégrer les microservices pour découpler les processus intensifs du logiciel pourque le logiciel puisse être plus scalable.

## Technology, Integrations, & Dependencies
:us: :uk:
- **Javascript** (Node.js and Express.js)
- Sequelize ORM to interact with a **PostgreSQL** database
- **Amazon Web Services (AWS)**
  - Uses Simple Storage Service (S3) with signed, expirable URLs to allow customers to securely download travel documents
- **Cloudinary** for the retrieval and uploading of images, including destination photos and user avatars
- **Pusher ChatKit** for integrating realtime chat with customers
  - Customers may chat one-on-one with their travel planner, or group chat with all other travellers on their trip
  - Includes presence indicators and realtime typing indicators
- **RabbitMQ** for sending messages to a queue for processing by **microservices**, using **Heroku dynos**, responsible for:
  - [Sending emails](https://github.com/shaunjacobsen/place_i_know_email_service), such as forgot password, new account, document sharing, and unread chat notifications
  - [Processing images](https://github.com/shaunjacobsen/place_i_know_image_service) with Cloudinary

:fr:
- **Javascript** (Node.js et Express.js)
- Sequelize MOR pour intéragit avec la base de données **PostgreSQL**
- **Amazon Web Services (AWS)**
  - Intégration avec Simple Storage Service (S3, stockage dans le cloud) avec les URL pre-signées pourque les clients puissent télécharger leurs documents de voyage
- **Cloudinary** pour le téléchargement des images
- **Pusher ChatKit** pour le tchat en temps réel
  - Les clients peuvent tchatter en temps réel avec leur planificat/-eur/-rice, ou en groupe avec l'ensemble des voyageurs sur leur voyage
  - Les indicateurs de présence et de saisie de texte y sont compris
- **RabbitMQ**, pour envoyer et recevoir les messages dans un queue pour le traitement par les **microservices** hébergés par **Heroku dynos** qui :
  - [Envoyer les emails](https://github.com/shaunjacobsen/place_i_know_email_service), tels que "mot de passe oublié", "nouveau compte", "partage de document", et "messages tchats non lus"
  - Le [traitement d'image](https://github.com/shaunjacobsen/place_i_know_image_service) avec Cloudinary

## API
Sample documentation coming soon.


# Copyright
Copyright © 2018 Shaun Jacobsen. All Rights Reserved.
You may not copy, redistribute, or otherwise use this code for any purposes, including for hobby, educational, or commercial purposes.

Copyright © 2018 Shaun Jacobsen. Tous droits réservés.
Vous n'avez pas la permission de redistribuer, copier, ou utiliser ce code pour aucune raison, y compris pour les raisons récreatives, pédagogiques, ou commerciales.