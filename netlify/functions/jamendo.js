
 // Netlify Function: search Jamendo's licensed independent-music catalogue.
exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  const reply = (statusCode, data) => ({
    statusCode,
    headers,
    body: JSON.stringify(data)
  });

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return reply(405, { error: 'Method not allowed', results: [] });
  }

  const clientId = process.env.JAMENDO_CLIENT_ID;

  if (!clientId) {
    return reply(200, { configured: false, results: [] });
  }

  const params = new URLSearchParams(event.queryStringParameters || {});
  const search = String(params.get('search') || '').trim().slice(0, 120);

  if (!search) {
    return reply(200, { configured: true, results: [] });
  }

  try {
    const url = new URL('https://api.jamendo.com/v3.0/tracks/');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '30');
    url.searchParams.set('namesearch', search);
    url.searchParams.set('audioformat', 'mp32');
    url.searchParams.set('include', 'licenses,musicinfo');

    const upstream = await fetch(url, {
      headers: { Accept: 'application/json' }
    });

    if (!upstream.ok) {
      return reply(502, {
        configured: true,
        error: 'Music provider unavailable',
        results: []
      });
    }

    const payload = await upstream.json();

    const results = (payload.results || []).map((t) => {
      const license = String(
        t.license_ccurl ||
        (Array.isArray(t.licenses) && t.licenses[0]?.url) ||
        ''
      );

      const audio = String(t.audio || '');

      return {
        id: String(t.id || ''),
        name: String(t.name || 'Unknown track'),
        artist_name: String(t.artist_name || 'Unknown artist'),
        album_name: String(t.album_name || ''),
        image: String(t.album_image || t.image || ''),
        audio,
        duration: Number(t.duration || 0),
        license,
        audiodownload_allowed: !!t.audiodownload_allowed
      };
    }).filter((t) =>
      t.id &&
      t.audio &&
      /^https:\/\//i.test(t.audio) &&
      /^https?:\/\//i.test(t.license)
    );

    return reply(200, { configured: true, results });
  } catch (_error) {
    return reply(502, {
      configured: true,
      error: 'Search failed',
      results: []
    });
  }
};
