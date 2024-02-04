import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Cart, DashLg, PlusLg } from "react-bootstrap-icons";
import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { Button, Col, Row, Modal, Card } from "react-bootstrap";
import toast from "react-hot-toast";

function CartFull() {
  const [quantity, setQuantity] = useState(0);
  const { state } = useLocation();
  const navigate = useNavigate();
  console.log("state", state);
  const goToCart = () => {
    navigate("/shop/cart", { state });
  };

  const [demo, setDemo] = useState();
  // const demo = {};

  const CART = gql`
    query Cart {
      cart {
        _id
        cartProducts {
          productId {
            id
            sellingPrice
            productName
            priveiwName
            discount
            images {
              imagePath
              color
              gender
            }
          }
          color
          gender
          size
          quantity
        }
      }
    }
  `;

  const [getCartData, { data: cartData, refetch }] = useLazyQuery(CART, {
    onCompleted: () => {
      setQuantity(cartData?.cart?.cartProducts[0]?.quantity);
      refetch();
    },
  });

  useEffect(() => {
    getCartData();
  }, []);

  if (cartData) {
    console.log("cartData", cartData);
  }

  const [tempCartValues, setTempCartValues] = useState([]);
  useEffect(() => {
    const temp = cartData?.cart?.cartProducts?.map((item) => {
      const unit = item?.productId?.images?.filter(
        (r) => r.color === item.color && r.gender === item?.gender
      );
      return {
        image: unit[0]?.imagePath[0],
        color: item?.color,
        size: item?.size,
        gender: item?.gender,
        productName: item?.productId?.productName,
        quantity: item?.quantity,
        sellingPrice: item?.productId?.sellingPrice,
        id: item?.productId?.id,
      };
    });

    setTempCartValues(temp);
  }, [cartData]);

  // const REMOVE_FROM_CART = gql`
  //   mutation RemoveFromCart($productId: ID) {
  //     removeFromCart(productId: $productId) {
  //       _id
  //       cartProducts {
  //         productId {
  //           id
  //         }
  //         color
  //         gender
  //         size
  //         quantity
  //       }
  //     }
  //   }
  // `;

  const REMOVE_FROM_CART = gql`
    mutation RemoveFromCart(
      $productId: ID
      $color: String
      $size: String
      $gender: String
    ) {
      removeFromCart(
        productId: $productId
        color: $color
        size: $size
        gender: $gender
      ) {
        _id
      }
    }
  `;

  const [removeFromCart, { data: removeData }] = useMutation(REMOVE_FROM_CART, {
    onCompleted: () => {
      toast.success("Item Removed from Cart");
      refetch();
    },
  });

  const handleRemove = async (id, color, gender, size) => {
    await removeFromCart({
      variables: {
        productId: id,
        color: color,
        gender: gender,
        size: size,
      },
    });
  };

  const HANDLE_CART_QUANTITY = gql`
    mutation AddToCart(
      $productId: ID!
      $quantity: Int!
      $color: String
      $gender: String
      $size: String
    ) {
      addToCart(
        productId: $productId
        quantity: $quantity
        color: $color
        gender: $gender
        size: $size
      ) {
        _id
      }
    }
  `;

  const [handleCart, { data: cartValue }] = useMutation(HANDLE_CART_QUANTITY, {
    onCompleted: () => {
      refetch();
    },
  });

  const CartDecrement = (id, size, gender, color) => {
    console.log("CartDecrement", id);
    handleCart({
      variables: {
        productId: id,
        quantity: -1,
        size: size,
        gender: gender,
        color: color,
      },
    });
    refetch();
  };

  const CartIncrement = (id, size, gender, color) => {
    console.log("CartIncrement", id);
    console.log(id, size, gender, color);
    handleCart({
      variables: {
        productId: id,
        quantity: 1,
        size: size,
        gender: gender,
        color: color,
      },
    });
    refetch();
  };

  const [sum, setSum] = useState();

  useEffect(() => {
    getCartData();
  }, [cartValue]);

  useEffect(() => {
    setSum(
      cartData?.cart?.cartProducts?.reduce(
        (acc, curr) => acc + curr?.quantity * curr?.productId?.sellingPrice,
        0
      )
    );
    // const sum = cartData?.cart?.cartProducts?.reduce((acc, curr) => acc + curr?.quantity * curr?.productId?.sellingPrice, 0);

    // console.log("sum", sum);
  }, [cartData, cartValue]);

  const goToCheckOut = async () => {
    // navigate('/checkout');

    const newArray = cartData?.cart?.cartProducts?.map((item) => {
      return {
        price: item?.productId?.sellingPrice,
        productId: item?.productId?.id,
        discount: item?.productId?.discount,
        quantity: item?.quantity,
      };
    });
    navigate("/checkout", { state: { newArray } });
  };

  return (
    <>
      <div style={{ paddingTop: "10%" }}>
        <h1
          className="mx-4 text-center mb-5"
          style={{ fontSize: "40px", fontWeight: "bold" }}
        >
          {" "}
          Cart{" "}
        </h1>

        {/* {cartData?.cart?.cartProducts?.length > 0 && tempCartValues?.map((item, index) => 
    <Card key={index} style={{border: "none"}}>
      <Card.Body className='mx-4'>
      <Row className='my-2'>
        <Col className='col-md-1'></Col>
        <Col className=' mx-1 px-1 col-md-2'>
          <img style={{height: "100px", width:"70px", border: "2px solid black"}} 
           src={item?.image } alt="s"/>
        </Col> 
        <Col className='col-md-4 mx-1 px-1'>
          <p className='fs-5  fw-bold my-0 py-0'>{item?.productName}</p>
          <p className='fs-6 fw-bold my-0 py-0'>{item?.size} / {item?.color} / {item?.gender} </p>
          
        </Col>
        <Col className='mx-1 px-1 col-md-2'>
          <Button variant='outline-dark' disabled={item?.quantity <= 1} style={{border: "none"}} 
          onClick={() => CartDecrement(item?.id, item?.size, item?.gender, item?.color)}>
            <DashLg />
            </Button>
           <input  onChange={(e) => setQuantity(e.target.value)} value={item?.quantity} className="mx-2" style={{background: "none", border: "none", width: "30%", textAlign: "center"}} type='text'  min="0" pattern="[0-9]*"/>
          <Button variant='outline-dark' style={{border: "none"}} onClick={() => CartIncrement(item?.id, item?.size, item?.gender, item?.color)}>
            <PlusLg />
          </Button>
        </Col>
        <Col className='fw-bold mx-1 px-1 col-md-1'>₹ {item?.quantity * item?.sellingPrice}</Col>
        <Col className='mt-0 pt-0 mx-1 px-1 col-md-1'>
          <Button onClick={() => handleRemove(item?.id, 
                  item?.color, item?.gender, item?.size )} 
            style={{marginRight: "0px", border: "none"}} 
            className='d-inline me-md-0 ms-md-5 mt-0 pt-0 mx-1 px-1' 
            variant='outline-danger' > Remove  </Button>
        </Col> 
       </Row>
      </Card.Body>
    </Card> )} */}

        {cartData?.cart?.cartProducts?.length > 0 &&
          tempCartValues?.map((item, index) => (
            <Card
              key={index}
              className="mb-2 hover-border-primary"
              style={{ border: "none" }}
            >
              <Card.Body className="pt-0 pb-0 sh-30 sh-lg-8">
                <Row className="g-0 h-100 align-content-center">
                  <Col
                    xs="1"
                    lg="1"
                    className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-1 order-lg-1 "
                  ></Col>
                  <Col
                    xs="3"
                    lg="2"
                    className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-1 order-lg-1 "
                  >
                    <img
                      style={{
                        height: "100px",
                        width: "70px",
                        border: "2px solid black",
                      }}
                      src={item?.image}
                      alt="s"
                    />
                  </Col>
                  <Col
                    xs="8"
                    lg="4"
                    className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-2 order-lg-2 align-items-lg-center"
                  >
                    <p className="fs-5  fw-bold my-0 py-0">
                      {item?.productName}
                    </p>
                    <p className="fs-6 fw-bold my-0 py-0">
                      {item?.size} / {item?.color} / {item?.gender}
                    </p>
                  </Col>
                  <Col
                    xs="5"
                    lg="3"
                    className=" justify-content-center mb-2 mb-lg-0 order-3 order-lg-3 align-items-lg-center"
                  >
                    <Button
                      variant="outline-dark"
                      className="d-inline"
                      disabled={item?.quantity <= 1}
                      style={{ border: "none" }}
                      onClick={() =>
                        CartDecrement(
                          item?.id,
                          item?.size,
                          item?.gender,
                          item?.color
                        )
                      }
                    >
                      <DashLg />
                    </Button>
                    <input
                      onChange={(e) => setQuantity(e.target.value)}
                      value={item?.quantity}
                      className="mx-2 d-inline"
                      style={{
                        background: "none",
                        border: "none",
                        width: "30%",
                        textAlign: "center",
                      }}
                      type="text"
                      min="0"
                      pattern="[0-9]*"
                    />
                    <Button
                      variant="outline-dark"
                      className="d-inline"
                      style={{ border: "none" }}
                      onClick={() =>
                        CartIncrement(
                          item?.id,
                          item?.size,
                          item?.gender,
                          item?.color
                        )
                      }
                    >
                      <PlusLg />
                    </Button>
                  </Col>
                  <Col
                    xs="7"
                    lg="2"
                    className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-5 order-lg-5 align-items-lg-center"
                  >
                    <Button
                      onClick={() =>
                        handleRemove(
                          item?.id,
                          item?.color,
                          item?.gender,
                          item?.size
                        )
                      }
                      style={{ marginRight: "0px", border: "none" }}
                      className="d-inline me-md-0 ms-md-5 mt-0 pt-0 mx-1 px-1"
                      variant="outline-danger"
                    >
                      {" "}
                      Remove{" "}
                    </Button>
                  </Col>
                  <hr />
                </Row>
              </Card.Body>
            </Card>
          ))}

        {/* <Button variant='link' onClick={() => goToCart()}> <Cart/> </Button> */}
        {/* {cartData?.cart?.cartProducts?.length > 0 && cartData?.cart?.cartProducts?.map((item, index) => 
    <Card key={index} style={{border: "none"}}>
      <Card.Body className='mx-4'>
      <Row className='my-2'>
        <Col className='col-md-auto'>
   <img style={{height: "100px", width:"70px", border: "2px solid black"}} src={item?.productId?.images[0]?.imagePath[0] } alt="s"/>
        </Col>
        <Col className='col-md-auto'>
        <Col className='col-5 mx-2'>
          <p className='fs-6 my-0 py-0'>{item?.productId?.productName}</p>
          <p className='fs-6  my-0 py-0'>{item?.size}</p>
          <p className='fs-6  my-0 py-0'>{item?.color}</p>
          <p className='fs-6  my-0 py-0'>{item?.gender}</p>  </Col>
        <Row>
             <Col>
               <Button variant='outline-dark' disabled={item?.quantity <= 1} style={{border: "none"}} onClick={() => CartDecrement(item?.productId?.id, item?.size, item?.gender, item?.color)}>-</Button>
                 <input  onChange={(e) => setQuantity(e.target.value)} value={item?.quantity} className="mx-2" style={{background: "none", border: "none", width: "30%", textAlign: "center"}} type='text'  min="0" pattern="[0-9]*"/>
               <Button variant='outline-dark' style={{border: "none"}} onClick={() => CartIncrement(item?.productId?.id, item?.size, item?.gender, item?.color)}>+</Button>
             </Col>
             <Col className='fw-bold'>₹ {item?.quantity * item?.productId?.sellingPrice}</Col>
             <Col className='mt-0 pt-0'>
               <Button 
                 onClick={() => handleRemove(item?.productId?.id, item?.color, item?.gender, item?.size )} 
                style={{marginRight: "0px", border: "none"}} 
                 className='d-inline me-md-0 ms-md-5 mt-0 pt-0' 
                 variant='outline-danger' > Remove  </Button>
    </Col>
            
   
        </Row>
        </Col>
       </Row>
       
      </Card.Body>
    </Card> )} */}

        <Row className="my-2 mr-0">
          <Col className="col-md-8 col-3" />
          <Col className="col-md-auto col-8 ">
            <p
              className="fw-bold d-inline fs-5"
              style={{ marginRight: "0", paddingRight: "0" }}
            >
              SUBTOTAL{" "}
            </p>
            <p
              className="fw-bold d-inline fs-5"
              style={{
                marginRight: "0",
                paddingRight: "0",
                alignItems: "end",
                alignContent: "end",
              }}
            >
              {" "}
              ₹ {sum}
            </p>
          </Col>
        </Row>
      </div>

      {cartData?.cart?.cartProducts?.length > 0 && (
        <Modal.Footer className="border-0" style={{ justifyContent: "center" }}>
          <Button
            style={{
              backgroundColor: "black",
              color: "white",
              border: "1px solid black",
              width: "60%",
            }}
            className="fs-5 fw-bold px-4 mx-5 mb-2 "
            onClick={() => goToCheckOut()}
          >
            CHECKOUT
          </Button>
        </Modal.Footer>
      )}
    </>
  );
}

