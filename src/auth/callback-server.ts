import express from 'express';
import { oauth } from './oauth.js';
import open from 'open';

let callbackServer: ReturnType<typeof express> | null = null;
let expressServer: any = null;

export async function startCallbackServer(port: number = 3000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (callbackServer) {
      resolve();
      return;
    }

    callbackServer = express();
    callbackServer.use(express.json());

    callbackServer.get('/callback', async (req, res) => {
      const code = req.query.code as string;
      const state = req.query.state as string;

      if (!code) {
        res.status(400).send('Missing authorization code');
        return;
      }

      try {
        await oauth.exchangeCodeForToken(code);
        res.send(
          '<html><body style="font-family: sans-serif; text-align: center; padding: 50px;">' +
          '<h1>✅ Authentication Successful!</h1>' +
          '<p>You can now close this window and use Upwork with Claude.</p>' +
          '</body></html>'
        );

        setTimeout(() => {
          stopCallbackServer();
        }, 1000);
      } catch (error) {
        res.status(500).send('Authentication failed: ' + error);
      }
    });

    callbackServer.get('/', (req, res) => {
      res.send(
        '<html><body style="font-family: sans-serif; text-align: center; padding: 50px;">' +
        '<h1>Upwork Claude Integration</h1>' +
        '<p>If you were redirected here, authentication is in progress...</p>' +
        '</body></html>'
      );
    });

    expressServer = callbackServer.listen(port, () => {
      console.log(`Callback server listening on http://localhost:${port}`);
      resolve();
    });

    expressServer.on('error', reject);
  });
}

export async function stopCallbackServer(): Promise<void> {
  return new Promise((resolve) => {
    if (expressServer) {
      expressServer.close(() => {
        callbackServer = null;
        expressServer = null;
        resolve();
      });
    } else {
      resolve();
    }
  });
}

export async function initiateAuthentication(): Promise<void> {
  try {
    await startCallbackServer(3000);
    const authUrl = oauth.getAuthorizationUrl();
    console.log(`Opening browser for authentication: ${authUrl}`);
    await open(authUrl);
  } catch (error) {
    console.error('Failed to initiate authentication:', error);
    throw error;
  }
}
