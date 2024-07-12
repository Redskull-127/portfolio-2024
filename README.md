# Portfolio Website - Meer Tarbani

Welcome to the repository of my personal portfolio website, built using Next.js, ShadCN, Tailwind CSS, Websockets, Postgres DB, and Drizzle ORM.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)

## Introduction

This repository contains the source code for my portfolio website, showcasing my projects, skills, and experience. The website is built with modern technologies to provide an interactive and visually appealing user experience.

## Features

- **Next.js**: Utilizes the power of React for server-side rendering and a great developer experience.
- **ShadCN**: Utilizes custom components.
- **Tailwind CSS**: A utility-first CSS framework for building responsive and customizable designs.
- **Websockets**: Enables real-time communication for interactive and dynamic features.
- **Postgres DB**: A robust relational database for storing and retrieving data efficiently.
- **Drizzle ORM**: A feature-rich Object-Relational Mapping library for interfacing with the Postgres database seamlessly.
- **Auth.js Authentication**: Secure user authentication and authorization for protected routes and data.
- **Posthog Analytics**: Track user interactions and behavior to improve the website and user experience.
- **Dark Mode**: Toggle between light and dark themes for better readability and user experience.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js and npm/yarn/pnpm
- PostgreSQL database
- Drizzle ORM
- Auth.js Authentication
- Posthog Analytics

## Getting Started

1. **Clone the repository:**

   ```bash
    npx/pnpm dlx/bunx create-next-app@latest -e https://github.com/Redskull-127/Portfolio-2024
   ```

2. **Install dependencies:**

   ```bash
   npm/pnpm/yarn/bun install --force
   ```

3. **Set up project and database:**

   - Rename `.env.template` to `.env` and configure the environment variables.
   - Create a PostgreSQL database and configure the connection in `config.drizzle.js/ts`.
   - Run the database migrations:

     ```bash
     npm/pnpm/yarn/bun run db:push
     ```

   - Edit the site configuration in `site-config.js`.

4. **Run the application:**

   ```bash
    npm/pnpm/yarn/bun run dev
   ```

5. **Visit [http://localhost:3000](http://localhost:3000) in your browser.**
