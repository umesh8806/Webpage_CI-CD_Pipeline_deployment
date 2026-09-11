// server/api.js — Portfolio CMS API (production-grade)
import express    from 'express';
import cors       from 'cors';
import { readFile, writeFile } from 'fs/promises';
import path       from 'path';
import { fileURLToPath } from 'url';

const __filename   = fileURLToPath(import.meta.url);
const __dirname    = path.dirname(__filename);
const ROOT         = path.resolve(__dirname, '..');
const CONTENT_PATH = path.join(ROOT, 'data', 'content.json');
const AUTH_TOKEN   = process.env.ADMIN_TOKEN || 'portfolio_admin_2026';
const PORT         = parseInt(process.env.PORT || '4000', 10);

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(express.static(ROOT));           // serve public site on same origin

// ── helpers ───────────────────────────────────────────────────────────────
async function readContent() {
  return JSON.parse(await readFile(CONTENT_PATH, 'utf8'));
}
async function writeContent(data) {
  await writeFile(CONTENT_PATH, JSON.stringify(data, null, 2), 'utf8');
}
function auth(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (token !== AUTH_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// ── routes ────────────────────────────────────────────────────────────────
// Public — read all content
app.get('/api/content', async (req, res) => {
  try { res.json(await readContent()); }
  catch (e) { console.error(e); res.status(500).json({ error: 'Failed to load content' }); }
});

// Protected — replace entire content
app.post('/api/content', auth, async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object')
      return res.status(400).json({ error: 'Invalid body' });
    await writeContent(req.body);
    res.json({ status: 'ok', message: 'Content saved' });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Save failed' }); }
});

// Protected — patch a single section
app.patch('/api/content/:section', auth, async (req, res) => {
  try {
    const { section } = req.params;
    const data = await readContent();
    if (!(section in data))
      return res.status(404).json({ error: `Section not found: ${section}` });
    data[section] = { ...data[section], ...req.body };
    await writeContent(data);
    res.json({ status: 'ok', section, data: data[section] });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Update failed' }); }
});

// Protected — verify token
app.get('/api/verify', auth, (_req, res) => res.json({ status: 'authenticated' }));

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));

app.listen(PORT, () => {
  console.log('\n🚀  Portfolio CMS API');
  console.log(`   Site  → http://localhost:${PORT}`);
  console.log(`   Admin → http://localhost:${PORT}/admin/login.html`);
  console.log(`   Token → ${AUTH_TOKEN}\n`);
});
