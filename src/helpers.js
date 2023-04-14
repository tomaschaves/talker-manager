const validateEmail = (req, res, next) => {
  const { email, password } = req.body;
  const regexEmail = /\S+@\S+\.\S+/;
  const validateEmail = regexEmail.test(email);


  // o middleware tem acesso à requisição, então não preciso passar parâmetro. o middleware está antes de chegarmos até à função/endpoint de login, então ele não precisa constar no corpo do endpoint em si. colocando next(), ele vai para o próximo, caso houver, sendo especificado logo em seguida a ele na primeira linha. export e importo normalmente como uma função
  if (email === undefined) {
    return res.status(400).json({ message: 'O campo \"email\" é obrigatório' });
  }

  if (!validateEmail) {
    return res.status(400).json({ message: 'O \"email\" deve ter o formato \"email@email.com\"' });
  }
  
  if (password === undefined) {
    return res.status(400).json({ message: 'O campo \"password\" é obrigatório' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'O \"password\" deve ter pelo menos 6 caracteres' });
  }
  return next();
}

module.exports = { validateEmail };