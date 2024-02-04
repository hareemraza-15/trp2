import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useState } from "react";
import { Button, Form, Row, Col, Card, Container } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Forgot() {
  const navigate = useNavigate();
  const [mail, setMail] = useState("");
  const REQUEST = gql`
    mutation RequestPasswordReset($email: String!) {
      requestPasswordReset(email: $email)
    }
  `;

  const [sendMail, { loading }] = useMutation(REQUEST, {
    onCompleted(res) {
      if (res?.requestPasswordReset) {
        toast.success("Check Your mailbox !");
      }
    },
  });
  const handleMail = async () => {
    try {
      if (!mail) {
        throw new Error("Email is Mandatory !");
      }
      await sendMail({
        variables: {
          email: mail,
        },
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong !");
    }
  };

  return (
    <>
      <div>
        <Container>
          <Row className="vh-100 d-flex justify-content-center align-items-center">
            <Col md={8} lg={6} xs={12}>
              <div className="border border-3 border-primary"></div>
              <Card className="shadow" style={{ border: "none" }}>
                <Card.Body className="mx-3">
                  <h3>Forgot Password ???</h3>

                  <Form>
                    <Form.Control
                      type="email"
                      onChange={(e) => setMail(e.target.value)}
                      placeholder="Enter your Email"
                      className="mb-4"
                    />
                    <Button
                      onClick={() => handleMail()}
                      disabled={loading ? true : false}
                      className="mt-5"
                    >
                      {loading ? "Loading" : "Submit"}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Forgot;
