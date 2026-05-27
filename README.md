# LSCAD Tools

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)

🔗 **[Access the platform](https://tools.lscad.facom.ufms.br/)**

---

## About

LSCAD Tools is an undergraduate research project developed at [FACOM/UFMS](https://facom.ufms.br/). It provides a centralized space where computing students can experiment with and visualize concepts in a practical and interactive way, through simulators and educational tools available directly in the browser.

## Features

- 🧪 **Interactive simulators** — hands-on tools to help computing students visualize and experiment with concepts
- 🔐 **Admin authentication** — secure login system restricted to administrators, powered by JWT
- 🛠️ **Full CRUD management** — admins can create, read, update, and delete platform content
- 👥 **Admin account management** — administrators can create and manage other admin accounts

## Tech stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MariaDB |
| Infrastructure | Docker + Docker Compose |
| Auth | JWT (JSON Web Tokens) |

## Prerequisites

Make sure you have the following installed on your machine:

- [Docker](https://www.docker.com/) and Docker Compose

## Installation and setup

1. Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials and allowed origins before proceeding.

2. Start all services:

```bash
docker compose up --build
```

## Accessing the application

After starting, the service will be available at: [http://localhost:3001](http://localhost:3001)

## Project structure

```
projetos-FACOM/
├── middlewares/       # Authentication and validation middlewares
├── public/            # Static frontend files
├── rotas/             # API route definitions
├── scripts/           # Utility scripts
├── dbConnection.js    # Database connection setup
├── expressApp.js      # Express app configuration
└── index.js           # Application entry point
```

## Contributors

- [davigaborim](https://github.com/davigaborim)
- [JulioDalpiaz](https://github.com/JulioDalpiaz)

## License

This project is developed under the LSCAD research group at FACOM/UFMS.
