Parking App – Implementation Plan (Updated)

1. Project Setup

- npm create vite@latest parking-app -- --template react
- cd parking-app
- npm install
- npm install axios react-modal tailwindcss postcss autoprefixer -D @tailwindcss/postcss

Tailwind v4 setup:

- postcss.config.js

export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}

- tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}

- src/index.css

@import "tailwindcss";

- index.html body classes

<body class="min-h-screen bg-gray-50 text-gray-900 antialiased font-sans selection:bg-indigo-200/60 selection:text-indigo-900">

2. Project Structure

src/
  api/
    activeSessions.js
    favorites.js
    createSession.js
  components/
    ActiveSessions.jsx
    CreateSessionModal.jsx
    FavoritesPickerModal.jsx
  utils/
    sessionScheduler.js
  App.jsx
  index.css
backend/
  playwright/
    main.py              # Playwright bootstrap + env creds
    auth.py              # Login flow stub
    visitors.py          # get_active_visitors()
    favorites.py         # get_favorites()
    create.py            # create_session()
    check.py             # check_session()

3. Mock API Setup (dev only)

- activeSessions.js → returns an array of current sessions
- favorites.js → several unique favorites for testing
- createSession.js → accepts { plate, state, make, model, color } and returns
  { id, plate, state, make, model, color, startTime, expiresAt }
  (expiresAt is now + 1 day by default)

4. Components

- ActiveSessions.jsx
  - Tailwind table with columns: Plate, State, Vehicle (make/model/color), Start, Expires, Desired End
  - Accepts optional sessions prop for optimistic UI

- CreateSessionModal.jsx
  - Fields: plate, state (default TX), make, model, color
  - Desired end (days from now) is chosen here (not on the dashboard)
  - On submit: calls createSession(), sets desiredEndDate in the app, and passes desiredEndAt back with the new session for display
  - Single "Choose from favorites" button opens FavoritesPickerModal

- FavoritesPickerModal.jsx
  - Searchable, scrollable modal to pick a favorite (nickname/plate/state)
  - On pick: applies plate/state and closes

5. Multi‑Day Session Logic (sessionScheduler.js)

- Tracks a global desiredEndDate set during session creation
- Checks every minute
- If <1 hour to expiry and more than a day remains to desiredEndDate → triggers renewal by opening the create-session modal

6. App Flow

- Load active sessions on mount
- Users open CreateSessionModal → set vehicle details + desired end (days)
- After create:
  - Optimistically add the created session to state with desiredEndAt
  - Save desiredEndDate in app state (used by scheduler)
- Dashboard shows a read-only card with desired end date if set
- Sessions table displays Desired End per row when available

7. UI Rules

- Location is implied and not part of the form
- Favorites are accessed via a picker modal (not inline in the form)
- Default state: TX
- Modern Tailwind styling (gradient header, rounded cards, hover/empty states)

8. Styling

- Tailwind CSS v4 everywhere
- Responsive table, hover states, alternating rows
- Modal: rounded, shadowed, blurred overlay, contained scroll areas
- Buttons: hover/focus variants

9. Transition to Real API (Python + Playwright)

- Replace mock API with Python Playwright scraper that logs into https://registermyplate.com/Resident/
- Backend functions:
  - get_active_visitors() → Scrape current active parking sessions
  - get_favorites() → Scrape and return saved favorites
  - create_session(data) → Automate form fill + submission
  - check_session(session_id) → Verify if still active
- Auth flow:
  - Launch Playwright browser
  - Go to login page
  - Enter credentials (env: REGISTER_USERNAME, REGISTER_PASSWORD)
  - Maintain authenticated session
- Frontend switch:
  - Update API files in src/api/ to call /api/active-sessions, /api/favorites, /api/create-session, /api/check-session
  - Components remain unchanged — only API layer swaps