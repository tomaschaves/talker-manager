const express = require('express');

const app = express();
app.use(express.json());
const fs = require('fs').promises;
const { join } = require('path');

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

const crypto = require('crypto');
const { 
  validateEmail,
  validatePassword,
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatched,
  validateRate,
} = require('./helpers');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

const path = '/talker.json';
const joinPath = join(__dirname, path);

app.get('/talker', async (_req, res) => {
  const readTalkers = await fs.readFile(joinPath, 'utf-8');
  const responseTalkers = await JSON.parse(readTalkers);
  if (responseTalkers.length === 0) {
    return res.status(200).json([]);
  }
  
  return res.status(200).json(responseTalkers);
});

app.get('/talker/:id', async (req, res) => {
  const readTalkers = await fs.readFile(joinPath, 'utf-8');
  const responseTalkers = await JSON.parse(readTalkers);
  const { id } = req.params;

  const searchPerson = responseTalkers.find((talker) => talker.id === +id);

  if (!searchPerson) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  
  return res.status(200).json(searchPerson);
});

app.post('/login', validateEmail, validatePassword, async (_req, res) => {
  const token = crypto.randomBytes(16).toString('base64').slice(0, 16);
  const tokenResponse = { token };

  return res.status(200).json(tokenResponse);
});

app.post('/talker', validateToken, validateName, validateAge,
  validateTalk, validateWatched, validateRate, async (req, res) => {
  const readTalkers = await fs.readFile(joinPath, 'utf-8');
  const responseTalkers = await JSON.parse(readTalkers);
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const id = responseTalkers[responseTalkers.length - 1].id + 1;
  const newPerson = {
    id,
    name,
    age,
    talk: {
      watchedAt,
      rate,
    },
  };
  responseTalkers.push(newPerson);
  await fs.writeFile(joinPath, JSON.stringify(responseTalkers));

  return res.status(201).json(newPerson);
});
