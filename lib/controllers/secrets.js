const { Router } = require('express');
const Secret = require('../models/Secret');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .get('/', authenticate, async (req, res) => {
    const secrets = await Secret.getAll();
    res.send(secrets);
  })

  .post('/', authenticate, async (req, res) => {
    try {
      const { title, description } = req.body;
      const secret = await Secret.insert({
        title,
        description,
      });
      res.send(secret);
    } catch (error) {
      next(error);
    }
  });
