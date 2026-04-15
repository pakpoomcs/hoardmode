export interface Env {
  PRESETS: KVNamespace;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function userKey(userId: string): string {
  return `user:${userId}:presets`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    // Routes: /api/presets/:userId
    const match = url.pathname.match(/^\/api\/presets\/([^/]+)$/);
    if (!match) {
      return json({ error: 'Not found' }, 404);
    }

    const userId = match[1];

    if (request.method === 'GET') {
      const raw = await env.PRESETS.get(userKey(userId));
      const presets = raw ? JSON.parse(raw) : [];
      return json({ presets });
    }

    if (request.method === 'POST') {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return json({ error: 'Invalid JSON' }, 400);
      }
      await env.PRESETS.put(userKey(userId), JSON.stringify(body), {
        expirationTtl: 60 * 60 * 24 * 365, // 1 year
      });
      return json({ ok: true });
    }

    if (request.method === 'DELETE') {
      await env.PRESETS.delete(userKey(userId));
      return json({ ok: true });
    }

    return json({ error: 'Method not allowed' }, 405);
  },
};
