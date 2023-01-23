const express = require('express');
const fs = require('fs').promises; 

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const HTTP_NOT_FOUND = 404;
const NOT_FOUND_MESSAGE = {
  message: 'Pessoa palestrante não encontrada',
};

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

app.listen(PORT, () => {
  console.log('Online');
});
//