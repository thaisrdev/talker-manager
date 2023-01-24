const express = require('express');
const fs = require('fs').promises; 

const app = express();
app.use(express.json());

const PORT = '3000';
const HTTP_OK_STATUS = 200;
const HTTP_CREATED = 201;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const HTTP_NOT_FOUND = 404;

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

//

const TOKEN_NOT_FOUND = {
  message: 'Token não encontrado',
};

const INVALID_TOKEN = {
  message: 'Token inválido',
};

const NAME_EMPTY = {
  message: 'O campo "name" é obrigatório',
};

const NAME_MIN = {
  message: 'O "name" deve ter pelo menos 3 caracteres',
};

const AGE_EMPTY = {
  message: 'O campo "age" é obrigatório',
};

const AGE_MIN = {
  message: 'A pessoa palestrante deve ser maior de idade',
};

const TALK_EMPTY = {
  message: 'O campo "talk" é obrigatório',
};

const DATE_EMPTY = {
  message: 'O campo "watchedAt" é obrigatório',
};

const INVALID_DATE = {
  message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
};

const RATE_EMPTY = {
  message: 'O campo "rate" é obrigatório',
};

const INVALID_RATE = {
  message: 'O campo "rate" deve ser um inteiro de 1 à 5',
};

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexDate = /^(0?[1-9]|[12][0-9]|3[01])[/](0?[1-9]|1[012])[/]\d{4}$/;
const getToken = () => (+new Date() * Math.random()).toString(10).substring(0, 16);
// Fonte do Token = https://stackoverflow.com/questions/20728783/shortest-code-to-get-random-string-of-numbers-and-letters 
// Fonte Regex = https://stackoverflow.com/questions/5465375/javascript-date-regex-dd-mm-yyyy

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
  // const emailValidation = email.value.match(regexEmail);
  if (!email) {
    return res.status(BAD_REQUEST).json(EMPTY_EMAIL_MESSAGE);
  }
  if (!password) {
    return res.status(BAD_REQUEST).json(EMPTY_PASSWORD_MESSAGE);
  }
  if (password.length < 6) {
    return res.status(BAD_REQUEST).json(SHORT_PASSWORD_MESSAGE);
  }
  if (!(email.toLowerCase().match(regexEmail))) {
    return res.status(BAD_REQUEST).json(EMAIL_VALIDATION_MESSAGE);
  }
  res.status(HTTP_OK_STATUS).json({ token });
});

//

//

const validateToken = (token, res) => {
  if (!token) return res.status(UNAUTHORIZED).json(TOKEN_NOT_FOUND);
  if (typeof token !== 'string') return res.status(UNAUTHORIZED).json(INVALID_TOKEN);
  if (token.length !== 16) return res.status(UNAUTHORIZED).json(INVALID_TOKEN);
};

const validateName = (name, res) => {
  if (!name) return res.status(BAD_REQUEST).json(NAME_EMPTY);
  if (name.length < 3) return res.status(BAD_REQUEST).json(NAME_MIN);
};

const validateAge = (age, res) => {
  if (!age) return res.status(BAD_REQUEST).json(AGE_EMPTY);
  if (age < 18) res.status(BAD_REQUEST).json(AGE_MIN);
};

const validateTalk = (talk, res) => {
 if (!talk) return res.status(BAD_REQUEST).json(TALK_EMPTY);
 const { watchedAt } = talk;
 if (!watchedAt) return res.status(BAD_REQUEST).json(DATE_EMPTY);
 const formatDate = watchedAt.match(regexDate);
 if (!formatDate) return res.status(BAD_REQUEST).json(INVALID_DATE);
};

const validateRate = (talk, res) => {
  const { rate } = talk;
  if (!rate) return res.status(BAD_REQUEST).json(RATE_EMPTY);
  if (rate < 1 || rate > 5) return res.status(BAD_REQUEST).json(INVALID_RATE);
  if (!Number.isInteger(rate)) return res.status(BAD_REQUEST).json(INVALID_RATE);
};

app.post('/talker', async (req, res) => {
  const { headers: { authorization } } = req;
  const { body: { name, age, talk } } = req;
  try {
  validateToken(authorization, res);
  validateName(name, res);
  validateAge(age, res);
  validateTalk(talk, res);
  validateRate(talk, res);
  const data = await fs.readFile('src/talker.json', 'utf-8');
  const talkers = JSON.parse(data);
  const newData = [...talkers, { name, id: talkers.length + 1, age, talk }];
  await fs.writeFile('src/talker.json', JSON.stringify(newData));
  return res.status(HTTP_CREATED).json({ name, id: talkers.length + 1, age, talk });
  } catch (error) {
    console.error(error);
  }
});

// app.delete('/talker/:id', async() => {
// });

app.listen(PORT, () => {
  console.log('Online');
});
//