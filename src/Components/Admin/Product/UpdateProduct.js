import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Trash } from "react-bootstrap-icons";
import { Card, Col, Row, Button, Table, Form, Modal } from "react-bootstrap";
import toast from "react-hot-toast";

const GET_ALL_PRODUCT = gql`
  query GetAllProducts {
    getAllProducts {
      id
      color
      description
      discount
      gender
      gst
      priveiwName
      productName
      sellingPrice
      size
      stock {
        quantity
        gender
        color
        size
      }
      images {
        imagePath
        color
        gender
      }
    }
  }
`;

const ADD_IMAGE = gql`
  mutation AddImagetoProduct(
    $productId: ID
    $productImages: [Upload]
    $color: String
    $gender: String
  ) {
    addImagetoProduct(
      productId: $productId
      productImages: $productImages
      color: $color
      gender: $gender
    ) {
      massage
    }
  }
`;

const ADD_STOCK = gql`
  mutation AddStocktoProduct(
    $productId: ID
    $quantity: Int
    $gender: String
    $color: String
    $size: String
  ) {
    addStocktoProduct(
      productId: $productId
      quantity: $quantity
      gender: $gender
      color: $color
      size: $size
    ) {
      massage
    }
  }
`;

const DELETE_IMAGE_FROM_PRODUCT = gql`
  mutation RemoveImageFromProduct(
    $productId: ID
    $url: String
    $color: String
    $gender: String
  ) {
    removeImageFromProduct(
      productId: $productId
      url: $url
      color: $color
      gender: $gender
    ) {
      massage
    }
  }
`;
function UpdateProduct() {
  const [productId, setProductId] = useState("");
  const [imageModal, setImageModal] = useState(false);
  const [stockModal, setStockModal] = useState(false);

  //  Images

  const [color, setColor] = useState("");
  const [gender, setGender] = useState("");
  const [productImages, setProductImages] = useState([]);

  const [allColor, setAllColor] = useState([]);
  const [allGender, setAllGender] = useState([]);
  const [allSize, setAllSize] = useState([]);

  //
  const [quantity, setQuantity] = useState(0);

  const [size, setSize] = useState("");

  const { data, refetch } = useQuery(GET_ALL_PRODUCT);

  useEffect(() => {
    refetch();
  }, []);

  // ADD_IMAGE

  const [addImagetoProduct, { data: dataImage }] = useMutation(ADD_IMAGE, {
    onCompleted: () => {
      toast.success("Images Updated Successfully");
      setImageModal(false);
      refetch();
    },
    onError: (error) => {
      toast.error("Error Occured");
      console.error("ERROR: ", error.message);
    },
  });

  const handleImages = async (id, color, gender) => {
    setProductId(id);
    setImageModal(true);
    setAllColor(color);
    setAllGender(gender);
  };

  const ConfirmUpdateImage = async () => {
    await addImagetoProduct({
      variables: {
        productId: productId,
        productImages: productImages,
        color: color,
        gender: gender,
      },
    });
  };

  // ADD_STOCK

  const [addStocktoProduct, { data: dataStock }] = useMutation(ADD_STOCK, {
    onCompleted: () => {
      toast.success("Stock Updated Successfully");
      setStockModal(false);
      refetch();
    },
    onError: (error) => {
      toast.error("Error Occured");
      console.error("ERROR: ", error.message);
    },
  });
  const handleStock = async (id, color, gender, size) => {
    setProductId(id);
    setStockModal(true);
    setAllColor(color);
    setAllGender(gender);
    setAllSize(size);
  };

  const ConfirmUpdateStock = async () => {
    await addStocktoProduct({
      variables: {
        productId: productId,
        quantity: parseInt(quantity, 10),
        gender: gender,
        color: color,
        size: size,
      },
    });
  };

  // handle searching

  const [searchQuery, setsearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data?.getAllProducts) {
      setFilteredData(data.getAllProducts);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setsearchQuery(searchTerm);

    const filteredItems = data.getAllProducts?.filter((item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(filteredItems);
  };

  // handle view and delete image

  const [viewImageModal, setviewImageModal] = useState(false);
  const [listImages, setListImages] = useState([]);
  const [productsImages, setproductsImages] = useState([]);

  const handleviewImages = async (id, color, gender, imagess) => {
    setColor("");
    setGender("");
    setListImages([]);
    setProductId(id);
    setviewImageModal(true);
    setAllColor(color);
    setproductsImages(imagess);
    setAllGender(gender);
  };

  useEffect(() => {
    if (viewImageModal) {
      const imagesArray = productsImages.find(
        (item) => item.color === color && item.gender === gender
      );

      if (imagesArray) {
        setListImages(imagesArray?.imagePath);
      } else {
        setListImages([]);
      }
    }
  }, [color, gender, productsImages, viewImageModal]);

  // useEffect(() => {

  // }, []);

  const [RemoveImageFromProduct, { loading }] = useMutation(
    DELETE_IMAGE_FROM_PRODUCT,
    {
      onCompleted: () => {
        refetch();
        // setviewImageModal(false);
      },
    }
  );

  const handleDelete = async (url, imgIndex) => {
    const shouldDelete = window.confirm("Are you sure you want to delete ?");
    if (shouldDelete) {
      const { data: removeImage } = await RemoveImageFromProduct({
        variables: {
          productId,
          url,
          color,
          gender,
        },
      });

      if (removeImage?.removeImageFromProduct?.massage && viewImageModal) {
        const filteredImages = listImages?.filter((img1) => img1 !== url);

        if (filteredImages) {
          setListImages(filteredImages);
        } else {
          setListImages([]);
        }
      }
    }
  };

  return (
    <>
      <Row className="mx-auto my-5">
        <Col className="ms-0">
          <Card className="ms-0">
            <Card.Body className="ms-0">
              <h2>Table to Update Product</h2>
              <div className="col-6">
                <div className="input-group">
                  <input
                    className="form-control border-secondary py-2"
                    type="search"
                    placeholder="Find Product"
                    value={searchQuery}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <Table bordered hover responsive className="mt-2">
                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Product Full Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.getAllProducts &&
                    filteredData
                      .slice(0)
                      .reverse()
                      .map((item, index) => (
                        <tr key={item.id}>
                          <td> {index + 1} </td>
                          <td> {item.productName} </td>
                          <td>
                            <Button
                              className="btn btn-sm mx-1 btn-dark"
                              onClick={() =>
                                handleImages(item.id, item.color, item.gender)
                              }
                            >
                              Add Image
                            </Button>
                            <Button
                              className="btn btn-sm mx-1 btn-dark"
                              onClick={() =>
                                handleStock(
                                  item.id,
                                  item.color,
                                  item.gender,
                                  item.size
                                )
                              }
                            >
                              Add Stock
                            </Button>
                            <Button
                              className="btn btn-sm mx-1 btn-dark"
                              onClick={() =>
                                handleviewImages(
                                  item.id,
                                  item.color,
                                  item.gender,
                                  item.images
                                )
                              }
                            >
                              View Images
                            </Button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        style={{ width: "100%" }}
        show={imageModal}
        onHide={() => setImageModal(false)}
        scrollable
        dialogClassName="full"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Update Product Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Color</Form.Label>
          <Form.Select onChange={(e) => setColor(e.target.value)}>
            <option hidden>Select Color</option>
            {allColor &&
              allColor?.map((c, index) => (
                <option key={index} value={c}>
                  {c}
                </option>
              ))}
          </Form.Select>
          <Form.Label>Gender</Form.Label>
          <Form.Select onChange={(e) => setGender(e.target.value)}>
            <option hidden>Select Gender</option>
            {allGender &&
              allGender?.map((c, index) => (
                <option key={index} value={c}>
                  {c}
                </option>
              ))}
          </Form.Select>
          <Form.Label>Images</Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={(e) => setProductImages(e.target.files)}
          />
          <Button
            variant="dark"
            type="submit"
            className="mt-2"
            onClick={() => setImageModal(false)}
          >
            Go Back
          </Button>
          <Button
            variant="dark"
            type="submit"
            className="mt-2 mx-1"
            onClick={() => ConfirmUpdateImage()}
          >
            Save Changes
          </Button>
        </Modal.Body>
      </Modal>

      <Modal
        style={{ width: "100%" }}
        show={stockModal}
        onHide={() => setStockModal(false)}
        scrollable
        dialogClassName="full"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Update Product Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Color</Form.Label>
          <Form.Select onChange={(e) => setColor(e.target.value)}>
            <option hidden>Select Color</option>
            {allColor &&
              allColor?.map((c, index) => (
                <option key={index} value={c}>
                  {c}
                </option>
              ))}
          </Form.Select>
          <Form.Label>Gender</Form.Label>
          <Form.Select onChange={(e) => setGender(e.target.value)}>
            <option hidden>Select Gender</option>
            {allGender &&
              allGender?.map((c, index) => (
                <option key={index} value={c}>
                  {c}
                </option>
              ))}
          </Form.Select>
          <Form.Label>Size</Form.Label>
          <Form.Select onChange={(e) => setSize(e.target.value)}>
            <option hidden>Select Size</option>
            {allSize &&
              allSize?.map((c, index) => (
                <option key={index} value={c}>
                  {c}
                </option>
              ))}
          </Form.Select>
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            onChange={(e) => setQuantity(e.target.value)}
          />
          <Button
            variant="dark"
            type="submit"
            className="mt-2"
            onClick={() => setStockModal(false)}
          >
            Go Back
          </Button>
          <Button
            variant="dark"
            type="submit"
            className="mt-2 mx-1"
            onClick={() => ConfirmUpdateStock()}
          >
            Save Changes
          </Button>
        </Modal.Body>
      </Modal>

      <Modal
        style={{ width: "100%" }}
        show={viewImageModal}
        onHide={() => setviewImageModal(false)}
        scrollable
        dialogClassName="full"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">View Product Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Color</Form.Label>
          <Form.Select onChange={(e) => setColor(e.target.value)} value={color}>
            <option hidden>Select Color</option>
            {allColor &&
              allColor?.map((c, index) => (
                <option key={index} value={c}>
                  {c}
                </option>
              ))}
          </Form.Select>
          <Form.Label>Gender</Form.Label>
          <Form.Select
            onChange={(e) => setGender(e.target.value)}
            value={gender}
          >
            <option hidden>Select Gender</option>
            {allGender &&
              allGender?.map((c, index) => (
                <option key={index} value={c}>
                  {c}
                </option>
              ))}
          </Form.Select>
          <div className="d-flex flex-wrap justify-content-center my-3">
            {listImages.length > 0 ? (
              listImages.map((img, index) => (
                <div key={index} className="me-2 mb-2 position-relative">
                  <Button
                    onClick={() => handleDelete(img, index)}
                    className="btn btn-sm btn-light position-absolute"
                    style={{ right: 0 }}
                  >
                    <Trash size={20} color="black" />
                  </Button>
                  <img
                    src={img}
                    className="img-thumbnail"
                    style={{
                      height: "100px",
                      width: "80px",
                    }}
                    alt=""
                  />
                </div>
              ))
            ) : (
              <div>No Image Found</div>
            )}
          </div>

          <Button
            variant="dark"
            type="submit"
            className="mt-3"
            onClick={() => setviewImageModal(false)}
          >
            Go Back
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UpdateProduct;
