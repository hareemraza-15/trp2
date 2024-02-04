import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button, Form, Row, Col, Card, Container } from "react-bootstrap";

const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`;

function ResetPassword() {
  const [passWord, setPassWord] = useState("");

  const location = useLocation();
  const query = new URLSearchParams(location?.search);

  const token = query.get("token");

  const navigate = useNavigate();

  const [reset, { loading }] = useMutation(RESET_PASSWORD, {
    onCompleted: (res) => {
      if (res?.resetPassword) {
        toast.success("Password reset Successful !");
        setPassWord("");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    },
    onError: (error) => {
      toast.error("Some Error Occured");
      console.log(error.message);
    },
  });

  const handleMail = async () => {
    try {
      if (!token) {
        throw new Error("Token is missing !");
      }

      if (!passWord) {
        throw new Error("Enter New Password !");
      }

      await reset({
        variables: {
          token,
          newPassword: passWord,
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
                  <h3>Reset Password</h3>
                  <Form.Control
                    type="password"
                    onChange={(e) => setPassWord(e.target.value)}
                    placeholder="Enter New Password"
                  />
                  <Button
                    onClick={() => handleMail()}
                    disabled={loading ? true : false}
                    className="mt-4 mb-4"
                  >
                    {loading ? "Loading" : "Submit"}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default ResetPassword;
