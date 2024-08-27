const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

// Cadastro de Usuário
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ error: 'Erro ao cadastrar usuário' });
  }
};

// Login de Usuário
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).send({ error: 'Usuário não encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ error: 'Senha inválida' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.send({ token });
  } catch (error) {
    res.status(400).send({ error: 'Erro ao fazer login' });
  }
};

// Listagem de Usuários
exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt'] });
    res.send(users);
  } catch (error) {
    res.status(400).send({ error: 'Erro ao listar usuários' });
  }
};

// Atualização de Usuário
exports.updateUser = async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).send({ error: 'Usuário não encontrado' });

    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();

    res.send(user);
  } catch (error) {
    res.status(400).send({ error: 'Erro ao atualizar usuário' });
  }
};

// Deleção de Usuário
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).send({ error: 'Usuário não encontrado' });

    await user.destroy();
    res.send({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(400).send({ error: 'Erro ao deletar usuário' });
  }
};
