const express = require('express');

const app = express();
app.use(express.json());
const fs = require('fs').promises;
const { join } = require('path');

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});


const path = '/talker.json'
const joinPath = join(__dirname, path);

app.get('/talker', async(req, res) => {
  const readTalkers = await fs.readFile(joinPath, 'utf-8');
  const responseTalkers = await JSON.parse(readTalkers);
  if (responseTalkers.length === 0) {
    return res.status(200).json([]);
  }

  return res.status(200).json(responseTalkers);
})



