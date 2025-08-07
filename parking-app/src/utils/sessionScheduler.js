export function startSessionScheduler({ getDesiredEndDate, getActiveSessions, onRenew }) {
  const intervalMs = 60 * 1000; // 1 minute
  let timerId = null;

  function checkAndMaybeRenew() {
    const desiredEnd = getDesiredEndDate?.();
    if (!desiredEnd) return;

    const sessions = getActiveSessions?.() || [];
    const now = Date.now();
    const remainingMs = Math.max(0, desiredEnd.getTime() - now);

    const soonThresholdMs = 60 * 60 * 1000; // 1 hour

    // If we have remaining days and the current active session is expiring within an hour, renew
    const active = sessions[0];
    const activeExpiresAt = active ? new Date(active.expiresAt).getTime() : 0;
    const timeToExpire = activeExpiresAt - now;

    const moreDaysLeft = remainingMs > 24 * 60 * 60 * 1000; // at least another day desired

    if (active && timeToExpire < soonThresholdMs && moreDaysLeft) {
      onRenew?.();
    }
  }

  timerId = setInterval(checkAndMaybeRenew, intervalMs);
  checkAndMaybeRenew();

  return () => clearInterval(timerId);
} 