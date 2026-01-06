-- Neon schema for user logins

CREATE TABLE IF NOT EXISTS user_logins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  login_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Se npm run dev

> study@0.1.0 dev
> next dev

⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of C:\Projects\study\package-lock.json as the root directory.
 To silence this warning, set `turbopack.root` in your Next.js config, or consider removing one of the lockfiles if it's not needed.
   See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory for more information.
 Detected additional lockfiles:
   * C:\Projects\study\study\package-lock.json

▲ Next.js 16.1.1 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://10.0.0.43:3000
- Environments: .env.local, .env

✓ Starting...
✓ Ready in 1429ms
 GET / 200 in 1369ms (compile: 994ms, render: 376ms)
 GET /questions 200 in 535ms (compile: 464ms, render: 71ms)
 GET /login 200 in 106ms (compile: 67ms, render: 38ms)
⨯ error: there is no unique or exclusion constraint matching the ON CONFLICT specification
    at async POST (app\api\logins\route.ts:26:18)
  24 |   }
  25 |   // Try to insert the user, ignore if already exists
> 26 |   const result = await pool.query(
     |                  ^
  27 |     'INSERT INTO user_logins (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING id',
  28 |     [email]
  29 |   ); {
  length: 148,
  severity: 'ERROR',
  code: '42P10',
  detail: undefined,
  hint: undefined,
  position: undefined,
  internalPosition: undefined,
  internalQuery: undefined,
  where: undefined,
  schema: undefined,
  table: undefined,
  column: undefined,
  dataType: undefined,
  constraint: undefined,
  file: 'plancat.c',
  line: '885',
  routine: 'infer_arbiter_indexes'
}
 POST /api/logins 500 in 657ms (compile: 248ms, render: 409ms)
⨯ error: there is no unique or exclusion constraint matching the ON CONFLICT specification
    at async POST (app\api\logins\route.ts:26:18)
  24 |   }
  25 |   // Try to insert the user, ignore if already exists
> 26 |   const result = await pool.query(
     |                  ^
  27 |     'INSERT INTO user_logins (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING id',
  28 |     [email]
  29 |   ); {
  length: 148,
  severity: 'ERROR',
  code: '42P10',
  detail: undefined,
  hint: undefined,
  position: undefined,
  internalPosition: undefined,
  internalQuery: undefined,
  where: undefined,
  schema: undefined,
  table: undefined,
  column: undefined,
  dataType: undefined,
  constraint: undefined,
  file: 'plancat.c',
  line: '885',
  routine: 'infer_arbiter_indexes'
}
 POST /api/logins 500 in 1300ms (compile: 74ms, render: 1226ms)
 POST /api/signup 200 in 1516ms (compile: 372ms, render: 1144ms)
⨯ error: there is no unique or exclusion constraint matching the ON CONFLICT specification
    at async POST (app\api\logins\route.ts:26:18)
  24 |   }
  25 |   // Try to insert the user, ignore if already exists
> 26 |   const result = await pool.query(
     |                  ^
  27 |     'INSERT INTO user_logins (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING id',
  28 |     [email]
  29 |   ); {
  length: 148,
  severity: 'ERROR',
  code: '42P10',
  detail: undefined,
  hint: undefined,
  position: undefined,
  internalPosition: undefined,
  internalQuery: undefined,
  where: undefined,
  schema: undefined,
  table: undefined,
  column: undefined,
  dataType: undefined,
  constraint: undefined,
  file: 'plancat.c',
  line: '885',
  routine: 'infer_arbiter_indexes'
}
 POST /api/logins 500 in 250ms (compile: 4ms, render: 246ms)
⨯ error: there is no unique or exclusion constraint matching the ON CONFLICT specification
    at async POST (app\api\logins\route.ts:26:18)
  24 |   }
  25 |   // Try to insert the user, ignore if already exists
> 26 |   const result = await pool.query(
     |                  ^
  27 |     'INSERT INTO user_logins (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING id',
  28 |     [email]
  29 |   ); {
  length: 148,
  severity: 'ERROR',
  code: '42P10',
  detail: undefined,
  hint: undefined,
  position: undefined,
  internalPosition: undefined,
  internalQuery: undefined,
  where: undefined,
  schema: undefined,
  table: undefined,
  column: undefined,
  dataType: undefined,
  constraint: undefined,
  file: 'plancat.c',
  line: '885',
  routine: 'infer_arbiter_indexes'
}
 POST /api/logins 500 in 289ms (compile: 5ms, render: 284ms)
ata: mock users who have logged in
INSERT INTO user_logins (email, login_time) VALUES
  ('rob@launchpadphilly.org', NOW() - INTERVAL '2 days'),
  ('sanaa@launchpadphilly.org', NOW() - INTERVAL '1 day'),
  ('taheera@launchpadphilly.org', NOW() - INTERVAL '3 hours'),
  ('student1@example.com', NOW() - INTERVAL '5 hours'),
  ('student2@example.com', NOW() - INTERVAL '1 hour');
