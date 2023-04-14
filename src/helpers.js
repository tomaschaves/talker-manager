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

module.exports = { validateEmail, validatePassword };