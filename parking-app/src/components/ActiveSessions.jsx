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

  if (!externalSessions && loading) return <div className="text-gray-500">Loading sessions…</div>;

  return (
    <div className="mt-6">
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Plate</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">State</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Location</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Start</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Expires</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{s.plate}</td>
                <td className="px-4 py-3 text-gray-700">{s.state}</td>
                <td className="px-4 py-3 text-gray-700">{s.location}</td>
                <td className="px-4 py-3 text-gray-700">{new Date(s.startTime).toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-700">{new Date(s.expiresAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 