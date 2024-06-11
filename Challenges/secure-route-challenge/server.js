const express = require('express');

const port = parseInt(process.env.PORT, 10) || 3000;

const app = express();

const auth = (req, res, next) => {
  console.log(req.headers);
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader) {
    const err = new Error('You are not authenticated!');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }

  const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0];
  const pass = auth[1];

  if (user === 'jbond' && pass === 'AstonMartin007') {
    return next();
  } else {
    const err = new Error('You are not authenticated!');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }
}

const secretsRouter = require('./routes/secretsRouter');

app.get('/', (req, res) => {
  console.log(req.headers);
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <html>
    <body>
      Hello Welcome Agent 64
    </body>
    </html>
  `);
});

app.use(auth);
app.use('/secrets', secretsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}/`);
});
