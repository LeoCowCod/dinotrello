import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importar iconos
import Card from './Card';

const ItemType = 'CARD';

function List({ list, setBoard }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [, drop] = useDrop({
    accept: ItemType,
    drop: async (item) => {
      if (item.listId === list.id) return;
      await fetch(`http://localhost:5000/api/cards/${item.id}/move`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromListId: item.listId, toListId: list.id }),
      });
      const res = await fetch('http://localhost:5000/api/board');
      const updatedBoard = await res.json();
      setBoard(updatedBoard);
    },
  });

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

  const editList = async () => {
    const title = prompt('Nuevo título:', list.title);
    const color = prompt('Nuevo color (ej. #ffcccc):', list.color);
    if (!title && !color) return;
    await fetch(`http://localhost:5000/api/lists/${list.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title || list.title, color: color || list.color }),
    });
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((l) =>
        l.id === list.id ? { ...l, title: title || l.title, color: color || l.color } : l
      ),
    }));
  };

  const deleteList = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await fetch(`http://localhost:5000/api/lists/${list.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.filter((l) => l.id !== list.id),
    }));
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div ref={drop} className="list" style={{ backgroundColor: list.color }}>
      <div className="list-header">
        <h2>{list.title}</h2>
        <div className="list-actions">
          <FaEdit className="icon edit-icon" onClick={editList} />
          <FaTrash className="icon delete-icon" onClick={deleteList} />
        </div>
      </div>
      {list.cards.map((card) => (
        <Card key={card.id} card={card} listId={list.id} setBoard={setBoard} />
      ))}
      <button onClick={addCard}>+ Añadir tarjeta</button>
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <p>¿Eliminar esta lista?</p>
            <button onClick={confirmDelete}>Sí</button>
            <button onClick={cancelDelete}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default List;