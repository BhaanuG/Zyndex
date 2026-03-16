import pg from "pg";

const { Pool } = pg;

export const handler = async (event) => {

  const connectionString = process.env.NETLIFY_DATABASE_URL;

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {

    const data = JSON.parse(event.body);

    const { email, password } = data;

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email and password required" })
      };
    }

    const client = await pool.connect();

    const result = await client.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );

    client.release();

    if (result.rows.length === 0) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid email or password" })
      };
    }

    const user = result.rows[0];

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      })
    };

  } catch (err) {

    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };

  } finally {
    await pool.end();
  }
};
