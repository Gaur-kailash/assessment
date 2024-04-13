const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'notes-db'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Routes
// Get all notes
app.get('/api/notes', (req, res) => {
  connection.query('SELECT * FROM notes', (err, results) => {
    if (err) {
      console.error('Error fetching notes: ', err);
      res.status(500).json({ error: 'Error fetching notes' });
      return;
    }
    res.json(results);
  });
});

// Add a new note
app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: 'Title and content are required' });
    return;
  }
  connection.query('INSERT INTO notes (title,content) VALUES (?,?)',[title,content], (err, result) => {
    if (err) {
      console.error('Error adding note: ', err);
      res.status(500).json({ error: 'Error adding note' });
      return;
    }
    res.status(201).json({ message: 'Note added successfully',id : result.id});
  });
});

// Delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM notes WHERE id = ?', [id],(err, result) => {
    if (err) {
      console.error('Error deleting note: ', err);
      res.status(500).json({ error: 'Error deleting note' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }
    res.json({ message: 'Note deleted successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
