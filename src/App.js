import React from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Container fluid>
        <Row className="justify-content-center">
          <header className="app-header">
            <h1>Trello App</h1>
            <Button variant="light">Add New Card</Button>
          </header>
        </Row>
      </Container>
    </div>
  );
}

export default App;
