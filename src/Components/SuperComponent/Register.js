import React, { useState, useEffect } from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { gql, useMutation } from "@apollo/client";
import toast from "react-hot-toast";

function RegistrationForm() {
  const navigate = useNavigate();

  const REGISTER = gql`
    mutation RegisterUser($firstName: String!, $lastName: String!, $email: String!, $mobileNo: String!, $password: String!) {
      registerUser(firstName: $firstName, lastName: $lastName, email: $email, mobileNo: $mobileNo, password: $password) {
        token
        user {
          email
          firstName
          id
          lastName
          role
        }
      }
    }
  `;

  const [createUser, {data, error}] = useMutation(REGISTER, {
    onCompleted: () => {
      toast.success("Registration Successful!!!");
      localStorage.setItem('token', data?.loginUser?.token);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    },
    onError: (error) => {
      toast.error("Registration not completed");
      console.error("ERROR: ", error.message);
    }
  });


  const phoneRegExp =
    /^(\+91)?(-)?\s*?(91)?\s*?(\d{3})-?\s*?(\d{3})-?\s*?(\d{4})$/;

  const validationSchema = Yup.object().shape({
    // username: Yup.string().required("user Name is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
      .min(6, "Must be at least 6 chars!")
      .required("Password is required"),
    confirm: Yup.string()
      .min(6, "Must be at least 6 chars!")
      .required("Confirm your Password")
      .oneOf([Yup.ref("password")], "Passwords does not match"),
    mobileNo: Yup.string()
      .matches(phoneRegExp, "Phone number is not valid")
      .required("Phone Number is required"),
  });
  const initialValues = {
    // username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    mobileNo: "",
  };
  // const onSubmit = (values) => console.log('submit form', values);

  const onSubmit = async (values, resetForm) => {
    createUser({
      variables: {
        firstName: values.firstName,
        lastName: values.lastName,  
        email: values.email,
        mobileNo: values.mobileNo,
        password: values.confirm,
      }
    })
    console.log("values", values);
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  useEffect(() => {
    localStorage.setItem('token', data?.loginUser?.token);
  }, [data]);

  return (
    <div className="mt-5 mb-5 pt-5 pb-5">
      {/* <Container> */}
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <div className="border border-2 border-primary"></div>
            <Card className="shadow px-4 mb-5 pb-6">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  <h2 className="fw-bold mb-2 text-center text-uppercase ">
                    Register
                  </h2>
                  <div className="mb-3 mt-4">
                    <Form onSubmit={handleSubmit} className="mt-4">
                      <Form.Group className="mb-3 d-flex" controlId="Name">
                        <Col className="col-6 mx-0 px-0 me-2">
                        {/* <Form.Group className="mb-3 d-inline" controlId="Name"> */}
                        <Form.Label className="text-center">First Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter First Name"
                          name="firstName"
                          value={values.firstName}
                          onChange={handleChange}
                          className="me-2"
                        />
                        {errors.firstName && touched.firstName && (
                          <div className="text-danger">{errors.firstName}</div>
                        )}
                        {/* </Form.Group> */}
                        </Col>
                        <Col className="col-6 mx-0 px-0">
                        {/* <Form.Group className="mb-3 d-inline" controlId="Name"> */}
                         <Form.Label className="text-center">Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Last Name"
                          name="lastName"
                          value={values.lastName}
                          onChange={handleChange}
                        />
                        {errors.lastName && touched.lastName && (
                          <div className="text-danger">{errors.lastName}</div>
                        )}
                         {/* </Form.Group> */}
                        </Col>
                     </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="text-center">
                          Email address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                        />
                        {errors.email && touched.email && (
                          <div className="text-danger">{errors.email}</div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicmobile">
                        <Form.Label className="text-center">
                          Mobile No
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter mobile No"
                          name="mobileNo"
                          value={values.mobileNo}
                          onChange={handleChange}
                        />
                        {errors.mobileNo && touched.mobileNo && (
                          <div className="text-danger">{errors.mobileNo}</div>
                        )}
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                        />
                        {errors.password && touched.password && (
                          <div className="text-danger">{errors.password}</div>
                        )}
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword1"
                      >
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          name="confirm"
                          value={values.confirm}
                          onChange={handleChange}
                        />
                        {errors.confirm && touched.confirm && (
                          <div className="text-danger">{errors.confirm}</div>
                        )}
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicCheckbox"
                      ></Form.Group>
                      <div className="d-grid">
                        <Button variant="primary" type="submit">
                          Create Account
                        </Button>
                      </div>
                    </Form>
                    <div className="mt-3">
                      <p className="mb-0 text-center fs-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary fw-bold">
                          Sign In
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      {/* </Container> */}
    </div>
  );
}

export default RegistrationForm;
