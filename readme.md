# AirOps

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

A modern, event-driven microservices platform for airport operations. AirOps combines flight information, ground operations, team coordination, and account management into a single workflow-driven application.

## Overview

AirOps is built as a collection of independently runnable services connected through RabbitMQ. The frontend is served through one reverse proxy, while the backend services communicate through internal Kubernetes services and REST endpoints.

> **Current status:** Kubernetes manifests, ingress configuration, and deployment automation are still under development. The current application is a local development setup; ports are only relevant for local execution.

### Architecture

```mermaid
flowchart LR
    User[User] -->|HTTPS| Proxy[Reverse Proxy<br/>Ingress / Gateway]
    Proxy --> Frontend[Frontend<br/>React + Vite]

    subgraph AuthLayer[Auth]
        direction TB
        Auth[Auth Service<br/>Fastify]
        AuthDB[(Auth Database)]
    end

    subgraph FlightLayer[Flight]
        direction TB
        Flight[Flight Service<br/>Fastify]
        FlightDB[(Flight Database)]
    end

    subgraph GroundOpsLayer[GroundOps]
        direction TB
        GroundOps[GroundOps Service<br/>Fastify]
        GroundOpsDB[(GroundOps Database)]
    end

    subgraph Messaging[Messaging]
        direction TB
        RabbitMQ[RabbitMQ]
    end

    Frontend -->|/api/auth| Auth
    Frontend -->|/api/arrivals| Flight
    Frontend -->|/api/departures| Flight
    Frontend -->|/api/tasks| GroundOps
    Frontend -->|/api/turnarounds| GroundOps
    Frontend -->|/api/teams| GroundOps

    Auth --> AuthDB
    Flight --> FlightDB
    GroundOps --> GroundOpsDB

    Auth <-->|Events| RabbitMQ
    Flight <-->|Events| RabbitMQ
    GroundOps <-->|Events| RabbitMQ
```

In Kubernetes, the backend service ports should not be exposed directly to end users. The reverse proxy should route public requests to the appropriate application service, such as `/` for the frontend and `/api/...` for backend APIs.

## Services

| Service             | Local development port | Responsibility                                                                     |
| ------------------- | ---------------------: | ---------------------------------------------------------------------------------- |
| `auth-service`      |                   3005 | Authentication, sessions, account verification, password reset, and email delivery |
| `flight-service`    |                   3000 | Flight arrivals, departures, and lifecycle updates                                 |
| `groundops-service` |                   3001 | Ground operations, tasks, teams, and turnaround records                            |
| `frontend`          |                   5173 | React and TanStack Router user interface                                           |
| `RabbitMQ`          |                   5672 | Event transport between services                                                   |
| `PostgreSQL`        |                   5432 | Service persistence                                                                |

## Features

- Event-driven communication between services through RabbitMQ
- PostgreSQL persistence with Drizzle ORM
- Fastify-based REST APIs with Zod validation
- JWT and session-based authentication
- Email verification and password-reset workflows
- Flight and ground-operations business domains separated into independent services
- React frontend with TanStack Query and routing
- Bruno collection for API exploration and testing

## Repository structure

```text
.
├── auth-service/        # Authentication and identity service
├── flight-service/      # Flight operations API
├── groundops-service/   # Ground operations API
├── frontend/            # React application
├── Bruno/               # Bruno API collections and environment configuration
├── package.json         # Root workspace scripts (if added later)
└── readme.md            # Project documentation
```

## Prerequisites

Before starting the project, install:

- Node.js 20 or newer
- npm
- PostgreSQL
- RabbitMQ
- A mail provider or SMTP-compatible server for account emails

## Getting started

### 1. Install dependencies

From the repository root, install the dependencies for each application:

```bash
cd auth-service && npm install
cd ../flight-service && npm install
cd ../groundops-service && npm install
cd ../frontend && npm install
```

Alternatively, run the install commands in separate terminals or use a workspace manager if you add a root package manager configuration.

### 2. Configure environment variables

Create an `.env` file inside each backend service. The frontend uses localhost endpoints and does not currently require an environment file.

#### Auth service

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auth
RABBITMQ_URL=amqp://localhost
SESSION_SECRET=replace-with-a-long-random-secret
JWT_SECRET=replace-with-another-long-random-secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM="AirOps <no-reply@example.com>"
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

The auth service currently validates `DATABASE_URL`, `RABBITMQ_URL`, `SESSION_SECRET`, `JWT_SECRET`, and `FRONTEND_URL` through its runtime configuration.

#### Flight service

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flight
RABBITMQ_URL=amqp://localhost
NODE_ENV=development
```

#### GroundOps service

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/groundops
RABBITMQ_URL=amqp://localhost
NODE_ENV=development
```

> The database names and credentials above are examples. Update them to match your local PostgreSQL setup.

### 3. Create the databases and run migrations

Create the PostgreSQL databases referenced by the environment files, then run the migrations from each service directory:

```bash
cd auth-service
npx drizzle-kit migrate

cd ../flight-service
npx drizzle-kit migrate

cd ../groundops-service
npx drizzle-kit migrate
```

