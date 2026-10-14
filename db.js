const { Pool } = require('pg');

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required. Copy .env.example to .env and configure PostgreSQL.');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id BIGSERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), last_login_at TIMESTAMPTZ
    );
    CREATE TABLE IF NOT EXISTS enquiries (
      id BIGSERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL, phone VARCHAR(40) NOT NULL,
      email VARCHAR(254), contact_method VARCHAR(40), county VARCHAR(100) NOT NULL,
      location VARCHAR(180) NOT NULL, project_type VARCHAR(120) NOT NULL,
      services TEXT[] NOT NULL DEFAULT '{}', budget VARCHAR(100) NOT NULL,
      start_date VARCHAR(100), plot_status VARCHAR(100), size VARCHAR(120), details TEXT NOT NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'new', admin_notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS services (
      id BIGSERIAL PRIMARY KEY, title VARCHAR(160) NOT NULL, description TEXT NOT NULL,
      icon VARCHAR(60) DEFAULT 'hammer', active BOOLEAN NOT NULL DEFAULT TRUE,
      sort_order INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS projects (
      id BIGSERIAL PRIMARY KEY, title VARCHAR(180) NOT NULL, category VARCHAR(80) NOT NULL,
      location VARCHAR(160), description TEXT, image_url TEXT, featured BOOLEAN NOT NULL DEFAULT FALSE,
      published BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS comments (
      id BIGSERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, text VARCHAR(600) NOT NULL,
      approved BOOLEAN NOT NULL DEFAULT FALSE, likes INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS testimonials (
      id BIGSERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, role VARCHAR(120),
      quote VARCHAR(1000) NOT NULL, rating SMALLINT NOT NULL DEFAULT 5,
      published BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries(created_at DESC);
    CREATE INDEX IF NOT EXISTS comments_approved_idx ON comments(approved, created_at DESC);
    CREATE INDEX IF NOT EXISTS projects_published_idx ON projects(published, created_at DESC);
  `);
}
module.exports = { pool, migrate };
