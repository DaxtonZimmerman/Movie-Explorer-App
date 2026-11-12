# Movie Explorer App

## Description
A Netflix-inspired React app that searches the OMDb API and displays movie titles, posters, and release years. It starts with Batman and updates results when you type.

## Run locally
```sh
npm install
npm run dev
```
Open the local address printed in the terminal. Use `npm run build` to build for production and `npm run preview` to preview that build. Requires Node.js 20.19+ or 22.12+.

The shared class OMDb key from the assignment is the default. If it expires or hits its quota, copy `.env.example` to `.env`, replace the value with your own key from https://www.omdbapi.com/apikey.aspx, and restart the app. Vite frontend environment variables are visible in the browser; this is not a secret-key storage system.

## Features
- Controlled search input and default Batman search
- Live API fetching using `useEffect`, `fetch`, and `async/await`
- Reusable `useMovies(searchTerm)` custom hook
- Loading, API/network error, no-results, and blank-search states
- 400 ms search debounce to reduce requests while typing
- Request cancellation to prevent outdated results
- Responsive movie grid with title, poster, and year
- Missing/broken poster fallback
- Suggested search buttons
- Movie links to IMDb
- Accessible labels, status announcements, and keyboard focus styles

OMDb returns up to 10 matches per page. This app displays the first page and labels the count as movies shown.

## Component structure
```text
src/
├── main.jsx
├── App.jsx
├── styles.css
├── hooks/
│   └── useMovies.js
└── components/
    ├── SearchBar.jsx
    ├── StatusMessage.jsx
    ├── MovieList.jsx
    └── MovieCard.jsx
```

`App` owns the search term and connects the hook to the UI. `SearchBar` receives its value and change handler through props. `StatusMessage` displays the current status. `MovieList` maps results to `MovieCard` components. Each card displays the title, poster, and year.

## Reflection questions
These are draft answers about this implementation. Rewrite the personal answers in your own words after trying the app.

### 1. Why is data fetching placed inside a custom hook?
The hook keeps the fetching and request-state logic together and separates it from the UI. Components can focus on displaying data, and another component could reuse the same hook.

### 2. What does your useEffect depend on?
It depends on `searchTerm`. Each change cancels the previous timer/request and schedules a new search. An empty search clears results without calling the API.

### 3. How did you handle loading and error states?
The hook tracks `loading` and `error` alongside `movies`. It sets loading before the debounce, clears old errors, catches failed requests and OMDb errors, and resets loading when the active request finishes. `StatusMessage` renders the appropriate feedback. A movie-not-found response becomes an empty list rather than a service error.

### 4. What part of the app was most difficult?
Suggested topic to reflect on: keeping an older request from replacing results after a new search. This implementation uses `AbortController` and clears the debounce timer during effect cleanup. Describe which part you personally found hardest after reviewing the code.

### 5. What would you improve next?
Possible next improvements are pagination, favorites saved in localStorage, or a movie-details view. Choose the improvement you would actually like to build.

## Checks
```sh
npm test
npm run build
```
Tests exercise the real hook and UI with mocked network responses, including success, empty results, errors, debounce, and request cleanup. Live API access depends on the class key, network, and OMDb availability.

## Submission
Push this folder to a GitHub repository and submit that repository URL. Include this README and the source files; do not upload `node_modules` or `dist`.
