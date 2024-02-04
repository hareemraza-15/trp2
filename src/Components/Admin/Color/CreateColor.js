import React, { useState } from "react";
import { Form, Card, Col, Row, Button } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import toast from "react-hot-toast";

function CreateColor() {
  const CREATE_COLOR_MUTATION = gql`
    mutation CreateColor($colorName: String) {
      createColor(colorName: $colorName) {
        id
        colorName
      }
    }
  `;

  const [color, setColor] = useState("");

  const [createColor] = useMutation(CREATE_COLOR_MUTATION, {
    onCompleted: () => {
      toast.success("Color Added Successfully");
      setColor("");
    },
    onError: (error) => {
      toast.error("Error Occured");
      console.error("ERROR: ", error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await createColor({
        variables: {
          colorName: color,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* <Row > */}
      <Col className="col-8 mx-auto my-5">
        <Card className="mb-5" style={{ border: "1px solid black" }}>
          <Card.Body>
            <h1>Create color</h1>
            <Form onSubmit={handleSubmit}>
              <div className="mb-3">
                <Form.Label htmlFor="colorName">Color:</Form.Label>
                <Form.Control
                  type="text"
                  id="colorName"
                  name="colorName"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <Button variant="outline-success" className="my-3" type="submit">
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      {/* </Row> */}
    </>
  );
}

export default CreateColor;