export default CartFull;

// <div key={index} className='mb-1 mx-1 px-0 mt-1'>
//   <Row className='my-2'>
//     <Col className='col-2' />
//     <Col className='mx-4 col-2'>
//       <img style={{height: "100px", width:"70px", border: "2px solid black"}} src={item?.productId?.images[0]?.imagePath[0] } alt="s"/>
//     </Col>
//     <Col className='mx-5 col-auto mt-0'> <p className='fw-bold fs-5'>{item?.productId?.priveiwName}</p>
//       <Row>
//         <Col>
//           <Button variant='outline-dark' disabled={item?.quantity <= 1} style={{border: "none"}} onClick={() => CartDecrement(item?.productId?.id, item?.size, item?.gender, item?.color)}>-</Button>
//             <input  onChange={(e) => setQuantity(e.target.value)} value={item?.quantity} className="mx-2" style={{background: "none", border: "none", width: "30%", textAlign: "center"}} type='text'  min="0" pattern="[0-9]*"/>
//           <Button variant='outline-dark' style={{border: "none"}} onClick={() => CartIncrement(item?.productId?.id, item?.size, item?.gender, item?.color)}>+</Button>
//         </Col>
//         <Col className='fw-bold'>₹ {item?.quantity * item?.productId?.sellingPrice}</Col>
//         <Col className='mt-0 pt-0'>
//           <Button
//             onClick={() => handleRemove(item?.productId?.id, item?.color, item?.gender, item?.size )}
//             style={{marginRight: "0px", border: "none"}}
//             className='d-inline me-md-0 ms-md-5 mt-0 pt-0'
//             variant='outline-danger' > Remove  </Button>
//         </Col>

//       </Row>
//     </Col>
//   </Row>
// </div>