The migration files are already included in each service's `drizzle/` directory.

### 4. Start RabbitMQ and the databases

Ensure PostgreSQL and RabbitMQ are running before launching the services.

```bash
# PostgreSQL and RabbitMQ must be available locally
# Start the services in separate terminals
```

### 5. Start the application

Open separate terminals for each service:

```bash
# Auth service
cd auth-service
npm run dev

# Flight service
cd flight-service
npm run dev

# GroundOps service
cd groundops-service
npm run dev

# Frontend
cd frontend
npm run dev
```

For local development, the services listen on the following ports:

- Auth service: `http://localhost:3005`
- Flight service: `http://localhost:3000`
- GroundOps service: `http://localhost:3001`
- Frontend: `http://localhost:5173`

## Kubernetes and reverse proxy

Kubernetes deployment is the target deployment model, but no manifests, Helm charts, or ingress configuration are included yet.

Planned deployment architecture:

```text
Internet
   │
   ▼
Reverse Proxy / Ingress
   │
   ├── /              → frontend service
   ├── /api/auth     → auth service
   ├── /api/arrivals → flight service
   ├── /api/departures → flight service
   ├── /api/tasks    → groundops service
   ├── /api/turnarounds → groundops service
   └── /api/teams    → groundops service
```

The following work is still required:

- Kubernetes manifests for the frontend, auth, flight, and groundops services
- PostgreSQL and RabbitMQ deployment or managed external services
- ConfigMaps and Secrets for environment configuration
- Ingress or Gateway routing rules
- Health checks and readiness probes
- Container images and an image registry
- CI/CD automation for builds and deployments
- TLS and production domain configuration

The public URL should expose one entry point, while service-to-service communication remains internal to the cluster.

## API overview

### Authentication service

Base URL: `http://localhost:3005/api/auth`

| Method | Endpoint           | Description                        |
| ------ | ------------------ | ---------------------------------- |
| `POST` | `/signup`          | Create a user account              |
| `POST` | `/signin`          | Sign in and receive auth tokens    |
| `POST` | `/refresh`         | Refresh an access token            |
| `GET`  | `/me`              | Get the current authenticated user |
| `POST` | `/verify-account`  | Verify an account                  |
| `POST` | `/forgot-password` | Request a password reset           |
| `POST` | `/reset-password`  | Reset a password                   |
| `POST` | `/logout`          | Sign out the current user          |

### Flight service

Base URL: `http://localhost:3000/api`

| Method   | Endpoint               | Description                        |
| -------- | ---------------------- | ---------------------------------- |
| `GET`    | `/arrivals`            | List arrivals                      |
| `GET`    | `/arrivals/:id`        | Get one arrival                    |
| `POST`   | `/arrivals`            | Create an arrival                  |
| `PATCH`  | `/arrivals/:id`        | Edit an arrival                    |
| `DELETE` | `/arrivals/:id`        | Delete an arrival                  |
| `POST`   | `/arrivals/:id/arrive` | Mark an arrival as arrived         |
| `GET`    | `/departures`          | List departures with query filters |
| `POST`   | `/departures`          | Create a departure                 |
| `PATCH`  | `/departures/:id`      | Edit a departure                   |
| `DELETE` | `/departures/:id`      | Delete a departure                 |

### GroundOps service

Base URL: `http://localhost:3001/api`

| Method  | Endpoint                        | Description                  |
| ------- | ------------------------------- | ---------------------------- |
| `GET`   | `/tasks`                        | List tasks                   |
| `PATCH` | `/tasks/:id/start`              | Start a task                 |
| `GET`   | `/turnarounds`                  | List turnarounds             |
| `GET`   | `/turnarounds/flight/:flightId` | Get turnarounds for a flight |
| `GET`   | `/teams`                        | List teams                   |
| `GET`   | `/teams/:id`                    | Get one team                 |
| `POST`  | `/teams`                        | Create a team                |
| `POST`  | `/teams/:id/members`            | Add a team member            |

## Testing

Run the tests for each service from its directory:

```bash
cd auth-service && npm test
cd ../flight-service && npm test
cd ../groundops-service && npm test
```

The Auth service also provides a coverage command:

```bash
cd auth-service
npm run test:coverage
```

The frontend includes a build and lint command:

```bash
cd frontend
npm run build
npm run lint
```

## Bruno API collection

The repository includes a Bruno collection under `Bruno/` for exploring the Auth, Flight, and GroundOps services. Import the collection into Bruno and select the `FlightOPs` environment to run the requests.

> Bruno currently uses the local service ports. Once deployed through Kubernetes and the reverse proxy, update host URLs and authentication settings to use the public ingress endpoint.

## Technology stack

- TypeScript
- React 19
- Fastify 5
- PostgreSQL
- Drizzle ORM
- RabbitMQ
- Zod
- TanStack Query
- TanStack Router
- Vitest
- Bruno

## Contributing

1. Create a feature branch.
2. Make focused changes with clear commit messages.
3. Update tests for behavior changes.
4. Run the relevant service tests and frontend checks.
5. Open a pull request with a summary of the change and validation performed.

## License

This project is licensed under the MIT License.
