import { useEffect, useState } from "react";
import { getActiveSessions } from "../api/activeSessions";

export default function ActiveSessions({ sessions: externalSessions }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(!externalSessions);

  useEffect(() => {
    if (externalSessions) return;
    let mounted = true;
    getActiveSessions().then((data) => {
      if (mounted) {
        setSessions(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [externalSessions]);

  const rows = externalSessions ?? sessions;

  if (!externalSessions && loading) return <div className="mt-6 text-sm text-gray-500">Loading sessions…</div>;

  if (rows.length === 0) {
    return (
      <section className="mt-8">
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">🅿️</div>
          <div className="text-sm">No active sessions yet.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {rows.map((s) => (
          <div key={s.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-gray-900 px-2 py-1 font-mono text-xs font-semibold text-white ring-1 ring-inset ring-gray-800">{s.plate}</span>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">{s.state}</span>
            </div>
            <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div className="flex flex-col">
                <dt className="text-xs font-medium text-gray-500">Vehicle</dt>
                <dd className="text-gray-800">{s.make || s.model || s.color ? [s.make, s.model, s.color].filter(Boolean).join(" ") : "—"}</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xs font-medium text-gray-500">Start</dt>
                <dd className="text-gray-800">{new Date(s.startTime).toLocaleString()}</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xs font-medium text-gray-500">Expires</dt>
                <dd className="text-gray-800">{new Date(s.expiresAt).toLocaleString()}</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xs font-medium text-gray-500">Desired End</dt>
                <dd className="text-gray-800">{s.desiredEndAt ? new Date(s.desiredEndAt).toLocaleString() : "—"}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/60">
            <tr>
              <Th>Plate</Th>
              <Th>State</Th>
              <Th>Vehicle</Th>
              <Th>Start</Th>
              <Th>Expires</Th>
              <Th>Desired End</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((s, idx) => (
              <tr key={s.id} className={`${idx % 2 ? "bg-gray-50/40" : "bg-white"} hover:bg-indigo-50/40 transition` }>
                <Td>
                  <span className="inline-flex items-center gap-2">
                    <span className="rounded-md bg-gray-900 px-2 py-1 font-mono text-xs font-semibold text-white ring-1 ring-inset ring-gray-800">{s.plate}</span>
                  </span>
                </Td>
                <Td>
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
                    {s.state}
                  </span>
                </Td>
                <Td>
                  {s.make || s.model || s.color ? (
                    <span className="text-gray-700">{[s.make, s.model, s.color].filter(Boolean).join(" ")}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </Td>
                <Td>{new Date(s.startTime).toLocaleString()}</Td>
                <Td>{new Date(s.expiresAt).toLocaleString()}</Td>
                <Td>{s.desiredEndAt ? new Date(s.desiredEndAt).toLocaleString() : <span className="text-gray-400">—</span>}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Th({ children }) {
  return (
    <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-600 sm:px-4">
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return <td className={`px-3 py-3 text-sm text-gray-700 sm:px-4 ${className}`}>{children}</td>;
} 