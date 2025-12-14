import https from 'https';

export const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 2,          // 👈 CLAVE
  maxFreeSockets: 1,
  timeout: 60000,
});
