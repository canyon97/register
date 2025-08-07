export async function createSession({ plate, state = "TX", expiresInDays = 1, location }) {
  await new Promise((r) => setTimeout(r, 400));
  const now = Date.now();
  return {
    id: `sess_${Math.random().toString(36).slice(2, 8)}`,
    plate,
    state,
    startTime: new Date(now).toISOString(),
    expiresAt: new Date(now + expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
    location,
  };
} 