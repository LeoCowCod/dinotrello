import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import List from './components/List';
import './App.css';

function App() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/board')
      .then((res) => res.json())
      .then((data) => {
        console.log('Tablero inicial cargado:', data);
        setBoard(data);
      })
      .catch((err) => console.error('Error al cargar el tablero:', err));
  }, []);

  const addList = async () => {
    const title = prompt('Nombre de la nueva lista:');
    if (!title) return;
    const color = prompt('Color (ej. #ffcccc):') || '#f0f0f0';
    const payload = { title, color };
    try {
      console.log('Enviando solicitud para nueva lista:', payload);
      const res = await fetch('http://localhost:5000/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
      }
      const newList = await res.json();
      console.log('Nueva lista recibida:', newList);
      setBoard((prev) => {
        if (!prev) {
          console.error('Estado previo es null');
          return null;
        }
        const updatedBoard = { ...prev, lists: [...prev.lists, newList] };
        console.log('Tablero actualizado:', updatedBoard);
        return updatedBoard;
      });
    } catch (error) {
      console.error('Error al añadir lista:', error);
      alert('No se pudo añadir la lista. Revisa la consola para más detalles.');
    }
  };

  if (!board) return <div className="loading">Cargando...</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="page-wrapper">
        <div className="app">
          <h1>{board.title}</h1>
          <div className="board">
            {board.lists.map((list) => (
              <List key={list.id} list={list} setBoard={setBoard} />
            ))}
            <div className="add-list" onClick={addList}>
              <span>+ Nueva Lista</span>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;