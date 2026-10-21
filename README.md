# Job Application Tracker

A full-stack web application for organizing and tracking job applications with a Kanban-style workflow.

Built with Next.js, React, TypeScript, MongoDB, Better Auth, Tailwind CSS, and shadcn/ui.

## Features

- **Authentication** — User authentication powered by Better Auth.
- **Kanban Board** — Organize job applications into customizable workflow columns.
- **Drag and Drop** — Move job applications between columns using an interactive drag-and-drop interface.
- **Job Application Management** — Create, edit, move, and delete job applications.
- **Application Details** — Store information such as company, position, location, salary, job URL, tags, and notes.
- **Responsive UI** — A modern interface styled with Tailwind CSS and shadcn/ui.
- **MongoDB Integration** — Persist application and board data using MongoDB and Mongoose.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack React framework |
| React | User interface |
| TypeScript | Static type checking |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| Better Auth | Authentication |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | UI components |
| dnd-kit | Drag-and-drop interactions |
| Lucide React | Icons |

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm
- A MongoDB instance, either local or hosted

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd job-application-tracker
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create your local environment file:

   ```bash
   cp .env.example .env.local
   ```

   On Windows PowerShell, you can use:

   ```powershell
   Copy-Item .env.example .env.local
   ```

5. Configure the required environment variables in `.env.local`, including your MongoDB connection string and authentication settings. Refer to `.env.example` for the required variable names.

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

8. Seed default data:

    To create the default board, columns, and other initial data, open the seed file and set the default `userId` to your user ID before running the seed script.

    The seed script uses this `userId` to associate the initial data with your account.

    Run the seed script with:

    ```bash
    npm run seed:jobs
    ```

    Make sure the `userId` is set correctly before running the script.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run seed:jobs` | Run the job seeding script |

## Environment Variables

The application requires environment variables for database connectivity and authentication.

Create a `.env.local` file and configure the variables documented in `.env.example`.

**Important:** Never commit `.env.local` or expose secrets, database credentials, or authentication keys in your repository.

## Project Status

This project is under active development. Features and implementation details may evolve as development continues.

## License

No license has been specified yet. All rights reserved unless a license is added to this repository.