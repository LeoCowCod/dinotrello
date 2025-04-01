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
      .then((data) => setBoard(data));
  }, []);

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
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;