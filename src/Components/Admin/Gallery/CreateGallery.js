import React, { useState } from "react";
import { Form, Card, Col, Row, Button } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import toast from "react-hot-toast";

function CreateGallery() {
  const CREATE_GALLERY = gql`
    mutation CreateGallery(
      $title: String
      $description: String
      $imagefile: Upload
    ) {
      createGallery(
        title: $title
        description: $description
        imagefile: $imagefile
      ) {
        id
      }
    }
  `;

  const [color, setColor] = useState("");

  const initialFormData = {
    title: "",
    description: "",
    imagefile: "",
  };

  const [galleryformData, setGalleryformData] = useState(initialFormData);

  const handleGalleryformData = (e) => {
    const { name, value, files } = e.target;

    if (name === "imagefile") {
      setGalleryformData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setGalleryformData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const [CreateGallery] = useMutation(CREATE_GALLERY, {
    onCompleted: () => {
      toast.success("Item Added to the Gallery !");
      setGalleryformData(initialFormData);
    },
    onError: (error) => {
      toast.error(error.message || "Error Occured");
      console.error("CREATE_GALLERY: ", error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await CreateGallery({
        variables: galleryformData,
      });
    } catch (err) {
      console.error("handleSubmit", handleSubmit);
    }
  };

  return (
    <>
      {/* <Row > */}
      <Col className="col-8 mx-auto my-5">
        <Card className="mb-5" style={{ border: "1px solid black" }}>
          <Card.Body>
            <h1>Create Gallery</h1>
            <Form onSubmit={handleSubmit}>
              <div className="mb-3">
                <Form.Label htmlFor="title">Url of the Page :</Form.Label>
                <Form.Control
                  type="text"
                  id="title"
                  name="title"
                  value={galleryformData.title}
                  onChange={handleGalleryformData}
                />
              </div>
              <div className="mb-3">
                <Form.Label htmlFor="description">Description:</Form.Label>
                <Form.Control
                  type="text"
                  id="description"
                  name="description"
                  value={galleryformData.description}
                  onChange={handleGalleryformData}
                />
              </div>
              <div className="mb-3">
                <Form.Label htmlFor="imagefile">Image file:</Form.Label>
                <Form.Control
                  type="file"
                  id="imagefile"
                  name="imagefile"
                  onChange={handleGalleryformData}
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

export default CreateGallery;
