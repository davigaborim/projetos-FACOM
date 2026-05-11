# LSCAD Tools 

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)

LSCAD Tools is an undergraduate research project developed at FACOM/UFMS. It is a web platform that centralizes interactive tools and simulators to support learning for computing students, allowing them to experiment with and visualize concepts in a practical way.

## Prerequisites
Make sure you have the following installed on your machine:
- [Docker](https://www.docker.com/) and Docker Compose

## Installation and setup
1. Copy the example file (*.env.example*) as *.env* and edit the file as needed. This file contains important environment variables such as database credentials and allowed origins.
Make sure to fill them in before running the application.

2. Run `docker compose up --build` to start all services.

## Accessing the application
After starting, the service will be available at: http://localhost:3001