import React, { useEffect, useState } from 'react';
import './Product.css';
import { Button, Col, Tab, TabContainer, TabContent, Tabs, Row, Container, Stack } from 'react-bootstrap';
import Header from '../Sections/Header/Header';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, gql, useMutation } from '@apollo/client';
import toast from "react-hot-toast";
import { Heart, Cart, ArrowDownSquare, ArrowUpSquareFill, ArrowUpSquare, CaretUpFill, CaretDownFill, Map, Globe, Globe2 } from 'react-bootstrap-icons';
import CartPop from './CartSection/CartPop';
import MediaQuery from 'react-responsive';
import Swiper from 'swiper';
import Vert from './Vert';

function Product() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [editModal, setEditModal] = useState(false);

  const GET_PRODUCT = gql`
    query GetProduct($getProductId: ID) {
      getProduct(id: $getProductId) {
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

  const { data: product } = useQuery(GET_PRODUCT, {
    variables: {
      getProductId: id
    }
  });
  console.log("product", product)

  const [discount, setDiscount] = useState(product?.getProduct?.discount);
  const [sellingPrice, setSellingPrice] = useState(product?.getProduct?.sellingPrice);

  useEffect(() => {
    setDiscount(product?.getProduct?.discount);
    if (product?.getProduct?.discount > 0) {
      const tempDiscountedPrice = ((100 - product?.getProduct?.discount) * (product?.getProduct?.sellingPrice)) / 100;
      setSellingPrice(tempDiscountedPrice);
    }
    else {
      setSellingPrice(product?.getProduct?.sellingPrice);
    }

  }, [product]);

  // ADD TO CART 

  const [img, setImg] = useState("");
  const [size, setSize] = useState(product?.getProduct?.size[0]);
  const [color, setColor] = useState(product?.getProduct?.color[0]);
  const [gender, setGender] = useState(product?.getProduct?.gender[0]);
  const [imageArray, setImageArray] = useState(product?.getProduct?.images[0]?.imagePath);
  const [len, setLen] = useState(4);
  // console.log("len", len)

  useEffect(() => {
    console.log("imageArray LENGTH", imageArray?.length);
    setLen(imageArray?.length);
  }, [imageArray]);



  const StockTemp = product?.getProduct?.stock?.filter((s) =>
    s?.color === color && s?.gender === gender && s?.size === size);

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
  mutation AddToCart($productId: ID!, $color: String, $gender: String, $size: String, $quantity: Int!) {
    addToCart(productId: $productId, color: $color, gender: $gender, size: $size, quantity: $quantity) {
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
    }
  });

  console.log("dataaaaaa", data)

  const handleAddToCart = async (id) => {
    console.log("idii", id)
    await addToCart({
      variables: {
        productId: id,
        quantity: 1,
        size: size,
        gender: gender,
        color: color
      }
    });
    setEditModal(true);
  }


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

  const [createWishlist, { data: wishlistData }] = useMutation(ADD_TO_WISHLIST, {
    onCompleted: () => {
      toast.success("Added to Wishlist");
    },
    onError: (error) => {
      console.error(error.message);
      if (error.message === "jwt expired") {
        navigate('/login');
        toast.error("Login and TRY AGAIN!");
      } else if (error.message === "Failed to add product to wishlist") {
        toast("Product Already in Wishlist");
      }
    }
  });

  const handleAddToWishlist = async (id) => {
    createWishlist({
      variables: {
        productId: id
      }
    });
  }

  const changeImage = (path) => {
    setImg(path);
  }

  const handleCartColor = (colour) => {
    setColor(colour);
  }
  const handleCartSize = (val) => {
    setSize(val);
  }

  const handleCartGender = (gen) => {
    setGender(gen);
  }

  const handleSizeArray = (arr) => {
    setImageArray(arr);
  }

  // Style when Color is selected
  const [select, setSelect] = useState(0);

  const colorSelectedStyle = {
    border: "1px solid black",
    backgroundColor: "black",
    color: "white"
  };

  const colorNotSelectedStyle = {
    border: "1px solid black",
  }

  const handleSelection = (id) => {
    setSelect(id);
  }

  // Style when Size is Selected
  const [sizeSel, setSizeSel] = useState(0);

  const handleSizeSeletion = (id) => {
    setSizeSel(id);
  }

  const sizeSelectedStyle = {
    border: "1px solid black",
    backgroundColor: "black",
    color: "white"
  };

  const sizeNotSelectedStyle = {
    border: "1px solid black",
  }

  // Style when Gender is selected
  const [genSel, setGenSel] = useState(0);

  const handleGenderSeletion = (id) => {
    setGenSel(id);
  }

  const genderSelectedStyle = {
    border: "1px solid black",
    backgroundColor: "black",
    color: "white"
  };

  const genderNotSelectedStyle = {
    border: "1px solid black",
  }

  const handleSumDrama = async (x) => {
    const s = product?.getProduct?.images?.filter((img) => img?.color === x && img?.gender === gender);
    handleSizeArray(s[0]?.imagePath);
    changeImage(s[0]?.imagePath[0]);

    setGender(s[0]?.gender);
    setColor(x);
  }

  const handleGenderDrama = (g) => {
    const s = product?.getProduct?.images?.filter((img) => img?.color === color && img?.gender === g);

    handleSizeArray(s[0]?.imagePath);
    changeImage(s[0]?.imagePath[0]);

    setGender(g);
    setColor(s[0]?.color);
  }


  const [selImageId, setSelImageId] = useState("");

  const imageBorder = {
    border: "2.5px solid black",
    objectFit: "contain",
    height: "100px",
    width: "75px"
  }

  const noBorder = {
    objectFit: "contain",
    height: "100px",
    width: "75px"
    //aspectRatio: "3:4"

  }

  const handleImageSelectedForDisplay = (id) => {
    setSelImageId(id);
  }

  useEffect(() => {
    const stock = product?.getProduct?.stock?.filter((s) => s?.color === color && s?.gender === gender
      && s?.size === size);
    if (stock) {
      setShowStock(stock[0]?.quantity);
    }
  }, [color, size, gender]);

  const [first, setFirst] = useState(0);
  const [last, setLast] = useState(4);
  console.log("first", first);
  console.log("last", last);

  return (<>
    <CartPop show={editModal} onHide={() => setEditModal(false)} />
    <section className='product-details'>
      <Container fluid>
        <Row style={{ paddingTop: "2%" }} >
          <Col lg={6} md={6} sm={12} xs={12}>
            <div className="main-div d-flex justify-content-center mt-0 pt-0" style={{ height: "400px" }}>
              <Col lg={4} className='c-1 mx-1'>
                <div className='mt-0' style={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", cursor: "pointer" }} >
                  {imageArray && imageArray?.map((image, index) => index >= first && index < last &&
                    <div key={index} className="mt-0"
                      onClick={() => { changeImage(image); handleImageSelectedForDisplay(index) }}  >
                      <img src={image} className='my-1' alt="Image" style={selImageId === index ? imageBorder : noBorder} />
                    </div>)}
                </div>
              </Col>
              <Col lg={8} className='c-2 mx-1'>
                <img className='b-img' style={{ height: '100%', cursor: "pointer" }} src={img || product?.getProduct?.images[0]?.imagePath[0]} alt="Selected Image" />
              </Col>
            </div>
          </Col>

          <Col lg={6} md={6} sm={12} xs={12}>
            <h1>{product?.getProduct?.productName}</h1>
            {product?.getProduct?.discount > 0 ? <h3>
              <del> ₹  {product?.getProduct?.sellingPrice}</del>
              {" "} ₹ {sellingPrice}
            </h3> : <h3> ₹ {product?.getProduct?.sellingPrice}
            </h3>}
            <p className="text-disable">Tax included.</p>
            <hr />
            <h6 className='fw-bold mx-2 text-left'> Colour </h6>
            <div className='ms-0 d-flex flex-wrap' style={{ cursor: "pointer" }}>
              {product?.getProduct && product?.getProduct?.color.map((color, index) =>
                <div key={color}
                  onClick={() => { handleSumDrama(color); handleSelection(index) }}
                  className='mx-2 my-2 px-3 py-2 hoverable'
                  style={select === index ? colorSelectedStyle : colorNotSelectedStyle} >
                  {color}
                </div>)}
            </div>
            <h6 className='fw-bold mx-2 text-left'>
              Gender
            </h6>
            <div className='ms-0 d-flex flex-wrap' style={{ cursor: "pointer" }}>
              {product?.getProduct && product?.getProduct?.gender.map((gender, index) =>
                <div key={gender}
                  style={genSel === index ? genderSelectedStyle : genderNotSelectedStyle}
                  onClick={() => { handleGenderSeletion(index); handleGenderDrama(gender) }}
                  className='mx-2 my-2 px-3 py-2 hoverable'> {gender} </div>)}
            </div>

            <h6 className='fw-bold mx-2 text-left'>
              Size
            </h6>
            <div className='ms-0 d-flex flex-wrap' style={{ cursor: "pointer" }}>
              {product?.getProduct && product?.getProduct?.size.map((size, index) =>
                <div
                  style={sizeSel === index ? sizeSelectedStyle : sizeNotSelectedStyle}
                  onClick={() => { handleCartSize(size); handleSizeSeletion(index) }}
                  key={size} className='mx-2 my-2 px-3 py-2 hoverable' >
                  {size}
                </div>)}
            </div>

            <Stack direction='horizontal' gap={2} style={{ paddingTop: '5px', cursor: "pointer" }}>
              <Globe2 color='black' size={26} className='mx-2 mt-2 mb-2' />
              <div>Worldwide Shipping</div>
            </Stack>
            <br />
            <div className="mx-2  d-flex align-items-flexstart" style={{ cursor: "pointer" }}>
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
              <button className="button  d-flex justify-content-evenly" onClick={() => handleAddToCart(product?.getProduct?.id)}>
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
              <button className="button  d-flex justify-content-evenly" onClick={() => handleAddToWishlist(product?.getProduct?.id)}>
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
              <Tab eventKey="measurement" title="Measurement" className='my-3'>
                <h6 className='fw-bold mx-2 my-3 text-left'>
                  Free Size :
                </h6>
                <ul>
                  <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'> Waist : 26" - 48" (Full Elasticated Waist with
                    tightening lace)</li>

                  <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'>Height : 40"</li>
                </ul>
                <h6 className='fw-bold mx-2 my-3 text-left'>
                  Medium :
                </h6>
                <ul>
                  <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'> Waist : 26" - 48" (Full Elasticated Waist with
                    tightening lace)</li>

                  <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'>Height : 40"</li>
                </ul>
                <h6 className='fw-bold mx-2 my-3 text-left'>
                  Features :
                </h6>
                <ul>
                  <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'>
                    Finest Long Staple 100% cotton</li>
                  <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'>
                    Super Sized Pocket</li>
                  <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'>
                    High quality Skin safe colours</li>

                </ul>
              </Tab>
              <Tab eventKey="description" title="Description">
                <div className="my-3" style={{ fontWeight: "bold", textAlign: "left" }}>
                  {product?.getProduct?.description}
                </div>
              </Tab>
              <Tab eventKey="size" title="Size">
                <h6 className='fw-bold mx-2 text-left'>
                  Features :
                </h6>
                <ul>
                  <li style={{ fontWeight: "bold", textAlign: "left" }}>
                    Finest Long Staple 100% cotton</li>
                  <li style={{ fontWeight: "bold", textAlign: "left" }}>
                    Super Sized Pocket</li>
                  <li style={{ fontWeight: "bold", textAlign: "left" }}>
                    High quality Skin safe colours</li>
                </ul>
              </Tab>
            </Tabs>
            <hr />
            <b>
              <div className="d-flex" style={{ cursor: "pointer" }}>
                <div
                  className="d-flex align-items-center flex-wrap"
                  style={{ paddingRight: 21 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    fill="currentColor"
                    className="bi bi-facebook"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>{" "}
                  <p style={{ paddingLeft: 6, paddingTop: 15 }}>Share</p>
                </div>
                <div
                  className="d-flex align-items-center flex-wrap"
                  style={{ paddingRight: 21 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    fill="currentColor"
                    className="bi bi-twitter"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                  <p style={{ paddingLeft: 6, paddingTop: 15 }}>Tweet</p>
                </div>
                <div
                  className="d-flex align-items-center flex-wrap"
                  style={{ paddingRight: 21 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    fill="currentColor"
                    className="bi bi-pinterest"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.286-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A8 8 0 1 0 8 0z" />
                  </svg>
                  <p style={{ paddingLeft: 6, paddingTop: 15 }}>Pin It</p>
                </div>
              </div>
            </b>
          </Col>
        </Row>
      </Container>
    </section>

    <hr />

    {/* <div className="container">
    <section className="slider" style={{ paddingTop: "10%" }}>
      <div className="container" id="container">
        <div className="row"> 
          <div className="col-lg-6 col-md-6 col-sm-12"> 
          {(first > 0) && <CaretUpFill size={40} onClick={() => {setLast(last - 1); setFirst(first - 1); setSelImageId(last-1)}} 
          className='ms-3 me-2 mb-0 pb-0' />}
 
            <div className="d-flex justify-content-center flex-row-reverse mt-0 pt-0">
              <div className="image-display">
                <img id="selected-image" src={img || product?.getProduct?.images[0]?.imagePath[0]} alt="Selected Image"/>
              <div />
              </div>
              <div className="variant-options mt-0">
                <div className='mt-0' style={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly" }} >
                {imageArray && imageArray?.map((image, index) =>  index >= first && index < last &&
                  <div key={index} className="variant mt-0" id="act"
                  onClick={() => {changeImage(image); handleImageSelectedForDisplay(index)}}  >
                    <img src={image} alt="Image" style={selImageId === index? imageBorder: noBorder} />
                  </div>)} 
                </div>
              </div>
            </div> 
          {(last < len ) && 
            <CaretDownFill size={40} onClick={() => {setLast(last + 1); setFirst(first + 1);  
            setSelImageId(first+1)}} className='ms-3 me-2 mb-0 pb-0' />}
          </div>

         
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="container">
              <h1>{product?.getProduct?.productName}</h1>
              <br />
              {product?.getProduct?.discount > 0 ? <h3>
                <del> ₹  {product?.getProduct?.sellingPrice}</del>
                {" "} ₹ {sellingPrice}
              </h3>:  <h3> ₹ {product?.getProduct?.sellingPrice}
              </h3>}
             
              <p className="text-disable">Tax included.</p>
              <hr />
              

              <h6 className='fw-bold mx-2 text-left'> Colour </h6>
              <div className='ms-0 d-flex flex-wrap'>
              {product?.getProduct && product?.getProduct?.color.map((color, index) =>
               <div key={color}
               onClick={() => { handleSumDrama(color); handleSelection(index)}}
                className='mx-2 my-2 px-3 py-2 hoverable'  
               style={select === index? colorSelectedStyle: colorNotSelectedStyle} >
              {color}
            </div>)}
            </div>
              <h6 className='fw-bold mx-2 text-left'>
                Gender
              </h6>
              <div className='ms-0 d-flex flex-wrap'>
               {product?.getProduct && product?.getProduct?.gender.map((gender, index) =>
              <div key={gender} 
              style={genSel === index? genderSelectedStyle: genderNotSelectedStyle}
              onClick={() => { handleGenderSeletion(index); handleGenderDrama(gender) }}
                className='mx-2 my-2 px-3 py-2 hoverable'> {gender} </div>)}
              </div>
             
              <h6 className='fw-bold mx-2 text-left'>
                Size
              </h6>
              <div className='ms-0 d-flex flex-wrap'> 
             {product?.getProduct && product?.getProduct?.size.map((size, index) =>
              <div 
              style={sizeSel === index? sizeSelectedStyle: sizeNotSelectedStyle}
               onClick={() => { handleCartSize(size); handleSizeSeletion(index)}} 
                key={size} className='mx-2 my-2 px-3 py-2 hoverable' >
              {size}
            </div>)}
            </div>
             
            </div>
            <br />

            <div className="mx-2 d-flex align-items-center">
              <svg
                style={{ marginRight: 9 }}
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="currentColor"
                className="bi bi-globe"
                viewBox="0 0 16 16"
              >
                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
              </svg>{" "}
              <h6 style={{ paddingTop: 5, color: "rgba(59, 59, 59, 0.8)" }}>
                Worldwide shipping
              </h6>
            </div>
            <br />
            <div className="mx-2  d-flex align-items-flexstart">
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
              <button className="button  d-flex justify-content-evenly" onClick={() => handleAddToCart(product?.getProduct?.id)}>
                <a href="#" className="text-center">
                  Add to cart
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
              <button className="button  d-flex justify-content-evenly" onClick={() => handleAddToWishlist(product?.getProduct?.id)}>
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
            <br />
           
         <Tabs>
          <Tab eventKey="measurement" title="Measurement" className='my-3'>
          <h6 className='fw-bold mx-2 my-3 text-left'>
                Free Size : 
              </h6>
            <ul>
              <li style={{fontWeight: "bold", textAlign: "left"}} className='my-2'> Waist : 26" - 48" (Full Elasticated Waist with
                        tightening lace)</li>
              
              <li style={{fontWeight: "bold", textAlign: "left"}} className='my-2'>Height : 40"</li>
              </ul>
              <h6 className='fw-bold mx-2 my-3 text-left'>
                Medium : 
              </h6>
            <ul>
              <li style={{fontWeight: "bold", textAlign: "left"}} className='my-2'> Waist : 26" - 48" (Full Elasticated Waist with
                        tightening lace)</li>
              
              <li style={{fontWeight: "bold", textAlign: "left"}} className='my-2'>Height : 40"</li>
              </ul>
              <h6 className='fw-bold mx-2 my-3 text-left'>
                Features : 
              </h6>
            <ul>
              <li style={{fontWeight: "bold", textAlign: "left"}} className='my-2'>
                Finest Long Staple 100% cotton</li>
                <li style={{fontWeight: "bold", textAlign: "left"}} className='my-2'>
               Super Sized Pocket</li>
               <li style={{fontWeight: "bold", textAlign: "left"}} className='my-2'>
               High quality Skin safe colours</li>
            
              </ul>
          </Tab>
          <Tab eventKey="description" title="Description">
            <div className="my-3" style={{fontWeight: "bold" , textAlign: "left"}}>
            {product?.getProduct?.description}
            </div>
          </Tab>
          <Tab eventKey="size" title="Size">
          <h6 className='fw-bold mx-2 text-left'>
                Features : 
              </h6>
            <ul>
              <li style={{fontWeight: "bold", textAlign: "left"}}>
                Finest Long Staple 100% cotton</li>
                <li style={{fontWeight: "bold", textAlign: "left"}}>
               Super Sized Pocket</li>
               <li style={{fontWeight: "bold", textAlign: "left"}}>
               High quality Skin safe colours</li>
            </ul>
          </Tab>
         </Tabs>
          <hr />
            <b>
              <div className="d-flex">
                <div
                  className="d-flex align-items-center flex-wrap"
                  style={{ paddingRight: 21 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    fill="currentColor"
                    className="bi bi-facebook"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>{" "}
                  <p style={{ paddingLeft: 6, paddingTop: 15 }}>Share</p>
                </div>
                <div
                  className="d-flex align-items-center flex-wrap"
                  style={{ paddingRight: 21 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    fill="currentColor"
                    className="bi bi-twitter"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                  <p style={{ paddingLeft: 6, paddingTop: 15 }}>Tweet</p>
                </div>
                <div
                  className="d-flex align-items-center flex-wrap"
                  style={{ paddingRight: 21 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    fill="currentColor"
                    className="bi bi-pinterest"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.286-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A8 8 0 1 0 8 0z" />
                  </svg>
                  <p style={{ paddingLeft: 6, paddingTop: 15 }}>Pin It</p>
                </div>
              </div>
            </b>
          </div>
          <b></b>
        </div>
        <b></b>
      </div>
      <b></b>
    </section>
    </div> */}


    {/* <MediaQuery minWidth={769}>
      <div className="container">
        <section className="slider" style={{ paddingTop: "10%" }}>
          <div className="container" id="container">
            <div className="row">

              <div className="col-lg-6 col-md-6 col-sm-12">
                {(first > 0) && <CaretUpFill size={40} onClick={() => { setLast(last - 1); setFirst(first - 1); setSelImageId(last - 1) }}
                  className='ms-3 me-2 mb-0 pb-0' />}

                <div className="d-flex justify-content-center flex-row-reverse mt-0 pt-0">
                  <div className="image-display">
                    <img id="selected-image" src={img || product?.getProduct?.images[0]?.imagePath[0]} alt="Selected Image" />
                    <div />
                  </div>
                  <div className="variant-options mt-0">
                    <div className='mt-0' style={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly" }} >
                      {imageArray && imageArray?.map((image, index) => index >= first && index < last &&
                        <div key={index} className="variant mt-0" id="act"
                          onClick={() => { changeImage(image); handleImageSelectedForDisplay(index) }}  >
                          <img src={image} alt="Image" style={selImageId === index ? imageBorder : noBorder} />
                        </div>)}
                    </div>
                  </div>
                </div>
                {(last < len) &&
                  <CaretDownFill size={40} onClick={() => {
                    setLast(last + 1); setFirst(first + 1);
                    setSelImageId(first + 1)
                  }} className='ms-3 me-2 mb-0 pb-0' />}
              </div>


              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="container">
                  <h1>{product?.getProduct?.productName}</h1>
                  <br />
                  {product?.getProduct?.discount > 0 ? <h3>
                    <del> ₹  {product?.getProduct?.sellingPrice}</del>
                    {" "} ₹ {sellingPrice}
                  </h3> : <h3> ₹ {product?.getProduct?.sellingPrice}
                  </h3>}

                  <p className="text-disable">Tax included.</p>
                  <hr />


                  <h6 className='fw-bold mx-2 text-left'> Colour </h6>
                  <div className='ms-0 d-flex flex-wrap'>
                    {product?.getProduct && product?.getProduct?.color.map((color, index) =>
                      <div key={color}
                        onClick={() => { handleSumDrama(color); handleSelection(index) }}
                        className='mx-2 my-2 px-3 py-2 hoverable'
                        style={select === index ? colorSelectedStyle : colorNotSelectedStyle} >
                        {color}
                      </div>)}
                  </div>
                  <h6 className='fw-bold mx-2 text-left'>
                    Gender
                  </h6>
                  <div className='ms-0 d-flex flex-wrap'>
                    {product?.getProduct && product?.getProduct?.gender.map((gender, index) =>
                      <div key={gender}
                        style={genSel === index ? genderSelectedStyle : genderNotSelectedStyle}
                        onClick={() => { handleGenderSeletion(index); handleGenderDrama(gender) }}
                        className='mx-2 my-2 px-3 py-2 hoverable'> {gender} </div>)}
                  </div>

                  <h6 className='fw-bold mx-2 text-left'>
                    Size
                  </h6>
                  <div className='ms-0 d-flex flex-wrap'>
                    {product?.getProduct && product?.getProduct?.size.map((size, index) =>
                      <div
                        style={sizeSel === index ? sizeSelectedStyle : sizeNotSelectedStyle}
                        onClick={() => { handleCartSize(size); handleSizeSeletion(index) }}
                        key={size} className='mx-2 my-2 px-3 py-2 hoverable' >
                        {size}
                      </div>)}
                  </div>

                </div>
                <br />

                <div className="mx-2 d-flex align-items-center">
                  <svg
                    style={{ marginRight: 9 }}
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="currentColor"
                    className="bi bi-globe"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
                  </svg>{" "}
                  <h6 style={{ paddingTop: 5, color: "rgba(59, 59, 59, 0.8)" }}>
                    Worldwide shipping
                  </h6>
                </div>
                <br />
                <div className="mx-2  d-flex align-items-flexstart">
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
                  <button className="button  d-flex justify-content-evenly" onClick={() => handleAddToCart(product?.getProduct?.id)}>
                    Addddd to cart
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
                  <button className="button  d-flex justify-content-evenly" onClick={() => handleAddToWishlist(product?.getProduct?.id)}>
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
                <br />

                <Tabs>
                  <Tab eventKey="measurement" title="Measurement" className='my-3'>
                    <h6 className='fw-bold mx-2 my-3 text-left'>
                      Free Size :
                    </h6>
                    <ul>
                      <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'> Waist : 26" - 48" (Full Elasticated Waist with
                        tightening lace)</li>

                      <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'>Height : 40"</li>
                    </ul>
                    <h6 className='fw-bold mx-2 my-3 text-left'>
                      Medium :
                    </h6>
                    <ul>
                      <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'> Waist : 26" - 48" (Full Elasticated Waist with
                        tightening lace)</li>

                      <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'>Height : 40"</li>
                    </ul>
                    <h6 className='fw-bold mx-2 my-3 text-left'>
                      Features :
                    </h6>
                    <ul>
                      <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'>
                        Finest Long Staple 100% cotton</li>
                      <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'>
                        Super Sized Pocket</li>
                      <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'>
                        High quality Skin safe colours</li>

                    </ul>
                  </Tab>
                  <Tab eventKey="description" title="Description">
                    <div className="my-3" style={{ fontWeight: "bold", textAlign: "left" }}>
                      {product?.getProduct?.description}
                    </div>
                  </Tab>
                  <Tab eventKey="size" title="Size">
                    <h6 className='fw-bold mx-2 text-left'>
                      Features :
                    </h6>
                    <ul>
                      <li style={{ fontWeight: "bold", textAlign: "left" }}>
                        Finest Long Staple 100% cotton</li>
                      <li style={{ fontWeight: "bold", textAlign: "left" }}>
                        Super Sized Pocket</li>
                      <li style={{ fontWeight: "bold", textAlign: "left" }}>
                        High quality Skin safe colours</li>
                    </ul>
                  </Tab>
                </Tabs>
                <hr />
                <b>
                  <div className="d-flex">
                    <div
                      className="d-flex align-items-center flex-wrap"
                      style={{ paddingRight: 21 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={22}
                        height={22}
                        fill="currentColor"
                        className="bi bi-facebook"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                      </svg>{" "}
                      <p style={{ paddingLeft: 6, paddingTop: 15 }}>Share</p>
                    </div>
                    <div
                      className="d-flex align-items-center flex-wrap"
                      style={{ paddingRight: 21 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={22}
                        height={22}
                        fill="currentColor"
                        className="bi bi-twitter"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                      </svg>
                      <p style={{ paddingLeft: 6, paddingTop: 15 }}>Tweet</p>
                    </div>
                    <div
                      className="d-flex align-items-center flex-wrap"
                      style={{ paddingRight: 21 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={22}
                        height={22}
                        fill="currentColor"
                        className="bi bi-pinterest"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.286-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A8 8 0 1 0 8 0z" />
                      </svg>
                      <p style={{ paddingLeft: 6, paddingTop: 15 }}>Pin It</p>
                    </div>
                  </div>
                </b>
              </div>
              <b></b>
            </div>
            <b></b>
          </div>
          <b></b>
        </section>
      </div>
    </MediaQuery>

    <MediaQuery maxWidth={768}>
      <div className="container-small">
        <section className="slider" style={{ paddingTop: "10%" }}>
          <div className="container-small" id="container-small">
            <div className="row-small" id='row-small'>

              <div className="col-lg-6 col-md-6 col-sm-12 mb-5">
                <div className="d-flex justify-content-center flex-row-reverse">
                  <div className="image-display-small" style={{ marginTop: "18%" }}>
                    <img id="selected-image" src={img || product?.getProduct?.images[0]?.imagePath[0]} alt="Selected Image" />
                    <div />
                  </div>
                  <div className="variant-options-small " style={{ marginTop: "18%" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly"
                      }} >
                      {imageArray && imageArray?.map((image, index) => index < 4 &&
                        <div key={index}
                          className="variant-small"
                          id="act"
                          data-image="assets/img/31.jpg"
                          onClick={() => {
                            changeImage(image);
                            handleImageSelectedForDisplay(index);
                          }}
                        >
                          <img
                            src={image}
                            alt=""
                            style={selImageId === index ? imageBorder : noBorder}
                          />
                        </div>)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="container-small">
                  <h1 className='mt-5'>{product?.getProduct?.productName}</h1>
                  <br />
                  {product?.getProduct?.discount > 0 ? <h3>
                    <del> ₹  {product?.getProduct?.sellingPrice}</del>
                    {" "} ₹ {sellingPrice}
                  </h3> : <h3> ₹ {product?.getProduct?.sellingPrice}
                  </h3>}

                  <p className="text-disable">Tax included.</p>
                  <hr />


                  <h6 className='fw-bold mx-2 text-left'> Colour </h6>
                  <div className='ms-0 d-flex flex-wrap'>
                    {product?.getProduct && product?.getProduct?.color.map((color, index) =>
                      <div key={color}
                        onClick={() => { handleSumDrama(color); handleSelection(index) }}
                        className='mx-2 my-2 px-3 py-2 hoverable'
                        style={select === index ? colorSelectedStyle : colorNotSelectedStyle} >
                        {color}
                      </div>)}
                  </div>
                  <h6 className='fw-bold mx-2 text-left'>
                    Gender
                  </h6>
                  <div className='ms-0 d-flex flex-wrap'>
                    {product?.getProduct && product?.getProduct?.gender.map((gender, index) =>
                      <div key={gender}
                        style={genSel === index ? genderSelectedStyle : genderNotSelectedStyle}
                        onClick={() => { handleGenderSeletion(index); handleGenderDrama(gender) }}
                        className='mx-2 my-2 px-3 py-2 hoverable'> {gender} </div>)}
                  </div>

                  <h6 className='fw-bold mx-2 text-left'>
                    Size
                  </h6>
                  <div className='ms-0 d-flex flex-wrap'>
                    {product?.getProduct && product?.getProduct?.size.map((size, index) =>
                      <div
                        style={sizeSel === index ? sizeSelectedStyle : sizeNotSelectedStyle}
                        onClick={() => { handleCartSize(size); handleSizeSeletion(index) }}
                        key={size} className='mx-2 my-2 px-3 py-2 hoverable' >
                        {size}
                      </div>)}
                  </div>

                </div>
                <br />

                <div className="mx-2 d-flex align-items-center">
                  <svg
                    style={{ marginRight: 9 }}
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="currentColor"
                    className="bi bi-globe"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
                  </svg>{" "}
                  <h6 style={{ paddingTop: 5, color: "rgba(59, 59, 59, 0.8)" }}>
                    Worldwide shipping
                  </h6>
                </div>
                <br />
                <div className="mx-2  d-flex align-items-flexstart">
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
                  <button className="button  d-flex justify-content-evenly" onClick={() => handleAddToCart(product?.getProduct?.id)}>
                    <a href="#" className="text-center">
                      Add to cart
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
                  <button className="button  d-flex justify-content-evenly" onClick={() => handleAddToWishlist(product?.getProduct?.id)}>
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
                <br />

                <Tabs>
                  <Tab eventKey="measurement" title="Measurement" className='my-3'>
                    <h6 className='fw-bold mx-2 my-3 text-left'>
                      Free Size :
                    </h6>
                    <ul>
                      <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'> Waist : 26" - 48" (Full Elasticated Waist with
                        tightening lace)</li>

                      <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'>Height : 40"</li>
                    </ul>
                    <h6 className='fw-bold mx-2 my-3 text-left'>
                      Medium :
                    </h6>
                    <ul>
                      <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'> Waist : 26" - 48" (Full Elasticated Waist with
                        tightening lace)</li>

                      <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'>Height : 40"</li>
                    </ul>
                    <h6 className='fw-bold mx-2 my-3 text-left'>
                      Features :
                    </h6>
                    <ul>
                      <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'>
                        Finest Long Staple 100% cotton</li>
                      <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'>
                        Super Sized Pocket</li>
                      <li style={{ fontWeight: "bold", textAlign: "left" }} className='my-2'>
                        High quality Skin safe colours</li>

                    </ul>
                  </Tab>
                  <Tab eventKey="description" title="Description">
                    <div className="my-3" style={{ fontWeight: "bold", textAlign: "left" }}>
                      {product?.getProduct?.description}
                    </div>
                  </Tab>
                  <Tab eventKey="size" title="Size">
                    <h6 className='fw-bold mx-2 text-left'>
                      Features :
                    </h6>
                    <ul>
                      <li style={{ fontWeight: "bold", textAlign: "left" }}>
                        Finest Long Staple 100% cotton</li>
                      <li style={{ fontWeight: "bold", textAlign: "left" }}>
                        Super Sized Pocket</li>
                      <li style={{ fontWeight: "bold", textAlign: "left" }}>
                        High quality Skin safe colours</li>
                    </ul>
                  </Tab>
                </Tabs>
                <hr />
                <b>
                  <div className="d-flex">
                    <div
                      className="d-flex align-items-center flex-wrap"
                      style={{ paddingRight: 21 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={22}
                        height={22}
                        fill="currentColor"
                        className="bi bi-facebook"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                      </svg>{" "}
                      <p style={{ paddingLeft: 6, paddingTop: 15 }}>Share</p>
                    </div>
                    <div
                      className="d-flex align-items-center flex-wrap"
                      style={{ paddingRight: 21 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={22}
                        height={22}
                        fill="currentColor"
                        className="bi bi-twitter"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                      </svg>
                      <p style={{ paddingLeft: 6, paddingTop: 15 }}>Tweet</p>
                    </div>
                    <div
                      className="d-flex align-items-center flex-wrap"
                      style={{ paddingRight: 21 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={22}
                        height={22}
                        fill="currentColor"
                        className="bi bi-pinterest"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.286-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A8 8 0 1 0 8 0z" />
                      </svg>
                      <p style={{ paddingLeft: 6, paddingTop: 15 }}>Pin It</p>
                    </div>
                  </div>
                </b>
              </div>
              <b></b>
            </div>
            <b></b>
          </div>
          <b></b>
        </section>
      </div>
    </MediaQuery> */}
    <b></b>

    {/* You may also like section */}

    <section className="slider">
      <Container>
        <h1 className="text-center mb-5">You may also like</h1>
        <Row>
          <Col lg={3} md={4} sm={6} xs={6} style={{ textAlign: 'center' }}>
            <Link to={`/shop/product`} target="_blank" className='stretched-link'>  </Link>
            <div className="flexslider">
              <img style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }} src="/assets/img/1.jpg" alt='products' />
              <div className='text-center'>
                <h6 className='text-center text-black'
                  style={{
                    padding: "2px 0px", marginBottom: '0px',
                    fontFamily: "Neue-Helvetica, Helvetica, Arial, sans-serif", letterSpacing: "1px"
                  }}> Mythical Mana</h6>
                <div>
                  <h6 style={{
                    fontFamily: "Neue-Helvetica, Helvetica, Arial, sans-serif"
                  }} className="text-center">
                    <del> ₹3,000</del> ₹1999</h6>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    {/* <section className="slider">
      <h1 className="text-center" style={{ fontFamily: "poppins", fontWeight: "bolder", fontSize: "30px" }}>
        You may also like
      </h1>
      <div className="container">
        <div className="row">
          <div className="flexslider col-lg-3 col-md-6 col-sm-12" >
            <div className="flexslider">
              <ul className="slides" style={{ listStyle: "none" }} >
                <li data-thumb="assets/img/1.jpg">
                  <a data-fslightbox="mygalley" className="rounded-4" target="_blank" data-type="image" href="/shop/product" >
                    <img style={{ height: 350, objectFit: "contain" }} src="/assets/img/1.jpg" />
                  </a>
                </li>
                <div className='text-center'>
                  <h2 className='mt-2' style={{ fontSize: "20px", fontWeight: "bold", fontFamily: "raleway", letterSpacing: "2px" }}> Mythical Mana </h2>
                  <p>
                    <del> ₹3,000</del> ₹1999
                  </p>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section> */}


    {/* Recently Viewed */}
    <section>
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
                  position: "relative"
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
                  marginTop: "-10px"
                }}
              >
                33%
              </p>
            </div>
            <p style={{ paddingTop: 6, marginLeft: "-14px", marginBottom: 0 }}>
              <b>Terra Fragments</b>
            </p>
            <p
              style={{
                marginLeft: "-14px",
                marginBottom: 0,
                fontWeight: "normal",
                fontSize: "large"
              }}
            >
              {" "}
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
                boxShadow: "1px 1px  rgba(0, 0, 0, 0.5)"
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
            {/* <div
              className="d-flex align-items-center shade justify-content-center"
              style={{ border: "2px solid rgb(0, 0, 0)", height: 40, width: "80%" }}
            >
              <button className="button  d-flex justify-content-evenly">
                <a href="" style={{ textDecoration: "none", color: "rgb(0, 0, 0)" }}>
                  <p style={{ margin: 0 }}>
                    <b>Add to Cart</b>
                  </p>
                </a>
              </button>
            </div> */}
            <Button style={{
              border: "1px solid rgb(28, 29, 29)",
              backgroundColor: " rgb(255, 255, 255)",
              color: "rgb(28, 29, 29) !important",
              fontFamily: "ITC Avant Garde Gothic, sans- serif",
              boxShadow: "none",
              position: "relative",
              padding: '8px 28px'
            }} variant="outline-dark">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </section>
  </>);
}

export default Product;
