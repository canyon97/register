import Modal from "react-modal";
import { useMemo, useState } from "react";

Modal.setAppElement("#root");

export default function FavoritesPickerModal({ isOpen, onRequestClose, favorites = [], onPick }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return favorites;
    return favorites.filter((f) =>
      [f.nickname, f.plate, f.state].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [query, favorites]);

  function handlePick(fav) {
    onPick?.(fav);
    onRequestClose?.();
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="mx-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 outline-none max-h-[85vh] flex flex-col"
      overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      contentLabel="Choose Favorite"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900">Choose Favorite</h2>
        <button
          onClick={onRequestClose}
          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Close
        </button>
      </div>
      <div className="mt-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by nickname, plate, or state"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="mt-4 grid flex-1 min-h-0 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {filtered.map((f) => (
          <div key={f.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-gray-900">{f.nickname}</div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-600">
                <span className="rounded-md bg-gray-900 px-2 py-0.5 font-mono text-[11px] font-semibold text-white ring-1 ring-inset ring-gray-800">{f.plate}</span>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">{f.state}</span>
              </div>
            </div>
            <button
              className="ml-3 shrink-0 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50"
              onClick={() => handlePick(f)}
            >
              Use
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600">
            No favorites found.
          </div>
        )}
      </div>
    </Modal>
  );
} 