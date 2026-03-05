# 🚍 Aplikacija za gradski prevoz

Web aplikacija za pregled linija i polazaka gradskog prevoza.

## Tehnologije
- React (Vite)
- Django REST Framework
- PostgreSQL
- Docker & Docker Compose
- Swagger (OpenAPI)

---

## 🐳 Pokretanje

Build i start:

docker-compose -f compose.yaml up --build

Migracije (prvi put):

docker-compose -f compose.yaml exec backend python manage.py migrate

---

## 🌐 Pristup

Frontend: http://localhost:5173  
Backend: http://localhost:8000  
Swagger: http://localhost:8000/api/docs/

---

## 📘 API dokumentacija

Swagger UI omogućava testiranje svih API endpointa direktno iz browser-a.

---

## Struktura projekta
backend/ - Django REST API
frontend/ - React aplikacija
compose.yaml - Docker Compose konfiguracija

## Live Demo

Frontend:
https://gradskiprevoz-frontend.onrender.com

Backend API:
https://gradskiprevoz-backend.onrender.com/api/