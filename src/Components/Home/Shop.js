import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import Header from "../Sections/Header/Header";
import { useNavigate, Link } from "react-router-dom";
import { Button, Col, Container, Offcanvas, Row, Stack } from "react-bootstrap";
import { Sliders, Toggles2 } from "react-bootstrap-icons";

const GET_ALL_PRODUCT = gql`
  query GetAllProducts {
    getAllProducts {
      id
      color
      description
      discount
      gender
      gst
      categoryName
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
function Shop() {
  // GETTING DATA
  const [show, setShow] = useState(false);
  const [hoverImage, setHoverImage] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [filteredProduct, setFilteredProduct] = useState([]);

  const {
    data: product,
    refetch,
    loading: productLoading,
  } = useQuery(GET_ALL_PRODUCT);
  const { data: categories, loading: categoriesLoading } =
    useQuery(GET_ALL_CATEGORIES);

  useEffect(() => {
    if (product?.getAllProducts) {
      setFilteredProduct(product?.getAllProducts);
    }
  }, [product]);

  const filterProductByCategory = (category) => {
    const filteredItems = product?.getAllProducts?.filter((item) =>
      item.categoryName?.toLowerCase().includes(category.toLowerCase())
    );
    if (filteredItems.length > 0) {
      setFilteredProduct(filteredItems);
    }
  };

  return (
    <>
      <section className="slider">
        <Container fluid>
          <div className="filter-head" style={{ display: "none" }}>
            <Stack
              direction="horizontal"
              gap={2}
              style={{ justifyContent: "center", alignItems: "start" }}
            >
              <div>
                <Button
                  variant="primary"
                  onClick={handleShow}
                  style={{
                    background: "transparent",
                    color: "#000000",
                    border: "1px solid #000000",
                  }}
                >
                  <Sliders />
                </Button>

                <Offcanvas show={show} onHide={handleClose}>
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filter</Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <div className="d-flex flex-column">
                      <Col
                        style={{
                          borderBottom: "1px solid #f1f1f1",
                          paddingBottom: "5px",
                          marginBottom: "5px",
                        }}
                      >
                        <Button
                          variant="light"
                          style={{
                            textDecoration: "none",
                            background: "transparent",
                            fontFamily:
                              "Neue-Helvetica, Helvetica, Arial, sans-serif",
                            letterSpacing: "1px",
                            textTransform: "capitalize",
                            color: "#000000",
                          }}
                          className="btn cat-btn"
                          onClick={() => {
                            setFilteredProduct(product?.getAllProducts);
                            handleClose();
                          }}
                        >
                          All Products
                        </Button>
                      </Col>

                      {categories &&
                        categories?.getAllCategory
                          ?.slice(0)
                          .reverse()
                          .map((data, index) => {
                            return (
                              <Col
                                key={index}
                                style={{
                                  borderBottom: "1px solid #f1f1f1",
                                  paddingBottom: "5px",
                                  marginBottom: "5px",
                                }}
                              >
                                <Button
                                  variant="light"
                                  style={{
                                    textDecoration: "none",
                                    background: "transparent",
                                    fontFamily:
                                      "Neue-Helvetica, Helvetica, Arial, sans-serif",
                                    letterSpacing: "1px",
                                    textTransform: "capitalize",
                                    color: "#000000",
                                  }}
                                  className="btn cat-btn"
                                  onClick={() => {
                                    filterProductByCategory(data.categoryName);
                                    handleClose();
                                  }}
                                >
                                  {data.categoryName}
                                </Button>
                              </Col>
                            );
                          })}
                    </div>
                  </Offcanvas.Body>
                </Offcanvas>
              </div>
              <h1 className="text-center mb-5">All Products</h1>
            </Stack>
          </div>
          <div className="all-heading">
            <h1 className="text-center mb-5">All Products</h1>
          </div>
          <Row>
            {productLoading || categoriesLoading ? (
              <Col>
                <p className="text-center fs-1">Loading... </p>
              </Col>
            ) : (
              <>
                <Col sm={3} className="filter-column">
                  <div className="d-flex flex-column">
                    <Col
                      style={{
                        borderBottom: "1px solid #f1f1f1",
                        paddingBottom: "5px",
                        marginBottom: "5px",
                      }}
                    >
                      <Button
                        variant="light"
                        style={{
                          textDecoration: "none",
                          background: "transparent",
                          fontFamily:
                            "Neue-Helvetica, Helvetica, Arial, sans-serif",
                          letterSpacing: "1px",
                          textTransform: "capitalize",
                          color: "#000000",
                        }}
                        className="btn cat-btn"
                        onClick={() =>
                          setFilteredProduct(product?.getAllProducts)
                        }
                      >
                        All Products
                      </Button>
                    </Col>
                    {categories &&
                      categories?.getAllCategory
                        ?.slice(0)
                        .reverse()
                        .map((data, index) => {
                          return (
                            <Col
                              key={index}
                              style={{
                                borderBottom: "1px solid #f1f1f1",
                                paddingBottom: "5px",
                                marginBottom: "5px",
                              }}
                            >
                              <Button
                                variant="light"
                                style={{
                                  textDecoration: "none",
                                  background: "transparent",
                                  fontFamily:
                                    "Neue-Helvetica, Helvetica, Arial, sans-serif",
                                  letterSpacing: "1px",
                                  textTransform: "capitalize",
                                  color: "#000000",
                                }}
                                className="btn cat-btn"
                                onClick={() =>
                                  filterProductByCategory(data.categoryName)
                                }
                              >
                                {data.categoryName}
                              </Button>
                            </Col>
                          );
                        })}
                  </div>
                </Col>
                <Col sm={9}>
                  <Row>
                    {product &&
                      product?.getAllProducts &&
                      filteredProduct
                        ?.slice(0)
                        .reverse()
                        .map((data, index) => {
                          return (
                            <Col
                              key={data.id}
                              lg={3}
                              md={4}
                              sm={6}
                              xs={6}
                              style={{ textAlign: "center" }}
                              onMouseEnter={() => setHoverImage(index)}
                              onMouseLeave={() => setHoverImage(null)}
                            >
                              <Link
                                to={`/shop/product/${data.id}`}
                                className="stretched-link"
                              >
                                {" "}
                              </Link>
                              <div className="flexslider">
                                <img
                                  style={{
                                    width: "100%",
                                    height: "300px",
                                    objectFit: "cover",
                                  }}
                                  src={
                                    hoverImage === index
                                      ? data?.images[0]?.imagePath[1] ||
                                        data?.images[0]?.imagePath[0]
                                      : data?.images[0]?.imagePath[0]
                                  }
                                  // src={data?.images[0]?.imagePath[0]}
                                  alt="products"
                                />
                                <div className="text-center">
                                  <h6
                                    className="text-center text-black"
                                    style={{
                                      padding: "2px 0px",
                                      marginBottom: "0px",
                                      fontFamily:
                                        "Neue-Helvetica, Helvetica, Arial, sans-serif",
                                      letterSpacing: "1px",
                                    }}
                                  >
                                    {data.productName}
                                  </h6>
                                  <div>
                                    <h6
                                      style={{
                                        fontFamily:
                                          "Neue-Helvetica, Helvetica, Arial, sans-serif",
                                      }}
                                      className="text-center"
                                    >
                                      ₹ {data.sellingPrice}
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          );
                        })}
                  </Row>
                </Col>
              </>
            )}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Shop;
