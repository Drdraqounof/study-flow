// seed.js - Seed Neon database with user_logins table and mock data
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions_log (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Insert mock onboarding question responses
    await pool.query(`
      INSERT INTO questions_log (user_id, question, answer, created_at) VALUES
        (1, 'Do you find it challenging to manage your time effectively?', 'Yes', NOW() - INTERVAL '2 days'),
        (2, 'Do you find it challenging to manage your time effectively?', 'No', NOW() - INTERVAL '1 day'),
        (3, 'Do you find it challenging to manage your time effectively?', 'Yes', NOW() - INTERVAL '3 hours'),
        (1, 'Do you currently use any tools to organize your study materials?', 'No', NOW() - INTERVAL '2 days'),
        (2, 'Do you currently use any tools to organize your study materials?', 'Yes', NOW() - INTERVAL '1 day'),
        (3, 'Do you currently use any tools to organize your study materials?', 'No', NOW() - INTERVAL '3 hours'),
        (1, 'Have you used any productivity or study apps before?', 'Yes', NOW() - INTERVAL '2 days'),
        (2, 'Have you used any productivity or study apps before?', 'No', NOW() - INTERVAL '1 day'),
        (3, 'Have you used any productivity or study apps before?', 'Yes', NOW() - INTERVAL '3 hours'),
        (1, 'Do you think an AI assistant could help you with your studies?', 'Yes', NOW() - INTERVAL '2 days'),
        (2, 'Do you think an AI assistant could help you with your studies?', 'No', NOW() - INTERVAL '1 day'),
        (3, 'Do you think an AI assistant could help you with your studies?', 'Yes', NOW() - INTERVAL '3 hours');
    `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_logins (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      login_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    INSERT INTO user_logins (email, login_time) VALUES
      ('rob@launchpadphilly.org', NOW() - INTERVAL '2 days'),
      ('sanaa@launchpadphilly.org', NOW() - INTERVAL '1 day'),
      ('taheera@launchpadphilly.org', NOW() - INTERVAL '3 hours'),
      ('student1@example.com', NOW() - INTERVAL '5 hours'),
      ('student2@example.com', NOW() - INTERVAL '1 hour');
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS study_sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      start_time TIMESTAMPTZ NOT NULL,
      end_time TIMESTAMPTZ NOT NULL,
      duration_minutes INTEGER NOT NULL
    );
  `);

  await pool.query(`
    INSERT INTO study_sessions (user_id, start_time, end_time, duration_minutes) VALUES
      (1, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days' + INTERVAL '45 minutes', 45),
      (2, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '30 minutes', 30),
      (3, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '60 minutes', 60),
      (1, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour', 60);
  `);

  console.log('Database seeded successfully!');
  await pool.end();
}

seed().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
