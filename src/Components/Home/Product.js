import React, { useEffect, useState } from "react";
import "./Product.css";
import { Col, Tab, Tabs, Row, Container, Stack } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, gql, useMutation, useLazyQuery } from "@apollo/client";
import toast from "react-hot-toast";
import { Globe2, Instagram, Whatsapp, Youtube } from "react-bootstrap-icons";
import CartPop from "./CartSection/CartPop";
import Magnifier from "react-magnifier";
const GET_PRODUCT_BY_CATEGORY = gql`
  query GetProductByCat($categoryName: String) {
    getProductByCat(categoryName: $categoryName) {
      id
      categoryName
      productName
      images {
        imagePath
      }
      sellingPrice
    }
  }
`;
function Product() {
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("token");
  const [loggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [token]);

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const [editModal, setEditModal] = useState(false);

  const GET_PRODUCT = gql`
    query GetProduct($getProductId: ID) {
      getProduct(id: $getProductId) {
        id
        productName
        categoryName
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

  const { data: product, loading } = useQuery(GET_PRODUCT, {
    variables: {
      getProductId: id,
    },
  });

  const [GetProductByCat, { data: productsByCategory }] = useLazyQuery(
    GET_PRODUCT_BY_CATEGORY
  );

  useEffect(() => {
    GetProductByCat({
      variables: {
        categoryName: product?.getProduct?.categoryName,
      },
    });
  }, [GetProductByCat, product]);

  const [discount, setDiscount] = useState(product?.getProduct?.discount);
  const [sellingPrice, setSellingPrice] = useState(
    product?.getProduct?.sellingPrice
  );

  useEffect(() => {
    setDiscount(product?.getProduct?.discount);
    if (product?.getProduct?.discount > 0) {
      const tempDiscountedPrice =
        ((100 - product?.getProduct?.discount) *
          product?.getProduct?.sellingPrice) /
        100;
      setSellingPrice(tempDiscountedPrice);
    } else {
      setSellingPrice(product?.getProduct?.sellingPrice);
    }
  }, [product]);

  // ADD TO CART
  const [img, setImg] = useState("");
  const [size, setSize] = useState(product?.getProduct?.size[0]);
  const [color, setColor] = useState(product?.getProduct?.color[0]);
  const [gender, setGender] = useState(product?.getProduct?.gender[0]);
  const [imageArray, setImageArray] = useState(
    product?.getProduct?.images[0]?.imagePath
  );
  const [len, setLen] = useState(10);

  useEffect(() => {
    setLen(imageArray?.length);
  }, [imageArray]);

  const StockTemp = product?.getProduct?.stock?.filter(
    (s) => s?.color === color && s?.gender === gender && s?.size === size
  );

  const [showStock, setShowStock] = useState(1);
  useEffect(() => {
    if (StockTemp) {
      setShowStock(StockTemp[0]?.quantity);
    }
  }, [StockTemp]);

  useEffect(() => {
    if (product?.getProduct?.images[0]?.imagePath) {
      setImageArray(product?.getProduct?.images[0]?.imagePath);
    }
  }, [product?.getProduct?.images[0]?.imagePath]);

  useEffect(() => {
    if (product?.getProduct?.size[0]) {
      setSize(product?.getProduct?.size[0]);
    }
  }, [product?.getProduct?.size[0]]);

  useEffect(() => {
    if (product?.getProduct?.gender[0]) {
      setGender(product?.getProduct?.gender[0]);
    }
  }, [product?.getProduct?.gender[0]]);

  useEffect(() => {
    if (product?.getProduct?.color[0]) {
      setColor(product?.getProduct?.color[0]);
    }
  }, [product?.getProduct?.color[0]]);

  const ADD_TO_CART = gql`
    mutation AddToCart(
      $productId: ID!
      $color: String
      $gender: String
      $size: String
      $quantity: Int!
    ) {
      addToCart(
        productId: $productId
        color: $color
        gender: $gender
        size: $size
        quantity: $quantity
      ) {
        _id
        cartProducts {
          productId {
            id
          }
          color
          gender
          size
          quantity
        }
      }
    }
  `;

  const [addToCart, { data }] = useMutation(ADD_TO_CART, {
    onCompleted: () => {
      toast.success("Product Added Successfully in cart");
      setEditModal(true);
    },
    onError: (error) => {
      if (error.message === "TokenExpiredError: jwt expired") {
        navigate("/login");
        toast.error("Error Occured, Login and try Again");
      }
      console.error("ERROR: ", error.message);
    },
  });

  // console.log("dataaaaaa", data)

  // get use login status

  const handleAddToCart = async (id) => {
    if (loggedIn) {
      await addToCart({
        variables: {
          productId: id,
          quantity: 1,
          size: size,
          gender: gender,
          color: color,
        },
      });
    } else {
      navigate("/login");
    }
  };

  // Wishlist
  const ADD_TO_WISHLIST = gql`
    mutation Mutation($productId: ID!) {
      createWishlist(productId: $productId) {
        wishlistProducts {
          productId {
            productName
            priveiwName
            id
          }
        }
      }
    }
  `;

  const [createWishlist, { data: wishlistData }] = useMutation(
    ADD_TO_WISHLIST,
    {
      onCompleted: () => {
        toast.success("Added to Wishlist");
      },
      onError: (error) => {
        console.error(error.message);
        if (error.message === "jwt expired") {
          navigate("/login");
          toast.error("Login and TRY AGAIN!");
        } else if (error.message === "Failed to add product to wishlist") {
          toast("Product Already in Wishlist");
        }
      },
    }
  );

  const handleAddToWishlist = async (id) => {
    createWishlist({
      variables: {
        productId: id,
      },
    });
  };

  const changeImage = (path) => {
    setImg(path);
  };

  const handleCartColor = (colour) => {
    setColor(colour);
  };
  const handleCartSize = (val) => {
    setSize(val);
  };

  const handleCartGender = (gen) => {
    setGender(gen);
  };

  const handleSizeArray = (arr) => {
    setImageArray(arr);
  };

  // Style when Color is selected
  const [select, setSelect] = useState(0);

  const colorSelectedStyle = {
    border: "1px solid black",
    backgroundColor: "black",
    color: "white",
  };

  const colorNotSelectedStyle = {
    border: "1px solid black",
  };

  const handleSelection = (id) => {
    setSelect(id);
  };

  // Style when Size is Selected
  const [sizeSel, setSizeSel] = useState(0);

  const handleSizeSeletion = (id) => {
    setSizeSel(id);
  };

  const sizeSelectedStyle = {
    border: "1px solid black",
    backgroundColor: "black",
    color: "white",
  };

  const sizeNotSelectedStyle = {
    border: "1px solid black",
  };

  // Style when Gender is selected
  const [genSel, setGenSel] = useState(0);

  const handleGenderSeletion = (id) => {
    setGenSel(id);
  };

  const genderSelectedStyle = {
    border: "1px solid black",
    backgroundColor: "black",
    color: "white",
  };

  const genderNotSelectedStyle = {
    border: "1px solid black",
  };

  const handleSumDrama = async (x) => {
    const s = product?.getProduct?.images?.filter(
      (img) => img?.color === x && img?.gender === gender
    );
    handleSizeArray(s[0]?.imagePath);
    changeImage(s[0]?.imagePath[0]);

    // setGender(s[0]?.gender);
    setColor(x);
  };

  const handleGenderDrama = (g) => {
    const s = product?.getProduct?.images?.filter(
      (img) => img?.color === color && img?.gender === g
    );

    handleSizeArray(s[0]?.imagePath);
    changeImage(s[0]?.imagePath[0]);

    setGender(g);
    // setColor(s[0]?.color);
  };

  const [selImageId, setSelImageId] = useState("");

  const imageBorder = {
    border: "2.5px solid black",
    objectFit: "contain",
    height: "100px",
    width: "75px",
  };

  const noBorder = {
    objectFit: "contain",
    height: "100px",
    width: "75px",
    //aspectRatio: "3:4"
  };

  const handleImageSelectedForDisplay = (id) => {
    setSelImageId(id);
  };

  useEffect(() => {
    const stock = product?.getProduct?.stock?.filter(
      (s) => s?.color === color && s?.gender === gender && s?.size === size
    );
    if (stock) {
      setShowStock(stock[0]?.quantity);
    }
  }, [color, size, gender]);

  const [first, setFirst] = useState(0);
  const [last, setLast] = useState(6);
  // console.log("first", first);
  // console.log("last", last);

  return (
    <>
      <CartPop show={editModal} onHide={() => setEditModal(false)} />
      <section className="product-details">
        <Container fluid>
          <Row style={{ paddingTop: "2%" }}>
            <Col lg={6} md={6} sm={12} xs={12}>
              <div className="main-div d-flex justify-content-center mt-0 pt-0">
                <Col lg={2} md={2} sm={2} xs={4} className="c-1 mx-1">
                  <div
                    className="mt-0"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-evenly",
                      cursor: "pointer",
                    }}
                  >
                    {imageArray &&
                      imageArray?.map(
                        (image, index) =>
                          index >= first &&
                          index < last && (
                            <div
                              key={index}
                              className="mt-0"
                              onClick={() => {
                                changeImage(image);
                                handleImageSelectedForDisplay(index);
                              }}
                            >
                              {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                              <img
                                src={image}
                                className="my-1"
                                alt="Image"
                                style={
                                  selImageId === index ? imageBorder : noBorder
                                }
                              />
                            </div>
                          )
                      )}
                  </div>
                </Col>
                <Col
                  lg={10}
                  md={10}
                  sm={10}
                  xs={8}
                  className="image-container c-2 mx-1"
                  onMouseMove={handleMouseMove}
                >
                  {loading ||
                    img ||
                    product?.getProduct?.images[0]?.imagePath[0] ? (
                    /*<img
                      className="b-img"
                      src={img || product?.getProduct?.images[0]?.imagePath[0]}
                      alt="Selected"
                      style={{
                        transformOrigin: `${cursorPosition.x}px ${cursorPosition.y}px`,
                        width: "100%",
                      }}
                    />*/

                    <Magnifier src={img || product?.getProduct?.images[0]?.imagePath[0]} mgShape="square" zoomFactor={1.7} />
                  ) : (
                    <img
                      className="b-img"
                      src="/static/media/logo-TRP.bf17306b0f4547419fd6.jpg"
                      alt="Selected"
                      style={{
                        transformOrigin: `${cursorPosition.x}px ${cursorPosition.y}px`,
                      }}
                    />
                  )}
                </Col>
              </div>
            </Col>

            <Col lg={6} md={6} sm={12} xs={12} className="detail-products">
              <h1>{product?.getProduct?.productName}</h1>
              {product?.getProduct?.discount > 0 ? (
                <h3>
                  <del> ₹ {product?.getProduct?.sellingPrice}</del> ₹{" "}
                  {sellingPrice}
                </h3>
              ) : (
                <h3> ₹ {product?.getProduct?.sellingPrice}</h3>
              )}
              <p className="text-disable">Tax included.</p>
              <hr />
              <h6 className="fw-bold mx-2 text-left"> Colour </h6>
              <div
                className="ms-0 d-flex flex-wrap"
                style={{ cursor: "pointer" }}
              >
                {product?.getProduct &&
                  product?.getProduct?.color.map((color, index) => (
                    <div
                      key={color}
                      onClick={() => {
                        handleSumDrama(color);
                        handleSelection(index);
                      }}
                      className="mx-2 my-2 px-3 py-2 hoverable"
                      style={
                        select === index
                          ? colorSelectedStyle
                          : colorNotSelectedStyle
                      }
                    >
                      {color}
                    </div>
                  ))}
              </div>
              <h6 className="fw-bold mx-2 text-left">Gender</h6>
              <div
                className="ms-0 d-flex flex-wrap"
                style={{ cursor: "pointer" }}
              >
                {product?.getProduct &&
                  product?.getProduct?.gender.map((gender, index) => (
                    <div
                      key={gender}
                      style={
                        genSel === index
                          ? genderSelectedStyle
                          : genderNotSelectedStyle
                      }
                      onClick={() => {
                        handleGenderSeletion(index);
                        handleGenderDrama(gender);
                      }}
                      className="mx-2 my-2 px-3 py-2 hoverable"
                    >
                      {" "}
                      {gender}{" "}
                    </div>
                  ))}
              </div>

              <h6 className="fw-bold mx-2 text-left">Size</h6>
              <div
                className="ms-0 d-flex flex-wrap"
                style={{ cursor: "pointer" }}
              >
                {product?.getProduct &&
                  product?.getProduct?.size.map((size, index) => (
                    <div
                      style={
                        sizeSel === index
                          ? sizeSelectedStyle
                          : sizeNotSelectedStyle
                      }
                      onClick={() => {
                        handleCartSize(size);
                        handleSizeSeletion(index);
                      }}
                      key={size}
                      className="mx-2 my-2 px-3 py-2 hoverable"
                    >
                      {size}
                    </div>
                  ))}
              </div>

              <Stack
                direction="horizontal"
                gap={2}
                style={{ paddingTop: "5px", cursor: "pointer" }}
              >
                <Globe2 color="black" size={26} className="mx-2 mt-2 mb-2" />
                <div>Worldwide Shipping</div>
              </Stack>
              <br />
              <div
                className="mx-2  d-flex align-items-flexstart"
                style={{ cursor: "pointer" }}
              >
                <svg height={20} width={20}>
                  <circle
                    cx={10}
                    cy={10}
                    r={8}
                    stroke="green"
                    strokeWidth={3}
                    fill="green"
                  />
                </svg>
                <p style={{ paddingLeft: 13, marginTop: "-3px" }}>
                  {" "}
                  Stock: {showStock}
                </p>
              </div>
              <br />
              <div className="d-flex justify-content-center">
                <button
                  className="button  d-flex justify-content-evenly"
                  onClick={() => handleAddToCart(product?.getProduct?.id)}
                >
                  <a href="#" className="text-center">
                    Add to Cart
                  </a>
                  <a href="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      fill="currentColor"
                      className="bi bi-arrow-right"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                      />
                    </svg>
                  </a>
                </button>
              </div>
              <br />
              <div className="d-flex justify-content-center">
                <button
                  className="button  d-flex justify-content-evenly"
                  onClick={() => handleAddToWishlist(product?.getProduct?.id)}
                >
                  <a href="#" className="text-center">
                    Add to Wishlist
                  </a>
                  <a href="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      fill="currentColor"
                      className="bi bi-arrow-right"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                      />
                    </svg>
                  </a>
                </button>
              </div>
              <br />
              <Tabs>
                {/* <Tab
                  eventKey="measurement"
                  title="Measurement"
                  className="my-3"
                >
                  <h6 className="fw-bold mx-2 my-3 text-left">Free Size :</h6>
                  <ul>
                    <li
                      style={{ fontWeight: "bold", textAlign: "left" }}
                      className="my-2"
                    >
                      {" "}
                      Waist : 26" - 48" (Full Elasticated Waist with tightening
                      lace)
                    </li>

                    <li
                      style={{ fontWeight: "bold", textAlign: "left" }}
                      className="my-2"
                    >
                      Height : 40"
                    </li>
                  </ul>
                  <h6 className="fw-bold mx-2 my-3 text-left">Medium :</h6>
                  <ul>
                    <li
                      style={{ fontWeight: "bold", textAlign: "left" }}
                      className="my-2"
                    >
                      {" "}
                      Waist : 26" - 48" (Full Elasticated Waist with tightening
                      lace)
                    </li>

                    <li
                      style={{ fontWeight: "bold", textAlign: "left" }}
                      className="my-2"
                    >
                      Height : 40"
                    </li>
                  </ul>
                  <h6 className="fw-bold mx-2 my-3 text-left">Features :</h6>
                  <ul>
                    <li
                      style={{ fontWeight: "bold", textAlign: "left" }}
                      className="my-2"
                    >
                      Finest Long Staple 100% cotton
                    </li>
                    <li
                      style={{ fontWeight: "bold", textAlign: "left" }}
                      className="my-2"
                    >
                      Super Sized Pocket
                    </li>
                    <li
                      style={{ fontWeight: "bold", textAlign: "left" }}
                      className="my-2"
                    >
                      High quality Skin safe colours
                    </li>
                  </ul>
                </Tab> */}
                <Tab eventKey="description" title="Description">
                  <div
                    className="my-3"
                    style={{ fontWeight: "bold", textAlign: "left" }}
                  >
                    {product?.getProduct?.description}
                  </div>
                </Tab>
                <Tab eventKey="size" title="Size">
                  <h6 className="fw-bold mx-2 text-left">Features :</h6>
                  <ul>
                    <li style={{ fontWeight: "bold", textAlign: "left" }}>
                      Finest Long Staple 100% cotton
                    </li>
                    <li style={{ fontWeight: "bold", textAlign: "left" }}>
                      Super Sized Pocket
                    </li>
                    <li style={{ fontWeight: "bold", textAlign: "left" }}>
                      High quality Skin safe colours
                    </li>
                  </ul>
                </Tab>
              </Tabs>
              <hr />
              <b>
                <div className="d-flex" style={{ cursor: "pointer" }}>
                  <Link
                    to={`https://instagram.com/asemble_trp?igshid=MzMyNGUyNmU2YQ%3D%3D&utm_source=qr`}
                    target="_blank"
                    style={{ textDecoration: "none", color: "#000000" }}
                  >
                    <div
                      className="d-flex align-items-center flex-wrap"
                      style={{ paddingRight: 21 }}
                    >
                      <Instagram size={22} />
                      <p style={{ paddingLeft: 6, paddingTop: 15 }}>
                        Instagram
                      </p>
                    </div>
                  </Link>
                  <Link
                    to={`https://wa.me/918829999060?text=`}
                    target="_blank"
                    style={{ textDecoration: "none", color: "#000000" }}
                  >
                    <div
                      className="d-flex align-items-center flex-wrap"
                      style={{ paddingRight: 21 }}
                    >
                      <Whatsapp size={22} />
                      <p style={{ paddingLeft: 6, paddingTop: 15 }}>Whatsapp</p>
                    </div>
                  </Link>
                  <Link
                    to={`https://www.youtube.com/@trp_fits_official`}
                    target="_blank"
                    style={{ textDecoration: "none", color: "#000000" }}
                  >
                    <div
                      className="d-flex align-items-center flex-wrap"
                      style={{ paddingRight: 21 }}
                    >
                      <Youtube size={22} />
                      <p style={{ paddingLeft: 6, paddingTop: 15 }}>Youtube</p>
                    </div>
                  </Link>
                </div>
              </b>
            </Col>
          </Row>
        </Container>
      </section>
      <hr />
      <b></b>
      {/* You may also like section */}
      <section className="slider">
        <Container>
          <h1 className="text-center mb-5">You may also like</h1>
          <Row>
            {productsByCategory?.getProductByCat
              .filter((item) => item.id !== product?.getProduct?.id)
              .map((item) => (
                <Col
                  lg={3}
                  md={4}
                  sm={6}
                  xs={6}
                  style={{ textAlign: "center" }}
                >
                  <Link
                    // to={`/shop/product`}
                    to={`/shop/product/${item.id}`}
                    target="_blank"
                    className="stretched-link"
                  >
                    {" "}
                  </Link>
                  <div className="flexslider">
                    <img
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      // src="/assets/img/1.jpg"
                      src={item?.images[0]?.imagePath[0]}
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
                        {item.productName}
                      </h6>
                      <div>
                        <h6
                          style={{
                            fontFamily:
                              "Neue-Helvetica, Helvetica, Arial, sans-serif",
                          }}
                          className="text-center"
                        >
                          {/* <del> ₹3,000</del> ₹1999 */}₹ {item.sellingPrice}
                        </h6>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
          </Row>
        </Container>
      </section>
      {/* Recently Viewed */}
      {/* <section>
        <div className="container" id="container-last">
          <h4>
            <b className="text-start">Recently Viewed</b>
          </h4>
          <div className="row">
            <div className="col-lg-2 col-md-3 col-md-6 d-flex flex-column align-items-center">
              <div className="d-flex ">
                <img
                  style={{
                    objectFit: "contain",
                    borderRadius: 16,
                    position: "relative",
                  }}
                  src="/assets/img/TheVeshtiCompanyHaremPants1_medium.avif"
                  alt=""
                />
                <p
                  style={{
                    color: "white",
                    background: "#b77b12",
                    borderRadius: "50%",
                    marginLeft: "-30px",
                    zIndex: 0,
                    height: 50,
                    display: "flex",
                    alignItems: "center",
                    fontSize: "15px",
                    fontWeight: "bold",
                    padding: "0px 10px",
                    marginTop: "-10px",
                  }}
                >
                  33%
                </p>
              </div>
              <p
                style={{ paddingTop: 6, marginLeft: "-14px", marginBottom: 0 }}
              >
                <b>Terra Fragments</b>
              </p>
              <p
                style={{
                  marginLeft: "-14px",
                  marginBottom: 0,
                  fontWeight: "normal",
                  fontSize: "large",
                }}
              >
                ₹1,999.00
              </p>
              <select
                name=""
                id=""
                style={{
                  border: "3px solid whitesmoke",
                  height: 50,
                  width: "80%",
                  color: "rgba(0, 0, 0, 0.6)",
                  boxShadow: "1px 1px  rgba(0, 0, 0, 0.5)",
                }}
              >
                <option value="black">Black-Beige / Men / Free Size</option>
                <option value="black">Black-Beige / Women / Free Size</option>
                <option value="black">Brown / Men / Free Size</option>
                <option value="black">Brown / Women / Free Size</option>
                <option value="black">Blue / Men / Free Size</option>
                <option value="black">Blue / Women / Free Size</option>
                <option value="black">Orange / Men / Free Size</option>
                <option value="black">Orange / Women / Free Size</option>
                <option value="black">Red / Men / Free Size</option>
                <option value="black">Red / Women / Free Size</option>
              </select>{" "}
              <br />
              <Button
                style={{
                  border: "1px solid rgb(28, 29, 29)",
                  backgroundColor: " rgb(255, 255, 255)",
                  color: "rgb(28, 29, 29) !important",
                  fontFamily: "ITC Avant Garde Gothic, sans- serif",
                  boxShadow: "none",
                  position: "relative",
                  padding: "8px 28px",
                }}
                variant="outline-dark"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
}

export default Product;
