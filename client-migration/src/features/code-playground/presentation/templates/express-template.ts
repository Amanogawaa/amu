export const expressTemplate = {
  files: {
    "/server.js": `/**
 * Express.js Server
 * 
 * Main application entry point demonstrating:
 * - Express app setup
 * - Middleware configuration
 * - Route organization
 * - Error handling
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const itemsRouter = require('./routes/items');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Express.js API!',
    version: '1.0.0',
    endpoints: {
      items: '/api/items',
      users: '/api/users',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/items', itemsRouter);
app.use('/api/users', usersRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: \`Cannot \${req.method} \${req.path}\`
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});

module.exports = app;
`,
    "/routes/items.js": `/**
 * Items Router
 * 
 * Handles all item-related endpoints:
 * - GET /api/items - List all items
 * - GET /api/items/:id - Get single item
 * - POST /api/items - Create new item
 * - PUT /api/items/:id - Update item
 * - DELETE /api/items/:id - Delete item
 */

const express = require('express');
const router = express.Router();

// In-memory database (replace with real DB in production)
let items = [
  { id: 1, name: 'Item 1', description: 'First item', price: 10.99 },
  { id: 2, name: 'Item 2', description: 'Second item', price: 20.99 }
];
let nextId = 3;

// GET all items
router.get('/', (req, res) => {
  const { search, minPrice, maxPrice } = req.query;
  
  let filteredItems = items;
  
  if (search) {
    filteredItems = filteredItems.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (minPrice) {
    filteredItems = filteredItems.filter(item => item.price >= parseFloat(minPrice));
  }
  
  if (maxPrice) {
    filteredItems = filteredItems.filter(item => item.price <= parseFloat(maxPrice));
  }
  
  res.json({
    count: filteredItems.length,
    items: filteredItems
  });
});

// GET single item
router.get('/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  
  if (!item) {
    return res.status(404).json({
      error: 'Not Found',
      message: \`Item with id \${req.params.id} not found\`
    });
  }
  
  res.json(item);
});

// POST new item
router.post('/', (req, res) => {
  const { name, description, price } = req.body;
  
  // Validation
  if (!name || !price) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Name and price are required'
    });
  }
  
  const newItem = {
    id: nextId++,
    name,
    description: description || '',
    price: parseFloat(price)
  };
  
  items.push(newItem);
  
  res.status(201).json(newItem);
});

// PUT update item
router.put('/:id', (req, res) => {
  const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
  
  if (itemIndex === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: \`Item with id \${req.params.id} not found\`
    });
  }
  
  const { name, description, price } = req.body;
  
  items[itemIndex] = {
    ...items[itemIndex],
    ...(name && { name }),
    ...(description && { description }),
    ...(price && { price: parseFloat(price) })
  };
  
  res.json(items[itemIndex]);
});

// DELETE item
router.delete('/:id', (req, res) => {
  const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
  
  if (itemIndex === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: \`Item with id \${req.params.id} not found\`
    });
  }
  
  items.splice(itemIndex, 1);
  
  res.status(204).send();
});

module.exports = router;
`,
    "/routes/users.js": `/**
 * Users Router
 * 
 * Example user management endpoints
 */

const express = require('express');
const router = express.Router();

// Sample users
const users = [
  { id: 1, username: 'john_doe', email: 'john@example.com', role: 'user' },
  { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'admin' }
];

// GET all users
router.get('/', (req, res) => {
  res.json({
    count: users.length,
    users: users.map(({ id, username, email, role }) => ({
      id,
      username,
      email,
      role
    }))
  });
});

// GET single user
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({
      error: 'Not Found',
      message: \`User with id \${req.params.id} not found\`
    });
  }
  
  res.json(user);
});

module.exports = router;
`,
    "/middleware/auth.js": `/**
 * Authentication Middleware
 * 
 * Example middleware for protecting routes
 */

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No token provided'
    });
  }
  
  // In production, verify JWT token here
  // For educational purposes, we'll just check if token exists
  
  req.user = { id: 1, username: 'john_doe' }; // Mock user
  next();
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

module.exports = { authenticate, authorize };
`,
    "/package.json": `{
  "name": "express-api",
  "version": "1.0.0",
  "description": "Express.js REST API example",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
`,
    "/README.md": `# Express.js REST API

This is an educational Express.js project demonstrating:
- Express app setup and configuration
- RESTful API design
- Middleware usage
- Route organization
- Error handling
- Request validation

## Project Structure

\`\`\`
project/
├── server.js            # Main application file
├── routes/              # Route handlers
│   ├── items.js         # Item endpoints
│   └── users.js         # User endpoints
├── middleware/          # Custom middleware
│   └── auth.js          # Authentication middleware
└── package.json         # Dependencies
\`\`\`

## To Run Locally

\`\`\`bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Or start production server
npm start
\`\`\`

## API Endpoints

### Items
- \`GET /api/items\` - List all items
  - Query params: ?search=name&minPrice=10&maxPrice=100
- \`GET /api/items/:id\` - Get single item
- \`POST /api/items\` - Create new item
- \`PUT /api/items/:id\` - Update item
- \`DELETE /api/items/:id\` - Delete item

### Users
- \`GET /api/users\` - List all users
- \`GET /api/users/:id\` - Get single user

### Other
- \`GET /\` - API information
- \`GET /health\` - Health check

## Example Requests

\`\`\`bash
# Get all items
curl http://localhost:3000/api/items

# Create new item
curl -X POST http://localhost:3000/api/items \\
  -H "Content-Type: application/json" \\
  -d '{"name":"New Item","description":"Test","price":29.99}'

# Update item
curl -X PUT http://localhost:3000/api/items/1 \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Updated Item","price":39.99}'
\`\`\`
`,
  },
  dependencies: ["express", "cors", "morgan"],
  description:
    "Complete Express.js REST API with routing, middleware, and error handling",
};

export const expressExerciseStarter = `// Express.js Exercise: Create a Blog API

// TODO: Complete the following tasks:
// 1. Create routes for blog posts (GET, POST, PUT, DELETE)
// 2. Add middleware for request validation
// 3. Implement pagination for GET /posts
// 4. Add error handling

const express = require('express');
const app = express();

app.use(express.json());

// Define your routes and middleware below

`;
