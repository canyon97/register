Parking App – Implementation Plan

1. Project Setup

npm create vite@latest parking-app
# Choose: React, JavaScript
cd parking-app
npm install

Install dependencies:

npm install axios react-modal tailwindcss postcss autoprefixer
npx tailwindcss init -p

axios for API calls, react-modal for modal UI, Tailwind CSS for modern styling.

tailwind.config.js:

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}

src/index.css:

@tailwind base;
@tailwind components;
@tailwind utilities;

2. Project Structure

src/
  api/
    activeSessions.js
    favorites.js
    createSession.js
  components/
    ActiveSessions.jsx
    CreateSessionModal.jsx
  utils/
    sessionScheduler.js
  App.jsx
  index.css
backend/
  playwright/
    main.py              # Python Playwright automation entrypoint
    auth.py              # Login logic for registermyplate.com
    visitors.py          # get active visitors
    favorites.py         # get favorites
    create.py            # create session
    check.py             # check session

3. Mock API Setup (for dev only)

Temporary JS mock files return hardcoded data until backend is ready.

4. Components

ActiveSessions.jsx → Tailwind table, fetches active sessions.

CreateSessionModal.jsx → Tailwind modal, expiration days input (default 1), favorites list inside modal.

5. Multi-Day Session Logic (sessionScheduler.js)

Tracks desiredEndDate.

Checks sessions every minute.

If <1 hour to expiry & more days left → call createSession().

6. App Flow

Load active sessions.

Start scheduler.

Create session → optimistic update.

Modal closes after success.

7. UI Rules

Favorites only in modal.

Pre-fill form from favorite.

Optimistic UI updates.

Default state: TX.

Default expiration: 1 day (user can extend).

8. Styling

Tailwind CSS everywhere.

Responsive table, hover states, alternating rows.

Modal: centered, rounded, shadow, transitions.

Buttons: hover/focus variants.

9. Transition to Real API (Python + Playwright)

We will replace mock API calls with real endpoints backed by a Python Playwright scraper that logs into https://registermyplate.com/Resident/.

Backend functions:

get_active_visitors() → Scrape current active parking sessions.

get_favorites() → Scrape and return saved favorites.

create_session(data) → Automate form fill + submission.

check_session(session_id) → Verify if still active.

Auth flow:

Launch Playwright browser.

Go to login page.

Enter credentials (from env vars).

Maintain authenticated session for scraping/automation.

Frontend switch:

Update API files in src/api/ to call /api/active-sessions, /api/favorites, /api/create-session, /api/check-session.

No component changes required — only API layer swaps.