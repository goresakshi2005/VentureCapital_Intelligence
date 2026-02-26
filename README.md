# Venture Capital Intelligence

**Venture Capital Intelligence** is a full‑stack application for venture capital professionals to discover, track, and enrich startup data. It combines a Django REST API with a modern React frontend, and uses AI‑powered enrichment to automatically extract key company information from their websites.

---

## Features

- 📋 **Company Management** – View, search, sort, and filter companies.
- 🌐 **Add Companies by URL** – Submit a company website; the backend scrapes it and uses Gemini AI to extract structured data (name, description, industry, location, funding, etc.) – all saved to the database.
- 🔍 **Enrichment** – For any company, request additional insights (summary, bullet points, keywords, signals) via Tavily + Gemini (displayed temporarily, not saved).
- 📁 **Custom Lists** – Create lists, add companies, and export any list as a CSV file.
- 💾 **Saved Searches** – Save search queries and reuse them later.
- 📝 **Private Notes** – Attach notes to companies (stored in `localStorage`).
- 🌙 **Dark Mode** – Toggle between light and dark themes, with preference persisted.
- 📱 **Responsive UI** – Built with Tailwind CSS and Radix UI primitives, works on desktop and mobile.

---

## Tech Stack

### Backend
- **Django 4.2** & **Django REST Framework** – API and database layer
- **SQLite** – Default database (easily replaceable with PostgreSQL)
- **Tavily Python** – Web scraping / extraction API
- **Google Generative AI (Gemini)** – AI‑powered data extraction
- **django-cors-headers** – CORS support for frontend
- **python-dotenv** – Environment variable management

### Frontend
- **React 19** – UI library
- **Vite** – Build tool and dev server
- **Tailwind CSS** – Styling
- **React Router DOM** – Routing
- **TanStack React Table** – Powerful table with sorting, filtering, pagination
- **Radix UI** – Accessible unstyled components (dialogs, alerts)
- **Axios** – API requests
- **Lucide React** – Icons
- **localStorage** – Persist user lists, saved searches, and notes

---

## Prerequisites

- **Python 3.9+** and **pip**
- **Node.js 18+** and **npm** (or yarn)
- API keys for:
  - [Tavily](https://tavily.com)
  - [Google Gemini](https://ai.google.dev/)

---

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/venture-capital-intelligence.git
cd venture-capital-intelligence
