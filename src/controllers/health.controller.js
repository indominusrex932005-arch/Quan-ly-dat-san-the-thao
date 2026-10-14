export function createHealthController({ demo, databaseReady }) {
  return {
    status(_req, res) {
      res.json({ status: 'ok', mode: demo ? 'demo' : 'mongodb', databaseConnected: databaseReady() });
    },
  };
}
