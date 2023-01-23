const express = require('express');
const fs = require('fs').promises; 

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const promise = await fs.readFile('src/talker.json', 'utf-8');
  const data = JSON.parse(promise)
  res.status(HTTP_OK_STATUS).json(data);
})

app.listen(PORT, () => {
  console.log('Online');
});
//