const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }));

app.use(express.json());

// Database pool configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'tmp-service.postgres.database.azure.com',
  user: process.env.DB_USER || 'postgres@tmp-service',
  password: process.env.DB_PASSWORD || '1VersionDigitale-net0',
  database: process.env.DB_NAME || 'postgres',
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false }
});

// Endpoint to save data
app.post('/saveData', async (req, res) => {
  const data = req.body;

  try {
    const query = 'INSERT INTO extracted_data.data_entries (data) VALUES ($1)';
    await pool.query(query, [data]);
    res.status(200).send("Data saved to database successfully!");
  } catch (error) {
    console.error("Error saving data to the database:", error);
    res.status(500).send("Error saving data to the database.");
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send("Server is healthy!");
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
