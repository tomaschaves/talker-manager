const validateEmail = (req, res, next) => {
  const { email } = req.body;
  const regexEmail = /\S+@\S+\.\S+/;
  const validateEmailRegex = regexEmail.test(email);

  if (email === undefined) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }

  if (!validateEmailRegex) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }

  return next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (password === undefined) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }

  return next();
};

const validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  
  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  if (!(authorization.length === 16 && typeof authorization === 'string')) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;
  
  if (!name || name.length === 0) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }

  if (typeof age !== 'number' || age < 18 || !Number.isInteger(age)) {
    const errorM = { message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' };
    return res.status(400).json(errorM);
  }
  next();
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  next();
};

const validateWatched = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  if (watchedAt === undefined || watchedAt.length === 0) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  const dateType = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;

  if (!dateType.test(watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  next();
};

const validateRate = (req, res, next) => {
  const { talk: { rate } } = req.body;
  
  if (rate === undefined) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  
  if (rate <= 0 || rate > 5 || !Number.isInteger(rate)) {
    const text = 'O campo "rate" deve ser um número inteiro entre 1 e 5';
    return res.status(400).json({ message: text });
  }
  // || typeof rate !== 'number'  ver se vamos precisar dessa linha no if abaixo
  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatched,
  validateRate };