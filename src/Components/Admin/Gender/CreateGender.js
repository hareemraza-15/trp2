import React, { useState } from "react";
import { Form, Card, Col, Row, Button } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import toast from "react-hot-toast";

function CreateGender() {
  const CREATE_GENDER_MUTATION = gql`
    mutation CreateGender($genderName: String) {
      createGender(genderName: $genderName) {
        id
        genderName
      }
    }
  `;

  const [gender, setGender] = useState("");

  const [createGender] = useMutation(CREATE_GENDER_MUTATION, {
    onCompleted: () => {
      toast.success("Gender Added Successfully");
      setGender("");
    },
    onError: (error) => {
      toast.error("Error Occured");
      console.error("ERROR: ", error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await createGender({
        variables: {
          genderName: gender,
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
            <h1>Create Gender</h1>
            <Form onSubmit={handleSubmit}>
              <div className="mb-3">
                <Form.Label htmlFor="genderName">Color:</Form.Label>
                <Form.Control
                  type="text"
                  id="genderName"
                  name="genderName"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
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

export default CreateGender;
