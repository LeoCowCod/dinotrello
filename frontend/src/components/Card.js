import React, { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ItemType = 'CARD';

function Card({ card, listId, index, moveCardInList, setBoard }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false); // Nuevo estado para mostrar detalles
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item) {
      if (item.listId !== listId) return;
      if (item.index === index) return;
      moveCardInList(item.index, index);
      item.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: card.id, listId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const editCard = async () => {
    const content = prompt('Nuevo contenido:', card.content);
    const description = prompt('Nueva descripción:', card.description || '');
    const dueDate = prompt('Fecha de vencimiento (YYYY-MM-DD):', card.dueDate || '');
    const tagsInput = prompt('Etiquetas (separadas por coma, ej. "Urgente,#ff0000"):', card.tags ? card.tags.map(t => `${t.name},${t.color}`).join(',') : '');
    const tags = tagsInput
      ? tagsInput.split(',').reduce((acc, part, i, arr) => {
          if (i % 2 === 0 && arr[i + 1]) acc.push({ name: part.trim(), color: arr[i + 1].trim() });
          return acc;
        }, [])
      : card.tags || [];
    if (!content && description === null && dueDate === null && tagsInput === null) return;
    await fetch(`http://localhost:5000/api/cards/${card.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content || card.content, description, dueDate, tags }),
    });
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((l) =>
        l.id === listId
          ? {
              ...l,
              cards: l.cards.map((c) =>
                c.id === card.id ? { ...c, content: content || c.content, description, dueDate, tags } : c
              ),
            }
          : l
      ),
    }));
  };

  const deleteCard = () => setShowDeleteModal(true);

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

  const cancelDelete = () => setShowDeleteModal(false);

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

  const toggleDetails = () => setShowDetails(!showDetails); // Función para togglear detalles

  return (
    <div
      ref={ref}
      className={`card ${isOverdue ? 'overdue' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={toggleDetails} // Mostrar/ocultar detalles al hacer clic
    >
      <div className="card-content">
        <div>{card.content}</div>
        {showDetails && (
          <div className="card-details">
            {card.description && <p className="card-description">{card.description}</p>}
            {card.dueDate && <p className="card-due-date">Vence: {card.dueDate}</p>}
            {card.tags && card.tags.length > 0 && (
              <div className="card-tags">
                {card.tags.map((tag, idx) => (
                  <span key={idx} className="tag" style={{ backgroundColor: tag.color }}>
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="card-actions">
        <FaEdit className="icon edit-icon" onClick={(e) => { e.stopPropagation(); editCard(); }} />
        <FaTrash className="icon delete-icon" onClick={(e) => { e.stopPropagation(); deleteCard(); }} />
      </div>
      {showDeleteModal && (
        <div className="modal" onClick={(e) => e.stopPropagation()}>
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