import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Card, Col, Row, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const USER_ORDERS = gql`
  query GetUserorder {
    getUserorder {
      id
      paymentMethod
      status
      totalAmount
      billingAddress {
        id
        firstName
        lastName
        mobileNo
        addressLine1
        addressLine2
        city
        state
        postalCode
        country
      }
      paymentId
      paymentStatus
      shippingAddress {
        id
        firstName
        lastName
        mobileNo
        addressLine1
        addressLine2
        city
        state
        postalCode
        country
      }
      user {
        id
        firstName
        lastName
        email
        profilepic
        mobileNo
        password
        role
      }
      paymentProof
      orderProducts {
        productId {
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
        price
        quantity
        packedImage
        shippedImage
        shippedBy
        trackingNo
        trackingUrl
      }
    }
  }
`;

function OrderList() {
  const { data: orderData, loading } = useQuery(USER_ORDERS);

  // if (orderData) {
  //   console.log("UserOrders", orderData);
  // }
  // if (loading) {
  //   console.log("loading", loading);
  // }

  return (
    <>
      {loading && (
        <h1
          className="text-center"
          style={{ marginTop: "10%", marginBottom: "5%" }}
        >
          Loading...
        </h1>
      )}

      {orderData?.getUserorder?.length > 0 ? (
        <>
          {" "}
          <h4 style={{ marginTop: "10%" }} className="text-center mb-5">
            LIST OF ORDERS
          </h4>
          <Row className="g-0 align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 custom-sort">
            <Col
              md="4"
              className="d-flex flex-column mb-lg-0 pe-1 justify-content-center"
            >
              <div className=" text-md cursor-pointer fs-5"> Order ID </div>
            </Col>
            <Col
              md="2"
              className="d-flex flex-column pe-1 justify-content-center "
            >
              <div className=" text-md cursor-pointer fs-5"> NAME </div>
            </Col>
            <Col
              md="2"
              className="d-flex flex-column pe-1 justify-content-center"
            >
              <div className=" text-md cursor-pointer fs-5"> Amount </div>
            </Col>
            <Col
              md="2"
              className="d-flex flex-column pe-1 justify-content-center"
            >
              <div className=" text-md cursor-pointer fs-5t"> Date </div>
            </Col>
            <Col
              md="2"
              className="d-flex flex-column pe-1 justify-content-center"
            >
              <div className=" text-md cursor-pointer fs-5"> Status </div>
            </Col>
          </Row>{" "}
        </>
      ) : (
        <></>
      )}

      {orderData && orderData?.getUserorder?.length > 0 ? (
        orderData?.getUserorder
          ?.slice(0)
          .reverse()
          .map((order, index) => (
            <Card key={index} className="mb-2 hover-border-primary mx-1">
              <Card.Body className="pt-0 pb-0 sh-21 sh-md-8 my-3">
                <Row className="g-0 align-content-center cursor-default">
                  <Col
                    xs="11"
                    md="3"
                    className="ms-5 me-5 d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative"
                  >
                    <div className="text-muted text-small d-md-none">Id</div>
                    <Link
                      to={`/admin/order/detail/${order?.id}`}
                      className="text-truncate h-100 d-flex align-items-center"
                    >
                      <span maxLength={2}>{order?.id}</span>
                    </Link>
                  </Col>
                  <Col
                    xs="6"
                    md="2"
                    className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2"
                  >
                    <div className="text-muted text-small d-md-none">Name</div>
                    <div className="text-alternate">
                      {order?.user?.firstName} {order?.user?.lastName}
                    </div>
                  </Col>
                  <Col
                    xs="6"
                    md="2"
                    className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3"
                  >
                    <div className="text-muted text-small d-md-none">
                      Purchase
                    </div>
                    <div className="text-alternate">
                      <span>
                        <span className="text-small">₹ </span>
                        {order?.totalAmount}
                      </span>
                    </div>
                  </Col>
                  <Col
                    xs="6"
                    md="2"
                    className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4"
                  >
                    <div className="text-muted text-small d-md-none">Date</div>
                    <div className="text-alternate">13.09.2023</div>
                  </Col>
                  <Col
                    xs="6"
                    md="2"
                    className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5"
                  >
                    <div className="text-muted text-small d-md-none">
                      Status
                    </div>
                    <div>
                      <Badge className="badge bg-dark">{order?.status}</Badge>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
      ) : (
        <>
          {!loading && (
            <h2 className="text-center mb-5" style={{ marginTop: "10%" }}>
              Order Not Found
            </h2>
          )}
        </>
      )}
    </>
  );
}

export default OrderList;
