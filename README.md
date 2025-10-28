# Research Publications Dashboard

A clean, modern web app for browsing academic research papers. Built for researchers who need to quickly find and explore scientific publications.

## What it does

This app lets you browse through research papers with an easy-to-use interface. You can search, filter, and sort papers by different criteria. Click on any paper to see detailed information in a popup modal.

## Key Features

- **Smart Search** - Find papers by title, authors, journal, or publisher
- **Flexible Sorting** - Sort by publication date, impact factor, or title
- **Clean Interface** - Card-based layout that's easy to scan
- **Detailed Views** - Click any paper to see comprehensive details
- **Export Data** - Download results as CSV or PDF
- **Mobile Friendly** - Works great on all screen sizes

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - For better code quality and fewer bugs
- **SCSS** - Styling with variables and mixins
- **React 19** - Latest React features

## Quick Start

### Prerequisites
Make sure you have Node.js installed (version 18 or higher).

### Installation

1. Clone or download this project
2. Open terminal in the project folder
3. Install dependencies:
```bash
npm install
```

### Running the App

Start the development server:
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Building for Production

To create a production build:
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.scss       # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── features/          # Main app components
│   │   └── DataDisplay.tsx
│   └── ui/               # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── ErrorBoundary.tsx
│       └── LoadingSpinner.tsx
├── types/                # TypeScript definitions
│   └── index.ts
└── utils/                # Helper functions
    └── export.ts
```

## How it Works

The app fetches research paper data from the Enago API (`https://easydash.enago.com/acceptedpapers`) and displays it in an organized, searchable format.

### Main Components

- **DataDisplay** - The main component that handles data fetching, search, and pagination
- **ResearchPaperCard** - Individual paper cards with key information
- **Modal** - Detailed view when you click on a paper
- **Search & Filters** - Tools to find specific papers

### Search & Filtering

- Search works across paper titles, authors, journals, and publishers
- Results update as you type (with a small delay to avoid too many requests)
- Sort by date, impact factor, or title in ascending/descending order
- Choose how many papers to show per page (5, 10, 20, or 50)

## Customization

The app uses CSS custom properties for easy theming. Main colors and spacing are defined in `src/app/globals.scss`:

```scss
:root {
  --primary: #000000;
  --gray-50: #fafafa;
  --gray-900: #212121;
  // ... more variables
}
```

## Troubleshooting

**App won't start?**
- Make sure you're using Node.js 18+
- Try deleting `node_modules` and running `npm install` again

**No data showing?**
- Check your internet connection
- The API might be temporarily unavailable

**Styling looks off?**
- Make sure SCSS is properly compiled
- Check browser console for any errors

## Development Notes

This project was built with performance in mind:
- Search is debounced to avoid excessive API calls
- Pagination keeps the interface responsive
- Client-side filtering provides instant results
- Error boundaries prevent crashes

The code is organized to be maintainable and easy to extend. Each component has a clear purpose and the TypeScript interfaces make the data structure explicit.

