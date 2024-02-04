import React, { useState } from "react";
import { Card, Col, Row, Button, Form, Modal } from "react-bootstrap";
import { gql, useMutation, useQuery } from "@apollo/client";
import toast from "react-hot-toast";

function CreateProduct() {
  function handleColorBox(e) {
    if (e.target.checked) {
      setAllcolor([...allcolor, e.target.value]);
    } else {
      setAllcolor(allcolor.filter((item) => item !== e.target.value));
    }
  }

  function handleGenderChange(e) {
    if (e.target.checked) {
      setGender([...gender, e.target.value]);
    } else {
      setGender(gender.filter((item) => item !== e.target.value));
    }
  }

  function handleSizeChange(e) {
    if (e.target.checked) {
      setSize([...size, e.target.value]);
    } else {
      setSize(size.filter((item) => item !== e.target.value));
    }
  }

  const [productName, setProductName] = useState("");
  const [previewName, setPreviewName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [images, setImages] = useState([]);
  const [discount, setDiscount] = useState("");
  const [stock, setStock] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [gst, setGST] = useState("");
  const [gender, setGender] = useState([]);
  const [allcolor, setAllcolor] = useState([]);
  const [size, setSize] = useState([]);
  const [description, setDescription] = useState("");

  const CREATE_PRODUCT_MUTATION = gql`
    mutation CreateProduct(
      $productName: String
      $categoryName: String
      $priveiwName: String
      $size: [String]
      $color: [String]
      $gender: [String]
      $sellingPrice: Float
      $discount: Float
      $gst: Float
      $description: String
    ) {
      createProduct(
        productName: $productName
        categoryName: $categoryName
        priveiwName: $priveiwName
        size: $size
        color: $color
        gender: $gender
        sellingPrice: $sellingPrice
        discount: $discount
        gst: $gst
        description: $description
      ) {
        id
        productName
        priveiwName
        sellingPrice
        size
        color
        gender
        discount
        gst
        description
      }
    }
  `;

  const [createProduct] = useMutation(CREATE_PRODUCT_MUTATION, {
    onCompleted: () => {
      toast.success("Product Created Successfully");
      setProductName("");
      setCategoryName("");
      setDescription("");
      setSize([]);
      setAllcolor([]);
      setGender([]);
      setImages([]);
      setGST("");
      setSellingPrice("");
      setStock("");
      setDiscount("");
      setPreviewName("");
    },
    onError: (error) => {
      toast.error("Error Occured");
      console.error("ERROR: ", error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createProduct({
        variables: {
          productName,
          categoryName,
          priveiwName: previewName,
          size,
          color: allcolor,
          gender,
          sellingPrice: parseFloat(sellingPrice),
          discount: parseFloat(discount),
          gst: parseFloat(gst),
          description: description,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const GET_ALL_CATEGORIES = gql`
    query GetAllCategory {
      getAllCategory {
        categoryName
        id
      }
    }
  `;

  const { data: allcategories } = useQuery(GET_ALL_CATEGORIES);

  const GET_ALL_COLOUR = gql`
    query GetAllColor {
      getAllColor {
        id
        colorName
      }
    }
  `;

  const { data: color, refetch } = useQuery(GET_ALL_COLOUR);

  const GET_ALL_SIZE = gql`
    query GetAllSize {
      getAllSize {
        id
        sizeName
      }
    }
  `;

  const { data: sizedata, refetch: refetchSize } = useQuery(GET_ALL_SIZE);

  const GET_ALL_GENDER = gql`
    query Query {
      getAllGender {
        id
        genderName
      }
    }
  `;

  const { data: genderData, refetch: refetchGender } = useQuery(GET_ALL_GENDER);

  const [colorAdd, setColorAdd] = useState("");
  const [sizeAdd, setSizeAdd] = useState("");
  const [genderAdd, setGenderAdd] = useState("");

  const [colorModal, setColorModal] = useState(false);
  const [sizeModal, setSizeModal] = useState(false);
  const [genderModal, setGenderModal] = useState(false);

  // ADD COLOR

  const CREATE_COLOR_MUTATION = gql`
    mutation CreateColor($colorName: String) {
      createColor(colorName: $colorName) {
        id
        colorName
      }
    }
  `;

  const [createColor] = useMutation(CREATE_COLOR_MUTATION, {
    onCompleted: () => {
      toast.success("Color Added Successfully");
      setColorAdd("");
    },
    onError: (error) => {
      toast.error("Error Occured");
      console.error("ERROR: ", error.message);
    },
  });

  const handleSubmitAddColor = async (e) => {
    e.preventDefault();

    try {
      const { data } = await createColor({
        variables: {
          colorName: colorAdd,
        },
      });
    } catch (err) {
      console.error(err);
    }
    setColorModal(false);
    refetch();
  };

  // ADD SIZE
  const CREATE_SIZE_MUTATION = gql`
    mutation CreateSize($sizeName: String) {
      createSize(sizeName: $sizeName) {
        sizeName
        id
      }
    }
  `;

  const [createSize] = useMutation(CREATE_SIZE_MUTATION, {
    onCompleted: () => {
      toast.success("Size Added Successfully");
      setSizeAdd("");
    },
    onError: (error) => {
      toast.error("Error Occured");
      console.error("ERROR: ", error.message);
    },
  });

  const handleSubmitAddSize = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createSize({
        variables: {
          sizeName: sizeAdd,
        },
      });
      console.log(data.createSize);
    } catch (err) {
      console.error(err);
    }

    setSizeModal(false);
    refetchSize();
  };

  // ADD GENDER
  const CREATE_GENDER_MUTATION = gql`
    mutation CreateGender($genderName: String) {
      createGender(genderName: $genderName) {
        id
        genderName
      }
    }
  `;

  const [createGender] = useMutation(CREATE_GENDER_MUTATION, {
    onCompleted: () => {
      toast.success("Gender Added Successfully");
      setGenderAdd("");
    },
    onError: (error) => {
      toast.error("Error Occured");
      console.error("ERROR: ", error.message);
    },
  });

  const handleSubmitAddGender = async (e) => {
    e.preventDefault();

    try {
      const { data } = await createGender({
        variables: {
          genderName: genderAdd,
        },
      });
    } catch (err) {
      console.error(err);
    }

    setGenderModal(false);
    refetchGender();
  };

  const handleAddColour = () => {
    setColorModal(true);
  };

  const handleAddSize = () => {
    setSizeModal(true);
  };

  const handleAddGender = () => {
    setGenderModal(true);
  };

  return (
    <>
      <Row className="mx-auto my-5">
        <Col>
          <Card style={{ backgroundColor: "black", color: "white" }}>
            <Card.Body style={{ backgroundColor: "black", color: "white" }}>
              <Button
                variant="outline-light"
                onClick={() => handleAddColour()}
                className="mt-2 me-2 mb-2"
              >
                ADD COLOUR
              </Button>
              <Button
                variant="outline-light"
                onClick={() => handleAddSize()}
                className="mt-2 me-2 mb-2"
              >
                ADD SIZE
              </Button>
              <Button
                variant="outline-light"
                onClick={() => handleAddGender()}
                className="mt-2 me-2 mb-2"
              >
                ADD GENDER
              </Button>

              <h2>Add Product</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Label className="my-1">Product Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />

                <Form.Label className="my-1">Product Preview Name</Form.Label>
                <Form.Control
                  type="text"
                  value={previewName}
                  onChange={(e) => setPreviewName(e.target.value)}
                />

                <Form.Label className="my-1">Category Name</Form.Label>
                <Form.Select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                >
                  <option hidden>Select Category Name</option>
                  {allcategories?.getAllCategory?.map((item, index) => (
                    <option key={index}>{item.categoryName}</option>
                  ))}
                </Form.Select>

                <Form.Label className="my-1">Discount</Form.Label>
                <Form.Control
                  type="text"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />

                <Form.Label className="my-1">Selling Price</Form.Label>
                <Form.Control
                  type="text"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                />

                <Form.Label className="my-1">GST</Form.Label>
                <Form.Control
                  type="text"
                  value={gst}
                  onChange={(e) => setGST(e.target.value)}
                />

                <Form.Group>
                  <Form.Label className="my-1">Gender : </Form.Label>
                  {genderData?.getAllGender &&
                    genderData?.getAllGender?.map((g) => (
                      <div key={g?.id} className="d-inline">
                        <input
                          className="mx-1"
                          value={g?.genderName}
                          type="checkbox"
                          onChange={handleGenderChange}
                        />
                        <span>{g?.genderName}</span>
                      </div>
                    ))}
                </Form.Group>

                <Form.Group>
                  <Form.Label className="my-1">Color : </Form.Label>
                  {color?.getAllColor &&
                    color?.getAllColor?.map((colors) => (
                      <div key={colors.id} className="d-inline">
                        <input
                          className="mx-1"
                          value={colors?.colorName}
                          type="checkbox"
                          onChange={handleColorBox}
                        />
                        <span>{colors?.colorName}</span>
                      </div>
                    ))}
                </Form.Group>

                <Form.Group>
                  <Form.Label className="my-1">Size : </Form.Label>
                  {sizedata?.getAllSize &&
                    sizedata?.getAllSize?.map((size) => (
                      <div key={size.id} className="d-inline">
                        <input
                          className="mx-1"
                          value={size?.sizeName}
                          type="checkbox"
                          onChange={handleSizeChange}
                        />
                        <span>{size?.sizeName}</span>{" "}
                      </div>
                    ))}
                </Form.Group>
                <Form.Group className="my-1">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
                <Button variant="outline-light" type="submit" className="mt-2">
                  Save Product
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        style={{ width: "100%" }}
        show={colorModal}
        onHide={() => setColorModal(false)}
        scrollable
        dialogClassName="full"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Update Product Color List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitAddColor}>
            <div className="mb-3">
              <Form.Label htmlFor="colorName">Color:</Form.Label>
              <Form.Control
                type="text"
                id="colorName"
                name="colorName"
                value={colorAdd}
                onChange={(e) => setColorAdd(e.target.value)}
              />
            </div>
            <Button variant="outline-dark" className="my-3" type="submit">
              {" "}
              Submit{" "}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        style={{ width: "100%" }}
        show={sizeModal}
        onHide={() => setSizeModal(false)}
        scrollable
        dialogClassName="full"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Update Product Size List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitAddSize}>
            <div className="mb-3">
              <Form.Label> Size : </Form.Label>
              <Form.Control
                type="text"
                name="categoryName"
                value={sizeAdd}
                onChange={(e) => setSizeAdd(e.target.value)}
              />
            </div>
            <Button variant="outline-dark" className="my-3" type="submit">
              {" "}
              Submit{" "}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        style={{ width: "100%" }}
        show={genderModal}
        onHide={() => setGenderModal(false)}
        scrollable
        dialogClassName="full"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Update Product Gender List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitAddGender}>
            <div className="mb-3">
              <Form.Label htmlFor="genderName">Gender:</Form.Label>
              <Form.Control
                type="text"
                id="genderName"
                name="genderName"
                value={genderAdd}
                onChange={(e) => setGenderAdd(e.target.value)}
              />
            </div>
            <Button variant="outline-dark" className="my-3" type="submit">
              {" "}
              Submit{" "}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateProduct;
