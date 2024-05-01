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
    console.log("card", card)
    const newColumns = {
      ...columns,
      [card.status]: [...columns[card.status], card],
    };
    console.log("newColumns", newColumns)
    setColumns(newColumns);
    handleCloseModal();
  };

  const handleEditCard = (updatedCard) => {
    if (!updatedCard) return;

    const newColumns = { ...columns };
    // Remove the card from its current column
    newColumns[updatedCard.status] = newColumns[updatedCard.status].filter(
      (card) => card.id !== updatedCard.id
    );
    // Add the updated card to its new column
    newColumns[updatedCard.status].push(updatedCard);
    setColumns(newColumns);
    handleCloseModal();
  };

  const handleDeleteCard = (card) => {
    const newColumns = {
      ...columns,
      [card.status]: columns[card.status].filter((c) => c.id !== card.id),
    };
    setColumns(newColumns);

    // Check if no more cards left in the current column
    if (newColumns[card.status].length === 0) {
      setShowModal(false);
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
