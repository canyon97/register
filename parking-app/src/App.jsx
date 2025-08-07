import { useEffect, useMemo, useState } from "react";
import "./index.css";
import ActiveSessions from "./components/ActiveSessions";
import CreateSessionModal from "./components/CreateSessionModal";
import { getActiveSessions as fetchActiveSessions } from "./api/activeSessions";
import { startSessionScheduler } from "./utils/sessionScheduler";

function App() {
  const [sessions, setSessions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [desiredEndDate, setDesiredEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });

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
    const ms = Math.max(0, desiredEndDate.getTime() - Date.now());
    return Math.ceil(ms / (24 * 60 * 60 * 1000));
  }, [desiredEndDate]);

  function handleCreate(session) {
    setSessions((prev) => [session, ...prev]);
  }

  function updateDesiredDays(days) {
    const num = Math.max(1, Math.min(30, Number(days) || 1));
    const d = new Date();
    d.setDate(d.getDate() + num);
    setDesiredEndDate(d);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Parking App</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-500"
        >
          New Session
        </button>
      </header>

      <div className="mt-4 flex items-center justify-between rounded-md bg-indigo-50 p-3 text-sm text-indigo-800">
        <div>
          Desired end date: {desiredEndDate.toLocaleString()} ({remainingDays} day{remainingDays !== 1 ? "s" : ""} left)
        </div>
        <label className="ml-4 flex items-center gap-2 text-indigo-900">
          <span>Days from now</span>
          <input
            type="number"
            min={1}
            max={30}
            value={remainingDays}
            onChange={(e) => updateDesiredDays(e.target.value)}
            className="w-20 rounded-md border border-indigo-200 bg-white px-2 py-1 text-indigo-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </label>
      </div>

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
