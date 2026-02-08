# Production API

Backend developed with **Java + Quarkus** to manage products, raw materials and production suggestions based on available stock.

This project was developed as part of a **technical assessment**, focusing on clean architecture, business rules and API design.

---

## Technologies

### Backend
- Java 17  
- Quarkus  
- Hibernate ORM (Panache)  
- PostgreSQL  
- Maven  

### Frontend
- React.js (Vite)
- Redux Toolkit 
- Material UI (MUI)
- Axios 
- React Router 

---

## Features

- CRUD for **Products**
- CRUD for **Raw Materials**
- Association between **Products and Raw Materials**
- **Production suggestion** calculation based on current stock

---

## Business Rules

- A product can have multiple raw materials
- The same raw material cannot be associated twice with the same product
- Production suggestion logic:
  - products are processed in descending order of price
  - maximum producible quantity is calculated based on available stock
  - stock consumption is simulated in memory
  - total production value is calculated

---

## Main Endpoints

### Products
- `GET /products`
- `GET /products/{id}`
- `POST /products`
- `PUT /products/{id}`
- `DELETE /products/{id}`

### Product ↔ Raw Material Association
- `POST /products/{id}/materials`
- `GET /products/{id}/materials`

### Raw Materials
- `GET /raw-materials`
- `POST /raw-materials`
- `PUT /raw-materials/{id}`
- `DELETE /raw-materials/{id}`

### Production
- `GET /production/suggestion`

---

## How to run backend 

### Requirements
- Java 17
- PostgreSQL
- Maven

### Steps

1. Clone the repository

git clone https://github.com/your-username/your-repo.git

2. Configure the database in application.properties

The application is pre-configured with the following database settings in `src/main/resources/application.properties`.

**Please ensure your local PostgreSQL matches these credentials or update the file:**

quarkus.datasource.db-kind=postgresql
quarkus.datasource.username=postgres
quarkus.datasource.password=postgres
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/productiondb

3. Backend (Quarkus)
Open a terminal in the  project root:

./mvnw quarkus:dev

4. Frontend (React)
Open a new terminal in the frontend folder:

# Install dependencies
npm install

# Start the development server
npm run dev
