const express = require('express');
const cors = require('cors'); // Importar cors
const app = express();
const port = 5000;

// Habilitar CORS para localhost:3000
app.use(cors({
  origin: 'http://localhost:3000', // Permitir solo este origen
}));

app.use(express.json());

// Datos en memoria (simulando una base de datos)
let boards = [
  {
    id: 1,
    title: "Tablero Dino",
    lists: [
      { id: 1, title: "Por hacer", cards: [{ id: 1, content: "Explorar fósiles" }] },
      { id: 2, title: "En progreso", cards: [{ id: 2, content: "Cazar presas" }] },
      { id: 3, title: "Hecho", cards: [] },
    ],
  },
];

app.get('/api/board', (req, res) => {
  res.json(boards[0]);
});

app.post('/api/lists/:listId/cards', (req, res) => {
  const listId = parseInt(req.params.listId);
  const { content } = req.body;
  const list = boards[0].lists.find((l) => l.id === listId);
  if (!list) return res.status(404).send('Lista no encontrada');
  const newCard = { id: Date.now(), content };
  list.cards.push(newCard);
  res.json(newCard);
});

app.put('/api/cards/:cardId/move', (req, res) => {
  const cardId = parseInt(req.params.cardId);
  const { fromListId, toListId } = req.body;
  const fromList = boards[0].lists.find((l) => l.id === fromListId);
  const toList = boards[0].lists.find((l) => l.id === toListId);
  if (!fromList || !toList) return res.status(404).send('Lista no encontrada');
  const cardIndex = fromList.cards.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return res.status(404).send('Tarjeta no encontrada');
  const [card] = fromList.cards.splice(cardIndex, 1);
  toList.cards.push(card);
  res.json(boards[0]);
});

app.listen(port, () => {
  console.log(`Backend corriendo en http://localhost:${port}`);
});