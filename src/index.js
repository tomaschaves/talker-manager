const express = require('express');

const app = express();
app.use(express.json());
const fs = require('fs').promises;
const { join } = require('path');

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

const crypto = require('crypto');

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

app.get('/talker/:id', async(req, res) => {
  const readTalkers = await fs.readFile(joinPath, 'utf-8');
  const responseTalkers = await JSON.parse(readTalkers);
  const { id } = req.params;

  const searchPerson = responseTalkers.find((talker) => talker.id === +id);

  if (!searchPerson) {
    return res.status(404).json({ "message": "Pessoa palestrante não encontrada" });
  }
  
  return res.status(200).json(searchPerson);
})


app.post('/login', /* middleWareDeEmail,  */ async(req, res) => {
  const readTalkers = await fs.readFile(joinPath, 'utf-8');
  const responseTalkers = await JSON.parse(readTalkers);
  const { email, password } = req.body;
  


  const token = crypto.randomBytes(16).toString('base64').slice(0, 16);
  
  const tokenResponse = { "token": token }

  return res.status(200).json(tokenResponse);
  
  // const regexEmail = /\S+@\S+\.\S+/;
  // const validateEmail = regexEmail.test(email);
  // const emailLength = email.length > 0;
  // const passwordLength = password.length >= 6;

  // o middleware tem acesso à requisição, então não preciso passar parâmetro. o middleware está antes de chegarmos até à função/endpoint de login, então ele não precisa constar no corpo do endpoint em si. colocando next(), ele vai para o próximo, caso houver, sendo especificado logo em seguida a ele na primeira linha. export e importo normalmente como uma função
  
  // console.log(validateEmail && emailLength && passwordLength);


  // if(email.length > )


})


