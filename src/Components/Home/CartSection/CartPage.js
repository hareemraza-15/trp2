import React, { useEffect, useState } from "react";
import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { Button, Col, Row } from "react-bootstrap";
import toast from "react-hot-toast";

function CartPage() {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(0);

  // GETTING CART ITEMS
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
    },
  });

  useEffect(() => {
    getCartData();
  }, []);

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
    handleCart({
      variables: {
        productId: id,
        quantity: -1,
        size: size,
        gender: gender,
        color: color,
      },
    });
  };

  const CartIncrement = (id, size, gender, color) => {
    handleCart({
      variables: {
        productId: id,
        quantity: 1,
        size: size,
        gender: gender,
        color: color,
      },
    });
  };

  const [sum, setSum] = useState();

  useEffect(() => {
    getCartData();
  }, [cartValue]);

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
        discount: item?.productId?.discount,
        quantity: item?.quantity,
        sellingPrice: item?.productId?.sellingPrice,
        id: item?.productId?.id,
      };
    });

    setTempCartValues(temp);
  }, [cartData]);

  useEffect(() => {
    // const totalprice = cartData?.cart?.cartProducts?.reduce(
    //   (acc, curr) => acc + curr?.quantity * curr?.productId?.sellingPrice,
    //   0
    // );

    const totalprice = cartData?.cart?.cartProducts?.reduce(
      (acc, curr) =>
        acc +
        curr?.quantity *
          ((1 - curr?.productId?.discount / 100) *
            curr?.productId?.sellingPrice),
      0
    );
    setSum(totalprice);
  }, [cartData, cartValue]);

  return (
    <>
      {cartData?.cart?.cartProducts?.length > 0 &&
        tempCartValues?.map((item, index) => (
          <div key={index} className="mb-1 mx-1 px-0 mt-1">
            <Row className="my-2">
              <Col className="col-3">
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
              <Col className="col-9">
                <div className="fs-6">
                  {item?.productName}
                  <div
                    className="d-inline position-absolute"
                    style={{ left: "15rem", zIndex: "1", top: "0.1rem" }}
                  >
                    <Button
                      style={{ border: "none" }}
                      onClick={() =>
                        handleRemove(
                          item?.id,
                          item?.color,
                          item?.gender,
                          item?.size
                        )
                      }
                      className="my-0 py-0 d-inline px-1 mx-0"
                      variant="outline-danger"
                    >
                      X
                    </Button>
                  </div>
                </div>
                <Row>
                  <Col>
                    <Button
                      variant="outline-dark"
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
                      -
                    </Button>
                    <input
                      onChange={(e) => setQuantity(e.target.value)}
                      value={item?.quantity}
                      className="mx-1"
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
                      +
                    </Button>
                  </Col>
                  <Col className="fw-bold">
                    ₹
                    {item.quantity *
                      ((1 - item.discount / 100) * item.sellingPrice)}
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        ))}
      <hr />
      <div className="my-2">
        <p
          className="fw-bold d-inline fs-5"
          style={{ marginRight: "40px", paddingRight: "50px" }}
        >
          SUBTOTAL
        </p>
        <p
          className="fw-bold d-inline fs-5"
          style={{ marginLeft: "70px", alignItems: "end", alignContent: "end" }}
        >
          ₹ {sum}
        </p>
      </div>
    </>
  );
}

export default CartPage;
