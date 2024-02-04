import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Button, Card, Form, Row, Col } from "react-bootstrap";
import toast from "react-hot-toast";

function CreateCategory() {
  const [categoryName, setCategoryName] = useState("");

  const CREATE_CATEGROY = gql`
    mutation CreateCategory($categoryName: String) {
      createCategory(categoryName: $categoryName) {
        id
        categoryName
      }
    }
  `;

  const [createCategory, { data, loading, error }] = useMutation(
    CREATE_CATEGROY,
    {
      onCompleted: () => {
        toast.success("Category Added Successfully");
        setCategoryName("");
      },
      onError: (error) => {
        toast.error("Error Occured");
        console.error("ERROR: ", error.message);
      },
    }
  );

  const handleSubmit = async () => {
    await createCategory({
      variables: {
        categoryName: categoryName,
      },
    });
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  return (
    <>
      <Card
        className="my-5 mx-5"
        style={{ backgroundColor: "#ffffff", border: "none" }}
      >
        <Card.Body>
          <h1>Create Category</h1>
          <Form.Label htmlFor="colorName">Enter Category Name:</Form.Label>
          <Form.Control
            type="text"
            name="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <Button
            type="submit"
            variant="outline-success"
            className="my-3"
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </Card.Body>
      </Card>
      {/* </Col> */}
      {/* </Row> */}
    </>
  );
}

export default CreateCategory;
