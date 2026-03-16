import pg from "pg";
import bcrypt from "bcryptjs";

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
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    client.release();

    if (result.rows.length === 0) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "User not found" })
      };
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid password" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
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
