const express = require('express');
const fs = require('fs').promises; 

const app = express();
app.use(express.json());

const PORT = '3000';
const HTTP_OK_STATUS = 200;
const HTTP_NOT_FOUND = 404;
const BAD_REQUEST = 400;

const NOT_FOUND_MESSAGE = {
  message: 'Pessoa palestrante não encontrada',
};

const EMPTY_EMAIL_MESSAGE = {
  message: 'O campo "email" é obrigatório',
};

const EMAIL_VALIDATION_MESSAGE = {
  message: 'O "email" deve ter o formato "email@email.com"',
};

const EMPTY_PASSWORD_MESSAGE = {
  message: 'O campo "password" é obrigatório',
};

const SHORT_PASSWORD_MESSAGE = {
  message: 'O "password" deve ter pelo menos 6 caracteres',
};

const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const getToken = () => (+new Date() * Math.random()).toString(10).substring(0, 16);
// Fonte do Token = https://stackoverflow.com/questions/20728783/shortest-code-to-get-random-string-of-numbers-and-letters 

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const promise = await fs.readFile('src/talker.json', 'utf-8');
  const data = JSON.parse(promise);
  res.status(HTTP_OK_STATUS).json(data);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const promise = await fs.readFile('src/talker.json', 'utf-8');
  const data = JSON.parse(promise);
  const findId = data.find((e) => Number(e.id) === Number(id));
  if (findId) return res.status(HTTP_OK_STATUS).json(findId);
  return res.status(HTTP_NOT_FOUND).json(NOT_FOUND_MESSAGE);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const token = getToken();
  // const emailValidation = email.value.match(regex);
  if (!email) {
    return res.status(BAD_REQUEST).json(EMPTY_EMAIL_MESSAGE);
  }
  if (!password) {
    return res.status(BAD_REQUEST).json(EMPTY_PASSWORD_MESSAGE);
  }
  if (password.length < 6) {
    return res.status(BAD_REQUEST).json(SHORT_PASSWORD_MESSAGE);
  }
  if (!(email.toLowerCase().match(regex))) {
    return res.status(BAD_REQUEST).json(EMAIL_VALIDATION_MESSAGE);
  }
  res.status(HTTP_OK_STATUS).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});
//