# Research Publications App

A Next.js application for browsing academic research papers and medical publications.

## Features

- Browse research papers with pagination
- View detailed paper information in modal
- Responsive design with clean UI
- Error handling and loading states

## Tech Stack

- Next.js 16 with App Router
- TypeScript
- SCSS for styling
- React 19

## Getting Started

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── features/       # Feature-specific components
│   └── ui/            # Reusable UI components
└── types/             # TypeScript type definitions
```

## API

The app fetches data from the Enago API endpoint:
`https://easydash.enago.com/acceptedpapers`

