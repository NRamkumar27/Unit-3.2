// Import required modules
const express = require('express');
const mongoose = require('mongoose');

// Create an Express application
const app = express();
const port = 3000; // Change this to your desired port

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('Using collection:', Player.collection.name);

  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define a Player model schema
const playerSchema = new mongoose.Schema({
  name: String,
  attacks: Number,
  blocks: Number,
  aces:Number,
  digs:Number
});

const Player = mongoose.model('Player', playerSchema,'Volley_ball');

// Middleware to parse JSON requests
app.use(express.json());

// Routes  

// Add a player
app.post('/players', async (req, res) => {
  try {
    const player = new Player(req.body);
    const savedPlayer = await player.save();
    res.json(savedPlayer);
  } catch (error) {
    res.status(500).json({ error: 'Could not add player' });
  }
});

// Update a player by ID
app.put('/players/:id', async (req, res) => {
  try {
    const updatedPlayer = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPlayer) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(updatedPlayer);
  } catch (error) {
    res.status(500).json({ error: 'Could not update player' });
  }
});

// Delete a player by ID
app.delete('/players/:id', async (req, res) => {
  try {
    const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
    if (!deletedPlayer) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(deletedPlayer);
  } catch (error) {
    res.status(500).json({ error: 'Could not delete player' });
  }
});

// Perform queries
app.post('/players/query', async (req, res) => {
  try {
    const query = req.body;
    const result = await Player.find(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Could not perform query' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
