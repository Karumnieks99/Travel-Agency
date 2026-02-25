# Surga Indonesia Travel

Portfolio-ready travel website built with React + Vite, focused on premium trip presentation, booking flow clarity, and responsive UI polish.

## Live Demo

https://karumnieks99.github.io/Travel-Agency/

## What This Project Showcases

- Multi-page travel website architecture with dedicated route pages (`Home`, `Trips`, `Trip detail`, `Contact`, and legal pages).
- Premium trip-detail experience with a styled day-by-day itinerary timeline, expandable daily cards, and structured trip content.
- Conversion-oriented UI sections for trust signals, availability, and booking/waitlist actions.
- Responsive design for desktop and mobile, including reduced-motion support for media-heavy sections.

## Key Features

- Dynamic destination and itinerary rendering from data files in `src/data/`.
- Day-by-day itinerary UX in `TripPage`: expanded/collapsed day cards, timeline segments (Morning/Afternoon/Evening), and contextual tags/highlights.
- Pricing, departure date, and seat availability display for each trip.
- Contact/booking prefill links for faster lead capture.

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS
- JavaScript (ES modules)

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)

```bash
npm run deploy
```

The project is configured for GitHub Pages with base path:

```js
/Travel-Agency/
```

## Project Structure

```text
src/
  components/
  data/
  pages/
  utils/
public/
  photos/
  videos/
```

## Portfolio Note

This project is intended as a front-end portfolio piece demonstrating practical product UI work: content-heavy page design, responsive layout decisions, and user-focused booking flows.
