import { useEffect, useMemo, useState } from "react";
import "./index.css";
import ActiveSessions from "./components/ActiveSessions";
import CreateSessionModal from "./components/CreateSessionModal";
import { getActiveSessions as fetchActiveSessions } from "./api/activeSessions";
import { startSessionScheduler } from "./utils/sessionScheduler";

function App() {
  const [sessions, setSessions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [desiredEndDate, setDesiredEndDate] = useState(null);

  useEffect(() => {
    fetchActiveSessions().then(setSessions);
  }, []);

  useEffect(() => {
    const stop = startSessionScheduler({
      getDesiredEndDate: () => desiredEndDate,
      getActiveSessions: () => sessions,
      onRenew: () => setModalOpen(true),
    });
    return stop;
  }, [desiredEndDate, sessions]);

  const remainingDays = useMemo(() => {
    if (!desiredEndDate) return null;
    const ms = Math.max(0, desiredEndDate.getTime() - Date.now());
    return Math.ceil(ms / (24 * 60 * 60 * 1000));
  }, [desiredEndDate]);

  function handleCreate(session, newDesiredEndDate) {
    setSessions((prev) => [session, ...prev]);
    if (newDesiredEndDate) setDesiredEndDate(newDesiredEndDate);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-sm ring-1 ring-black/5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Parking App</h1>
            <p className="mt-1 text-sm text-white/80">Automate visitor parking sessions</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            New Session
          </button>
        </div>
      </header>

      {desiredEndDate && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-indigo-100 bg-white p-4 text-sm text-indigo-900 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">⏱️</span>
            <div>
              <div className="font-medium">Desired end date</div>
              <div className="text-gray-700">{desiredEndDate.toLocaleString()} ({remainingDays} day{remainingDays !== 1 ? "s" : ""} left)</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">Set during session creation</div>
        </div>
      )}

      <ActiveSessions sessions={sessions} />

      <CreateSessionModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

export default App;
