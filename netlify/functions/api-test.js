import pg from 'pg';

const { Pool } = pg;

export const handler = async function (event, context) {
  const connectionString = process.env.NETLIFY_DATABASE_URL;
  const headers = { 'Content-Type': 'application/json' };

  // Log environment status
  console.log('[api-test] Checking environment...');
  console.log('[api-test] NETLIFY_DATABASE_URL loaded:', !!connectionString);

  if (!connectionString) {
    console.error('[api-test] ERROR: NETLIFY_DATABASE_URL not set');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: 'NETLIFY_DATABASE_URL not set' }),
    };
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('[api-test] Attempting to connect to database...');
    const client = await pool.connect();
    console.log('[api-test] ✓ Connected to database');

    console.log('[api-test] Running query: SELECT NOW() AS database_time');
    const result = await client.query('SELECT NOW() AS database_time');
    const databaseTime = result.rows[0].database_time;

    client.release();
    console.log('[api-test] ✓ Query successful. Database time:', databaseTime);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, database_time: databaseTime }),
    };
  } catch (err) {
    console.error('[api-test] ✗ Database error:', err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  } finally {
    await pool.end();
  }
};
