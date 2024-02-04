import React from 'react';
import { Card, Form } from 'react-bootstrap';

function ContactUs() {
  return (<>
    <div className='text-left px-3 m-auto mt-5' style={{ paddingTop: "10%", border: "none", width: "70%", borderRadius: "5px"}}>
      <h1 className='text-center fw-bold' > Contact Us</h1>
      <Card>
        <Card.Body>
          <Form>
            <Form.Label>Email</Form.Label>
            <Form.Control />
          </Form>
        </Card.Body>
      </Card>
    </div>
  </>);
}

export default ContactUs;