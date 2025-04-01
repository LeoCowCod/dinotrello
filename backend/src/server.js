const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

let boards = [
  {
    id: 1,
    title: "Tablero Dino",
    lists: [
      { id: 1, title: "Por hacer", color: "#ffcccc", cards: [{ id: 1, content: "Explorar fósiles" }] },
      { id: 2, title: "En progreso", color: "#ccffcc", cards: [{ id: 2, content: "Cazar presas" }] },
      { id: 3, title: "Hecho", color: "#cce5ff", cards: [] },
    ],
  },
];

// Obtener el tablero
app.get('/api/board', (req, res) => {
  res.json(boards[0]);
});

// Añadir una nueva lista
app.post('/api/lists', (req, res) => {
  const { title, color } = req.body;
  const newList = { id: Date.now(), title, color: color || "#f0f0f0", cards: [] };
  boards[0].lists.push(newList);
  res.json(newList);
});

// Editar una lista
app.put('/api/lists/:listId', (req, res) => {
  const listId = parseInt(req.params.listId);
  const { title, color } = req.body;
  const list = boards[0].lists.find((l) => l.id === listId);
  if (!list) return res.status(404).send('Lista no encontrada');
  list.title = title || list.title;
  list.color = color || list.color;
  res.json(list);
});

// Eliminar una lista
app.delete('/api/lists/:listId', (req, res) => {
  const listId = parseInt(req.params.listId);
  boards[0].lists = boards[0].lists.filter((l) => l.id !== listId);
  res.json(boards[0]);
});

// Añadir una tarjeta
app.post('/api/lists/:listId/cards', (req, res) => {
  const listId = parseInt(req.params.listId);
  const { content } = req.body;
  const list = boards[0].lists.find((l) => l.id === listId);
  if (!list) return res.status(404).send('Lista no encontrada');
  const newCard = { id: Date.now(), content };
  list.cards.push(newCard);
  res.json(newCard);
});

// Editar una tarjeta
app.put('/api/cards/:cardId', (req, res) => {
  const cardId = parseInt(req.params.cardId);
  const { content } = req.body;
  for (const list of boards[0].lists) {
    const card = list.cards.find((c) => c.id === cardId);
    if (card) {
      card.content = content;
      return res.json(card);
    }
  }
  res.status(404).send('Tarjeta no encontrada');
});

// Eliminar una tarjeta
app.delete('/api/cards/:cardId', (req, res) => {
  const cardId = parseInt(req.params.cardId);
  for (const list of boards[0].lists) {
    list.cards = list.cards.filter((c) => c.id !== cardId);
  }
  res.json(boards[0]);
});

// Mover una tarjeta entre listas
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