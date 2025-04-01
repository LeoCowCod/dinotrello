import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importar iconos

const ItemType = 'CARD';

function Card({ card, listId, setBoard }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: card.id, listId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const editCard = async () => {
    const content = prompt('Nuevo contenido:', card.content);
    if (!content) return;
    await fetch(`http://localhost:5000/api/cards/${card.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((l) =>
        l.id === listId
          ? { ...l, cards: l.cards.map((c) => (c.id === card.id ? { ...c, content } : c)) }
          : l
      ),
    }));
  };

  const deleteCard = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await fetch(`http://localhost:5000/api/cards/${card.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((l) =>
        l.id === listId ? { ...l, cards: l.cards.filter((c) => c.id !== card.id) } : l
      ),
    }));
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div ref={drag} className="card" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div className="card-content">{card.content}</div>
      <div className="card-actions">
        <FaEdit className="icon edit-icon" onClick={editCard} />
        <FaTrash className="icon delete-icon" onClick={deleteCard} />
      </div>
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <p>¿Eliminar esta tarjeta?</p>
            <button onClick={confirmDelete}>Sí</button>
            <button onClick={cancelDelete}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;