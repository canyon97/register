export async function getActiveSessions() {
  // Mock data for development
  return [
    {
      id: "sess_1",
      plate: "TX-ABC1234",
      startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      location: "Visitor Lot A",
      state: "TX",
    },
  ];
} 