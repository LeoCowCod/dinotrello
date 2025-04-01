import React from 'react';
import Card from './Card';

function List({ list, setBoard }) {
  const addCard = async () => {
    const content = prompt('Contenido de la tarjeta:');
    if (!content) return;

    const res = await fetch(`http://localhost:5000/api/lists/${list.id}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const newCard = await res.json();

    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((l) =>
        l.id === list.id ? { ...l, cards: [...l.cards, newCard] } : l
      ),
    }));
  };

  return (
    <div className="list">
      <h2>{list.title}</h2>
      {list.cards.map((card) => (
        <Card key={card.id} card={card} listId={list.id} setBoard={setBoard} />
      ))}
      <button onClick={addCard}>+ Añadir tarjeta</button>
    </div>
  );
}

export default List;