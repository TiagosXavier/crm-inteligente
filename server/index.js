import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database file path (JSON file for simplicity)
const DB_DIR = join(__dirname, 'db');
const DB_FILE = join(DB_DIR, 'database.json');

// Ensure database directory and file exist
async function initDatabase() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });

    try {
      await fs.access(DB_FILE);
    } catch {
      // Create initial database structure
      const initialData = {
        contacts: [],
        conversations: [],
        tasks: [],
        users: [],
        templates: []
      };
      await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
      console.log('📦 Database initialized');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Read database
async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { contacts: [], conversations: [], tasks: [], users: [], templates: [] };
  }
}

// Write database
async function writeDB(data) {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
    throw error;
  }
}

// Generate ID
function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ============================================================================
// CONTACTS ROUTES
// ============================================================================

// List contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const db = await readDB();
    const { sort = '-created_date' } = req.query;

    let contacts = [...db.contacts];

    // Simple sort
    if (sort) {
      const [direction, field] = sort.startsWith('-')
        ? ['desc', sort.slice(1)]
        : ['asc', sort];

      contacts.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        if (direction === 'desc') {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      });
    }

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get contact by ID
app.get('/api/contacts/:id', async (req, res) => {
  try {
    const db = await readDB();
    const contact = db.contacts.find(c => c.id === req.params.id);

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create contact
app.post('/api/contacts', async (req, res) => {
  try {
    const db = await readDB();
    const now = new Date().toISOString();

    const newContact = {
      id: generateId(),
      ...req.body,
      created_date: now,
      updated_date: now,
    };

    db.contacts.push(newContact);
    await writeDB(db);

    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update contact
app.put('/api/contacts/:id', async (req, res) => {
  try {
    const db = await readDB();
    const index = db.contacts.findIndex(c => c.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    db.contacts[index] = {
      ...db.contacts[index],
      ...req.body,
      updated_date: new Date().toISOString(),
    };

    await writeDB(db);
    res.json(db.contacts[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const db = await readDB();
    const index = db.contacts.findIndex(c => c.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const deleted = db.contacts.splice(index, 1)[0];
    await writeDB(db);

    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// CONVERSATIONS ROUTES
// ============================================================================

app.get('/api/conversations', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/conversations', async (req, res) => {
  try {
    const db = await readDB();
    const newConversation = {
      id: generateId(),
      ...req.body,
      created_date: new Date().toISOString(),
    };
    db.conversations.push(newConversation);
    await writeDB(db);
    res.status(201).json(newConversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// TASKS ROUTES
// ============================================================================

app.get('/api/tasks', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const db = await readDB();
    const newTask = {
      id: generateId(),
      ...req.body,
      created_date: new Date().toISOString(),
    };
    db.tasks.push(newTask);
    await writeDB(db);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const db = await readDB();
    const index = db.tasks.findIndex(t => t.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    db.tasks[index] = {
      ...db.tasks[index],
      ...req.body,
      updated_date: new Date().toISOString(),
    };

    await writeDB(db);
    res.json(db.tasks[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const db = await readDB();
    const index = db.tasks.findIndex(t => t.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const deleted = db.tasks.splice(index, 1)[0];
    await writeDB(db);
    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// USERS ROUTES
// ============================================================================

app.get('/api/users', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// TEMPLATES ROUTES
// ============================================================================

app.get('/api/templates', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/templates', async (req, res) => {
  try {
    const db = await readDB();
    const newTemplate = {
      id: generateId(),
      ...req.body,
      created_date: new Date().toISOString(),
    };
    db.templates.push(newTemplate);
    await writeDB(db);
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// SEED ROUTE - Initialize with mock data
// ============================================================================

app.post('/api/seed', async (req, res) => {
  try {
    const db = await readDB();

    // Only seed if database is empty
    if (db.contacts.length > 0) {
      return res.json({ message: 'Database already has data', count: db.contacts.length });
    }

    // Use the mock data from request body or generate it
    if (req.body.contacts) {
      db.contacts = req.body.contacts;
    }
    if (req.body.conversations) {
      db.conversations = req.body.conversations;
    }
    if (req.body.tasks) {
      db.tasks = req.body.tasks;
    }
    if (req.body.users) {
      db.users = req.body.users;
    }
    if (req.body.templates) {
      db.templates = req.body.templates;
    }

    await writeDB(db);

    res.json({
      message: 'Database seeded successfully',
      counts: {
        contacts: db.contacts.length,
        conversations: db.conversations.length,
        tasks: db.tasks.length,
        users: db.users.length,
        templates: db.templates.length,
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📦 Database: ${DB_FILE}`);
    console.log(`✅ API ready at http://localhost:${PORT}/api`);
  });
});
