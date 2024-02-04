import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import CartPage from "../../Home/CartSection/CartPage";
import { Modal, Button, Row } from "react-bootstrap";
import { useState } from "react";

function CartPop({ show, onHide }) {
  const navigate = useNavigate();

  // GETTING CART ITEMS
  const CART = gql`
    query Cart {
      cart {
        _id
        cartProducts {
          productId {
            id
            productName
            discount
            sellingPrice
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

  const [getCartData, { data: cartData, refetch }] = useLazyQuery(CART);

  useEffect(() => {
    getCartData();
  }, []);

  const goToHomePage = () => {
    navigate("/");
    onHide();
  };

  useEffect(() => {
    refetch();
  }, [show, onHide]);

  const goToCheckOut = async () => {
    const temp = cartData?.cart?.cartProducts?.map((item) => {
      const unit = item?.productId?.images?.filter(
        (r) => r.color === item.color && r.gender === item?.gender
      );
      // if (!unit) {      }
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

    const newArray = cartData?.cart?.cartProducts?.map((item) => {
      return {
        price: item?.productId?.sellingPrice,
        productId: item?.productId?.id,
        discount: item?.productId?.discount,
        quantity: item?.quantity,
      };
    });

    const StateValue = {
      newArray: newArray,
      temp: temp,
    };

    navigate("/checkout", { state: StateValue });
    onHide();
  };

  return (
    <>
      <Modal
        className="modal-right scroll-out-negative"
        show={show}
        onHide={onHide}
        scrollable
        dialogClassName="full"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold" as="h5">
            Cart
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="mx-0 px-0">
          {cartData?.cart?.cartProducts?.length > 0 ? (
            <CartPage />
          ) : (
            <div>
              <p className="fs-6"> Your Cart is Currently Empty </p>
              <Button className="btn-dark" onClick={() => goToHomePage()}>
                Shop Now
              </Button>
            </div>
          )}
        </Modal.Body>
        {cartData?.cart?.cartProducts?.length > 0 && (
          <Modal.Footer className="border-0">
            <Button
              style={{ backgroundColor: "black", color: "white" }}
              className="fs-5 fw-bold w-100"
              onClick={() => goToCheckOut()}
            >
              CHECKOUT
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}

export default CartPop;
