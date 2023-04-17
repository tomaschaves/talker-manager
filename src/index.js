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
  turnToObject,
  validateRateQuery,
  validateDateQuery,
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

app.get('/talker/search', validateToken, validateRateQuery, validateDateQuery, async (req, res) => {
  const readTalkers = await fs.readFile(joinPath, 'utf-8');
  const responseTalkers = await JSON.parse(readTalkers);

  const { q, rate, date } = req.query;

  let filteredData = responseTalkers;
  if (q) {
    filteredData = responseTalkers
      .filter((talker) => talker.name.toLowerCase().includes(q.toLowerCase()));
  }
  if (rate) {
    filteredData = filteredData.filter((talker) => talker.talk.rate === Number(rate));
  }
  if (date) {
    filteredData = filteredData.filter((talker) => talker.talk.watchedAt === date);
  }

  return res.status(200).json(filteredData);
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

app.put('/talker/:id', validateToken, validateName, validateAge,
  validateTalk, validateWatched, validateRate, async (req, res) => {
    const readTalkers = await fs.readFile(joinPath, 'utf-8');
    const responseTalkers = await JSON.parse(readTalkers);
    const { id } = req.params;
    
    const { name, age, talk } = req.body;
    const hasId = responseTalkers.some((talker) => talker.id === Number(id));
    
    if (!hasId) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    const talkerIndex = responseTalkers.findIndex((talker) => talker.id === Number(id));
    
    responseTalkers[talkerIndex] = turnToObject(id, name, age, talk);

    await fs.writeFile(joinPath, JSON.stringify(responseTalkers));
    return res.status(200).json(turnToObject(id, name, age, talk));
  });

app.delete('/talker/:id', validateToken, async (req, res) => {
  const readTalkers = await fs.readFile(joinPath, 'utf-8');
  const responseTalkers = await JSON.parse(readTalkers);
  const { id } = req.params;

  const personToDelete = responseTalkers.some((talker) => talker.id === Number(id));
  if (!personToDelete) return { message: 'Pessoa não encontrada' };

  const newResponseTalkers = responseTalkers.filter((talker) => talker.id !== Number(id));

  await fs.writeFile(joinPath, JSON.stringify(newResponseTalkers));
  return res.status(204).end();
});
