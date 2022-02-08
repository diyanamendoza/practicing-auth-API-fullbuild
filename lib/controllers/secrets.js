const { Router } = require('express');
const Secret = require('../models/Secret');
const authenticate = require('../middleware/authenticate');

module.exports = Router().get('/', authenticate, async (req, res) => {
  const secrets = await Secret.getAll();
  res.send(secrets);
});
