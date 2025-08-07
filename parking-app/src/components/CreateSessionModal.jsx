import Modal from "react-modal";
import { useEffect, useMemo, useState } from "react";
import { getFavorites } from "../api/favorites";
import { createSession } from "../api/createSession";

Modal.setAppElement("#root");

export default function CreateSessionModal({ isOpen, onRequestClose, onCreate }) {
  const [favorites, setFavorites] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(false);
  const [plate, setPlate] = useState("");
  const [state, setState] = useState("TX");
  const [location, setLocation] = useState("Visitor Lot A");
  const [expiresInDays, setExpiresInDays] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoadingFavs(true);
    getFavorites().then((f) => {
      setFavorites(f);
      setLoadingFavs(false);
    });
  }, [isOpen]);

  const canSubmit = useMemo(() => plate.trim().length >= 3 && expiresInDays >= 1, [plate, expiresInDays]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const session = await createSession({ plate, state, location, expiresInDays });
      onCreate?.(session);
      onRequestClose?.();
      setPlate("");
      setState("TX");
      setLocation("Visitor Lot A");
      setExpiresInDays(1);
    } finally {
      setSubmitting(false);
    }
  }

  function applyFavorite(fav) {
    setPlate(fav.plate);
    setState(fav.state || "TX");
    setLocation(fav.defaultLocation || "Visitor Lot A");
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="mx-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 outline-none"
      overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      contentLabel="Create Parking Session"
    >
      <h2 className="text-xl font-semibold tracking-tight text-gray-900">Create Parking Session</h2>
      <p className="mt-1 text-sm text-gray-600">Default state is TX. Default expiration is 1 day.</p>

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Plate</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            placeholder="ABC1234"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <select
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              {["TX","AL","AZ","CA","CO","FL","GA","IL","NY","WA"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Expires (days)</label>
            <input
              type="number"
              min={1}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Visitor Lot A"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Create Session"}
          </button>
          <button
            type="button"
            onClick={onRequestClose}
            className="ml-3 inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="mt-6 border-t border-gray-100 pt-4">
        <h3 className="text-sm font-semibold text-gray-800">Favorites</h3>
        {loadingFavs ? (
          <div className="mt-2 text-gray-500">Loading…</div>
        ) : (
          <ul className="mt-2 max-h-44 space-y-2 overflow-y-auto">
            {favorites.map((f) => (
              <li key={f.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-2">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-gray-900 px-2 py-1 font-mono text-xs font-semibold text-white ring-1 ring-inset ring-gray-800">
                    {f.plate}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{f.nickname}</div>
                    <div className="text-xs text-gray-600">{f.state} · {f.defaultLocation}</div>
                  </div>
                </div>
                <button
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50"
                  onClick={() => applyFavorite(f)}
                >
                  Use
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
} 