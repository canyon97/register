import Modal from "react-modal";
import { useEffect, useMemo, useState } from "react";
import { getFavorites } from "../api/favorites";
import { createSession } from "../api/createSession";
import FavoritesPickerModal from "./FavoritesPickerModal";

Modal.setAppElement("#root");

export default function CreateSessionModal({ isOpen, onRequestClose, onCreate }) {
  const [favorites, setFavorites] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [plate, setPlate] = useState("");
  const [state, setState] = useState("TX");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [desiredDaysFromNow, setDesiredDaysFromNow] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoadingFavs(true);
    getFavorites().then((f) => {
      setFavorites(f);
      setLoadingFavs(false);
    });
    // reset defaults each open
    setState("TX");
    setPlate("");
    setMake("");
    setModel("");
    setColor("");
    setDesiredDaysFromNow(1);
  }, [isOpen]);

  const canSubmit = useMemo(
    () =>
      plate.trim().length >= 3 &&
      state.trim().length >= 2 &&
      make.trim().length > 0 &&
      model.trim().length > 0 &&
      color.trim().length > 0 &&
      desiredDaysFromNow >= 1,
    [plate, state, make, model, color, desiredDaysFromNow]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const session = await createSession({ plate, state, make, model, color });
      const end = new Date();
      end.setDate(end.getDate() + Number(desiredDaysFromNow));
      onCreate?.(session, end);
      onRequestClose?.();
      setPlate("");
      setState("TX");
      setMake("");
      setModel("");
      setColor("");
      setDesiredDaysFromNow(1);
    } finally {
      setSubmitting(false);
    }
  }

  function applyFavorite(fav) {
    setPlate(fav.plate);
    setState(fav.state || "TX");
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="mx-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 outline-none max-h-[85vh] flex flex-col"
      overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      contentLabel="Create Parking Session"
    >
      <h2 className="text-xl font-semibold tracking-tight text-gray-900">Create Parking Session</h2>
      <p className="mt-1 text-sm text-gray-600">Default state is TX. Default expiration is 1 day.</p>

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Plate</label>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Choose from favorites
            </button>
          </div>
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
            <label className="block text-sm font-medium text-gray-700">Make</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="Toyota"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Model</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Camry"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Blue"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Desired end (days from now)</label>
          <input
            type="number"
            min={1}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={desiredDaysFromNow}
            onChange={(e) => setDesiredDaysFromNow(Number(e.target.value))}
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

      {/* Favorites list removed: use the picker modal only */}

      <FavoritesPickerModal
        isOpen={pickerOpen}
        onRequestClose={() => setPickerOpen(false)}
        favorites={favorites}
        onPick={(fav) => applyFavorite(fav)}
      />
    </Modal>
  );
} 