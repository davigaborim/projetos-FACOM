# LSCAD Tools 

LSCAD Tools is an undergraduate research project developed at FACOM/UFMS. It is a web platform that centralizes interactive tools and simulators to support learning for computing students, allowing them to experiment with and visualize concepts in a practical way.

## Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 18 or higher) and npm
- [Docker](https://www.docker.com/) and Docker Compose

## Installation and setup
Copy the example file (*.env.example*) as *.env* and edit the file as needed. This file contains important environment variables such as database credentials, allowed origins, and server port.
Make sure to fill them in before running the application.

Run `npm install` to install all dependencies and `docker compose up` to start the application.

This will start both the MariaDB database and the application server. The API will be available at http://localhost:3001 (or whichever port is configured in your *.env*).
