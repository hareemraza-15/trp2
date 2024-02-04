import { useMutation, gql } from "@apollo/client";
import React, { useState } from "react";
import { Form, Card, Col, Row, Button } from "react-bootstrap";
import toast from "react-hot-toast";

function CreateSize() {

  const [size, setSize] = useState("");

  const CREATE_SIZE_MUTATION = gql`mutation CreateSize($sizeName: String) {
  createSize(sizeName: $sizeName) {
    sizeName
    id
  }
}`;

  const [createSize] = useMutation(CREATE_SIZE_MUTATION, {
    onCompleted : () => {
      toast.success("Size Added Successfully")
    },
    onError : (error) => {
      toast.error("Error Occured");
      console.error("ERROR: ", error.message)
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await createSize({
        variables: {
          sizeName: size
        },
      });

      console.log(data.createSize);

    }
    catch (err) {
      console.error(err);
    }
  };



  return (
    <>
      {/* <Row> */}
        <Col className="col-8 mx-auto my-5">
          <Card  style={{ backgroundColor: "black", color: "white", border: "1px solid black"}} className="mb-5">
            <Card.Body>
              <h1>Create size</h1>
              <Form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <Form.Label >
                    Size :
                  </Form.Label>

                  <Form.Control
                    type="text"

                    name="categoryName"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                  />
                </div>

                <Button variant="outline-light" className="my-3" type="submit">
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

export default CreateSize;
