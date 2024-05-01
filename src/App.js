import React, { useState } from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import './App.css';
import Column from './components/Column';

const defaultColumns = {
  todo: [],
  inProgress: [],
  done: [],
};

function App() {
  const [columns, setColumns] = useState(defaultColumns);
  return (
    <div className="app-container">
      <Container fluid>
        <Row className="justify-content-center mb-4">
          <header className="app-header">
            <h1>Trello App</h1>
            <Button variant="light">Add New Card</Button>
          </header>
        </Row>
        <Row>
          {Object.keys(columns).map((columnId) => (
            <Column
              key={columnId}
              title={columnId.replace(/^\w/, (c) => c.toUpperCase())}
              cards={columns[columnId]}
            />
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default App;
