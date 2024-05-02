import React, { useEffect, useState } from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import './App.css';
import Column from './components/Column';
import CardModal from './components/CardModal';

const defaultColumns = {
  todo: [],
  inProgress: [],
  done: [],
};

function App() {
  const [columns, setColumns] = useState(
    () => JSON.parse(localStorage.getItem("kanbanColumns")) || defaultColumns
  );
  const [showModal, setShowModal] = useState(false);
  const [editableCard, setEditableCard] = useState(null);

  useEffect(() => {
    localStorage.setItem("kanbanColumns", JSON.stringify(columns));
  }, [columns]);

  const handleShowModal = (card = null) => {
    setEditableCard(card);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditableCard(null);
  };

  const handleAddCard = (card) => {
    const newColumns = {
      ...columns,
      [card.status]: [...columns[card.status], card],
    };
    setColumns(newColumns);
    handleCloseModal();
  };

  const handleEditCard = (updatedCard) => {
    if (!updatedCard) return;

    setColumns(prevColumns => {
      const newColumns = { ...prevColumns };
      const columnToUpdate = newColumns[updatedCard.status];
      if (!columnToUpdate) {
        console.error(`Column with status "${updatedCard.status}" not found.`);
        return prevColumns;
      }
      newColumns[updatedCard.status] = columnToUpdate.map(card => (card.id === updatedCard.id ? updatedCard : card));
      return newColumns;
    });
    handleCloseModal();
  };

  const handleDeleteCard = (card) => {
    const newColumns = {
      ...columns,
      [card.status]: columns[card.status].filter((c) => c.id !== card.id),
    };
    setColumns(newColumns);
    if (newColumns[card.status].length === 0) {
      setShowModal(false);
    }
  };

  const handleCardDragStart = (e, card) => {
    e.dataTransfer.setData('card', JSON.stringify(card));
  };

  const handleCardDragOver = (e) => {
    e.preventDefault();
  };

  const handleCardDrop = (e, status) => {
    const droppedCard = JSON.parse(e.dataTransfer.getData('card'));
    if (droppedCard.status.toLowerCase() !== status.toLowerCase()) {
      const updatedCard = { ...droppedCard, status };
      handleEditCard(updatedCard);
    }
  };

  return (
    <div className="app-container">
      <Container fluid>
        <Row className="justify-content-center mb-4">
          <header className="app-header">
            <h1>Trello App</h1>
            <Button onClick={() => handleShowModal()} variant="light">Add New Card</Button>
          </header>
        </Row>
        <Row>
          {Object.keys(columns).map((columnId) => (
            <Column
              key={columnId}
              title={columnId.replace(/^\w/, (c) => c.toUpperCase())}
              cards={columns[columnId]}
              onEditClick={handleShowModal}
              onDeleteClick={handleDeleteCard}
              onCardDragStart={handleCardDragStart}
              onCardDragOver={handleCardDragOver}
              onCardDrop={(e) => handleCardDrop(e, columnId)}
            />
          ))}
        </Row>
        {showModal && (
          <CardModal
            show={showModal}
            onHide={() => setShowModal(false)}
            onSave={editableCard ? handleEditCard : handleAddCard}
            card={editableCard}
          />
        )}
      </Container>
    </div>
  );
}

export default App;
