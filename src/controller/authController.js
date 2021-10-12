const express = require('express');
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');

const router = express.Router();

  // Função para gerar o Token JWT
function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

router.post('/register', async (req, res) => {
  const { email } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(400).send({ error: 'User already exists'});

    const user = await User.create(req.body);
    user.password = undefined;

    return res.status(201).send({
      user,
      token: generateToken({ id: user.id }),
    });
  } catch (err) {
    return res.status(400).send({ error: 'Registration failed'})
  }
});

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;

  // Consultando se usuario existe por email e senha
  const user = await User.findOne({ email }).select('+password');

  // Verifica se usuario existe
  if (!user)
    return res.status(400).send({ error: 'User not found'});

  // Compara a senha do usuario com a senha enviada
  if (!await bcrypt.compare(password, user.password))
    return res.status(400).send({ error: 'Invalid password' });

  // Para não mostrar a senha do usuario no retornod
  user.password = undefined;



  res.send({
    user,
    token: generateToken({ id: user.id }),
  });
});



module.exports = app => app.use('/auth', router);