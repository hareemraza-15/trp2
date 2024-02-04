import React, { useEffect, useState } from "react";
import { Card, Col, Row, Button, Table, Form, Modal } from "react-bootstrap";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Pencil, Trash } from "react-bootstrap-icons";

function ListProduct() {
  const GET_ALL_COLOUR = gql`
    query GetAllColor {
      getAllColor {
        id
        colorName
      }
    }
  `;

  const { data: color } = useQuery(GET_ALL_COLOUR);

  const GET_ALL_SIZE = gql`
    query GetAllSize {
      getAllSize {
        id
        sizeName
      }
    }
  `;

  const { data: sizedata } = useQuery(GET_ALL_SIZE);

  const GET_ALL_GENDER = gql`
    query Query {
      getAllGender {
        id
        genderName
      }
    }
  `;

  const { data: genderData } = useQuery(GET_ALL_GENDER);

  const [modal, showModal] = useState(false);

  const GET_ALL_PRODUCT = gql`
    query GetAllProducts {
      getAllProducts {
        id
        color
        description
        discount
        gender
        categoryName
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

  const GET_ALL_CATEGORIES = gql`
    query GetAllCategory {
      getAllCategory {
        categoryName
        id
      }
    }
  `;

  const { data: allcategories } = useQuery(GET_ALL_CATEGORIES);

  const { data, refetch } = useQuery(GET_ALL_PRODUCT);

  useEffect(() => {
    refetch();
  }, []);

  // DELETE
  const DELETE_PRODUCT = gql`
    mutation DeleteProduct($deleteProductId: ID!) {
      deleteProduct(id: $deleteProductId) {
        id
      }
    }
  `;

  const [deleteProduct, { data: deleteData }] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleDelete = async (id) => {
    await deleteProduct({
      variables: {
        deleteProductId: id,
      },
    });
  };

  // Edit
  const [updateProductId, setUpdateProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [previewName, setPreviewName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [images, setImages] = useState([]);
  const [discount, setDiscount] = useState("");
  const [stock, setStock] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  // const [purchasePrice, setPurchasePrice] = useState("");
  const [gender, setGender] = useState("");
  const [allcolor, setAllcolor] = useState([]);
  const [allsize, setAllSize] = useState("");
  const [description, setDescription] = useState("");
  const [gst, setGST] = useState("");

  const EDIT_PRODUCT = gql`
    mutation UpdateProduct(
      $updateProductId: ID!
      $productName: String
      $categoryName: String
      $priveiwName: String
      $size: [String]
      $color: [String]
      $gender: [String]
      $sellingPrice: Float
      $description: String
      $discount: Float
      $gst: Float
    ) {
      updateProduct(
        id: $updateProductId
        productName: $productName
        categoryName: $categoryName
        priveiwName: $priveiwName
        size: $size
        color: $color
        gender: $gender
        sellingPrice: $sellingPrice
        description: $description
        discount: $discount
        gst: $gst
      ) {
        id
        productName
        priveiwName
        sellingPrice
        images {
          imagePath
          color
          gender
        }
        size
        color
        gender
        discount
        gst
        description
        stock {
          quantity
          gender
          color
          size
        }
      }
    }
  `;

  // const EDIT_PRODUCT = gql`
  //   mutation UpdateProduct($updateProductId: ID!, $productName: String, $priveiwName: String, $size: [String], $color: [String], $gender: [String], $sellingPrice: Float, $purchasePrice: Float, $discount: Float, $gst: Float, $description: String, $productImages: [Upload], $stock: Int) {
  //     updateProduct(id: $updateProductId, productName: $productName, priveiwName: $priveiwName, size: $size, color: $color, gender: $gender, sellingPrice: $sellingPrice, purchasePrice: $purchasePrice, discount: $discount, gst: $gst, description: $description, productImages: $productImages, stock: $stock) {
  //       id
  //       productName
  //       priveiwName
  //       sellingPrice
  //       images
  //       size
  //       color
  //       gender
  //       discount
  //       gst
  //       description
  //       stock
  //     }
  //   }
  // `;

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
      setAllSize([...allsize, e.target.value]);
    } else {
      setAllSize(allsize.filter((item) => item !== e.target.value));
    }
  }

  const [editProduct, { data: dateEdit }] = useMutation(EDIT_PRODUCT, {
    onCompleted: () => {
      refetch();
      setUpdateProductId("");
      setAllcolor([]);
      setProductName("");
      setPreviewName("");
      setCategoryName("");
      setDiscount("");
      setSellingPrice("");
      setGender([]);
      setAllSize([]);
      setDescription("");
      setGST("");
    },
  });

  const handleEdit = async (
    id,
    productName,
    priveiwName,
    sellingPrice,
    size,
    color,
    discount,
    gender,
    description,
    gst,
    catName
  ) => {
    showModal(true);
    setUpdateProductId(id);
    setAllcolor(color);
    setProductName(productName);
    setPreviewName(priveiwName);
    setCategoryName(catName);
    setDiscount(discount);
    setSellingPrice(sellingPrice);
    setGender(gender);
    setAllSize(size);
    setDescription(description);
    setGST(gst);
  };

  const ConfirmUpdate = async () => {
    await editProduct({
      variables: {
        updateProductId: updateProductId,
        productName: productName,
        priveiwName: previewName,
        size: allsize,
        color: allcolor,
        categoryName,
        gender,
        sellingPrice: parseFloat(sellingPrice),
        discount: parseFloat(discount),
        gst: parseFloat(gst),
        description: description,
      },
    });
    showModal(false);
  };

  // productImages: images,
  // stock: parseInt(stock),

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

  return (
    <>
      <Row className="mx-auto my-5">
        <Col className="ms-0">
          <Card className="ms-0">
            <Card.Body className="ms-0">
              <h2>Table of Product List</h2>
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
                    <th>Product Preview Name</th>
                    <th>Category Name</th>
                    <th>Selling Price</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>Gender</th>
                    <th>Discount</th>
                    <th>Description</th>
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
                          <td> {item.priveiwName} </td>
                          <td> {item.categoryName} </td>
                          <td> {item.sellingPrice} </td>
                          <td> {item.size.join(", ")} </td>
                          <td> {item.color.join(", ")} </td>
                          <td> {item.gender.join(", ")} </td>
                          <td> {item.discount} </td>
                          <td> {item.description} </td>
                          <td>
                            <Button
                              className="btn btn-sm btn-light"
                              onClick={() =>
                                handleEdit(
                                  item.id,
                                  item.productName,
                                  item.priveiwName,
                                  item.sellingPrice,
                                  item.size,
                                  item.color,
                                  item.discount,
                                  item.gender,
                                  item.description,
                                  item.gst,
                                  item.categoryName
                                )
                              }
                            >
                              <Pencil size={20} color="black" />
                            </Button>{" "}
                            <Button
                              className="btn btn-sm btn-light"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash size={20} color="black" />
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
        show={modal}
        onHide={() => showModal(false)}
        scrollable
        dialogClassName="full"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Edit Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="my-1">
            <Form.Label>Product Full Name</Form.Label>
            <Form.Control
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="my-1">
            <Form.Label>Product Preview Name</Form.Label>
            <Form.Control
              type="text"
              value={previewName}
              onChange={(e) => setPreviewName(e.target.value)}
            />
          </Form.Group>

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
          <Form.Group className="my-1">
            <Form.Label>Product Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={(e) => setImages(e.target.files[0])}
            />
          </Form.Group>

          <Form.Group className="my-1">
            <Form.Label>Discount</Form.Label>
            <Form.Control
              type="text"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </Form.Group>

          {/* <Form.Group  className="my-1">
                <Form.Label>Stock</Form.Label>
                <Form.Control type="text" value={stock} onChange={(e) => setStock(e.target.value)} />
              </Form.Group> */}

          <Form.Group className="my-1">
            <Form.Label>Selling Price</Form.Label>
            <Form.Control
              type="text"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="my-1">
            <Form.Label>GST</Form.Label>
            <Form.Control
              type="text"
              value={gst}
              onChange={(e) => setGST(e.target.value)}
            />
          </Form.Group>

          {/* <div className="mt-3">
                <Form.Group  className="my-1">
                  <Form.Label>Gender : </Form.Label>
                  <input className="mx-1" value="Men" type="checkbox" onChange={handleGenderChange} />
                  <span>Men</span>

                  <input className="mx-1" value="Women" type="checkbox" onChange={handleGenderChange} />
                  <span>Women</span>

                </Form.Group>

              </div> */}

          <Form.Group className="my-1">
            <Form.Label>Gender: </Form.Label>
            {genderData &&
              genderData?.getAllGender?.map((g) => (
                <div key={g} className="d-inline">
                  <input
                    className="mx-1"
                    value={g?.genderName}
                    type="checkbox"
                    checked={gender.includes(g?.genderName)}
                    onChange={handleGenderChange}
                  />
                  <span>{g?.genderName}</span>{" "}
                </div>
              ))}
          </Form.Group>

          <Form.Group className="my-1">
            <Form.Label>Color : </Form.Label>
            {/* <Select options={options} /> */}
            {color?.getAllColor &&
              color?.getAllColor?.map((colors) => (
                <div key={colors.id} className="d-inline">
                  <input
                    className="mx-1"
                    value={colors?.colorName}
                    type="checkbox"
                    checked={allcolor.includes(colors?.colorName)}
                    // checked={allcolor.find(item => item === colors?.colorName)}
                    onChange={handleColorBox}
                  />
                  <span>{colors?.colorName}</span>{" "}
                </div>
              ))}
          </Form.Group>
          <Form.Group className="my-1">
            <Form.Label>Size: </Form.Label>
            {sizedata?.getAllSize &&
              sizedata?.getAllSize?.map((size) => (
                <div key={size.id} className="d-inline">
                  <input
                    className="mx-1"
                    value={size?.sizeName}
                    type="checkbox"
                    checked={allsize.includes(size?.sizeName)}
                    onChange={handleSizeChange}
                  />
                  <span>{size?.sizeName}</span>{" "}
                </div>
              ))}
          </Form.Group>

          {/* <Form.Group  className="my-1">
                <Form.Label>size : </Form.Label>
                <input className="mx-1" value="Small" type="checkbox" onChange={handleSizeChange} />
                <span>Small</span>
                <input className="mx-1" value="Medium" type="checkbox" onChange={handleSizeChange} />
                <span>Medium </span>
                <input className="mx-1" value="Large" type="checkbox" onChange={handleSizeChange} />
                <span>Large</span>
                <input className="mx-1" value="X-Large" type="checkbox" onChange={handleSizeChange} />
                <span>X-Large</span>
              </Form.Group> */}

          <Form.Group className="my-1">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="success"
            type="submit"
            className="mt-2"
            onClick={() => ConfirmUpdate()}
          >
            Save Changes
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ListProduct;
