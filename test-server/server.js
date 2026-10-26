const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'fixtures')));

// Login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'fixtures', 'login.html'));
});

// Handle login
app.post('/login', (req, res) => {
  const { 'user-name': username, password } = req.body;
  if (username === 'standard_user' && password === 'secret_sauce') {
    res.redirect('/inventory.html');
  } else {
    res.sendFile(path.join(__dirname, 'fixtures', 'login.html'));
  }
});

// Inventory page
app.get('/inventory.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'fixtures', 'inventory.html'));
});

// Cart page
app.get('/cart.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'fixtures', 'cart.html'));
});

// Checkout pages
app.get('/checkout-step-one.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'fixtures', 'checkout-info.html'));
});

app.get('/checkout-step-two.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'fixtures', 'checkout-overview.html'));
});

app.get('/checkout-complete.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'fixtures', 'checkout-complete.html'));
});

// API mock endpoints
app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]);
});

app.get('/api/users/:id', (req, res) => {
  res.json({ id: parseInt(req.params.id), name: 'User ' + req.params.id });
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});