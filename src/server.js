//- /src/server.js
import express from 'express';
import sql from 'sqlite3';

const sqlite3 = sql.verbose();

// Create an in-memory table to use
const db = new sqlite3.Database(':memory:');

// Create the table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment TEXT NOT NULL
)`);

const app = express();
app.use(express.static('public'));
app.set('views', 'views');
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Ensure JSON middleware is used

// Fetch and pass the last 5 comments to the main page
app.get('/', function (req, res) {
  console.log('GET called for main page');
  db.all('SELECT id, comment FROM comments ORDER BY id DESC LIMIT 5', (err, rows) => {
    if (err) {
      console.error('Error fetching comments:', err);
      res.status(500).send('Failed to retrieve comments');
    } else {
      const comments = rows || []; // Ensure comments is always an array
      res.render('index', { comments }); // Pass comments array to index.pug
    }
  });
});

// Render student pages
app.get('/student1', function (req, res) {
  console.log('GET student 1 called');
  res.render('student1');
});

app.get('/student2', function (req, res) {
  console.log('GET student 2 called');
  res.render('student2');
});

app.get('/student3', function (req, res) {
  console.log('GET student 3 called');
  res.render('student3');
});

// Fetch all comments for student3Comments page
app.get('/student3Comments', function (req, res) {
  db.all('SELECT id, comment FROM comments', (err, rows) => {
    if (err) {
      console.error('Error fetching comments:', err);
      res.status(500).send('Failed to retrieve comments');
    } else {
      const comments = rows || []; // Ensure comments is always an array
      res.render('student3Comments', { comments }); // Pass comments array to student3Comments.pug
    }
  });
});

// Add a new comment
app.post('/add', (req, res) => {
  const commentItem = req.body.commentItem;
  if (!commentItem.trim()) {
    res.status(400).json({ success: false, error: 'Comment cannot be empty' });
    return;
  }
  const stmt = db.prepare('INSERT INTO comments (comment) VALUES (?)');
  stmt.run(commentItem, function (err) {
    if (err) {
      console.error('Error adding comment:', err);
      res.status(500).json({ success: false, error: 'Failed to add comment' });
    } else {
      res.redirect('/student3Comments');
    }
  });
  stmt.finalize();
});

// Delete a comment by ID
app.post('/delete', (req, res) => {
  const id = req.body.id;
  db.run('DELETE FROM comments WHERE id = ?', id, function (err) {
    if (err) {
      console.error('Error deleting comment:', err);
      res.status(500).json({ success: false, error: 'Failed to delete comment' });
    } else {
      res.json({ success: true });
    }
  });
});

// Delete all comments
app.post('/delete/all', (req, res) => {
  db.run('DELETE FROM comments', function (err) {
    if (err) {
      console.error('Error deleting all comments:', err);
      res.status(500).json({ success: false, error: 'Failed to delete all comments' });
    } else {
      res.json({ success: true });
    }
  });
});

// Start the web server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
