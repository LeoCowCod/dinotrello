const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('¡Backend de DinoTrello funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});