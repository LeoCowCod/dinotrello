import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'CARD';

function Card({ card, listId, setBoard }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: card.id, listId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: async (item) => {
      if (item.listId === listId) return;

      await fetch(`http://localhost:5000/api/cards/${item.id}/move`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromListId: item.listId, toListId: listId }),
      });

      const res = await fetch('http://localhost:5000/api/board');
      const updatedBoard = await res.json();
      setBoard(updatedBoard);
      item.listId = listId; // Actualizar localmente
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="card"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {card.content}
    </div>
  );
}

export default Card;