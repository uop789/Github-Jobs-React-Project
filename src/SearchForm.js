import React from 'react';
import { Form, Col } from 'react-bootstrap';

export default function SearchForm({ params, onInputsChange }) {
  return (
    <Form className="mb-4">
      <Form.Row className="align-items-end">
        <Form.Group as={Col}>
          <Form.Label>Search</Form.Label>
          <Form.Control
            value={params.description}
            name="description"
            onChange={onInputsChange}
          />
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>Location</Form.Label>
          <Form.Control
            value={params.location}
            name="location"
            type="text"
            onChange={onInputsChange}
          ></Form.Control>
        </Form.Group>
        {/* xs="auto" let checkbox only take up as much space as needed(as small as possible) 
            instead of being the equal width right here is one third of the full width
         */}
        <Form.Group as={Col} xs="auto" className="ml-2">
          <Form.Check
            label="Only Full Time"
            name="full_time"
            className="mb-2"
            type="checkbox"
            onChange={onInputsChange}
          />
        </Form.Group>
      </Form.Row>
    </Form>
  );
}
