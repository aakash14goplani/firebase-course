const express = require('express');

export const createUserApp = express();

createUserApp.post('/', async (req, res) => {
  try {
    res.status(200).json({ message: `User created successfully` });
  } catch (error) {
    res.status(500).json({ message: `Could not create user ${error}` });
  }

  // res.send(user);
});
