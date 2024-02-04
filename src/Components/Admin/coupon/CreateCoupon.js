import React, { useState } from "react";
import { Form, Card, Col, Row, Button } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import toast from "react-hot-toast";

function CreateCoupon() {
  const CREATE_COUPON = gql`
    mutation CreateCouponCode(
      $couponName: String
      $discount: Float
      $couponCode: String
    ) {
      createCouponCode(
        couponName: $couponName
        discount: $discount
        couponCode: $couponCode
      ) {
        id
      }
    }
  `;

  const initialFormData = {
    couponName: "",
    discount: 0,
    couponCode: "",
  };

  const [couponformData, setCouponformData] = useState(initialFormData);

  const handleformData = (e) => {
    const { name, value } = e.target;
    setCouponformData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [CreateCouponCode] = useMutation(CREATE_COUPON, {
    onCompleted: () => {
      toast.success("Coupon added Successfully !");
      setCouponformData(initialFormData);
    },
    onError: (error) => {
      toast.error(error.message || "Error Occured");
      console.error("CREATE_COUPON: ", error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { discount, ...rest } = couponformData;

      await CreateCouponCode({
        variables: {
          discount: parseFloat(discount),
          ...rest,
        },
      });
    } catch (err) {
      console.error("err", err);
    }
  };

  return (
    <>
      {/* <Row > */}
      <Col className="col-8 mx-auto my-5">
        <Card className="mb-5" style={{ border: "1px solid black" }}>
          <Card.Body>
            <h1>Create Coupon</h1>
            <Form onSubmit={handleSubmit}>
              <div className="mb-3">
                <Form.Label htmlFor="couponName">Coupon Name :</Form.Label>
                <Form.Control
                  type="text"
                  required
                  id="couponName"
                  name="couponName"
                  value={couponformData.couponName}
                  onChange={handleformData}
                />
              </div>
              <div className="mb-3">
                <Form.Label htmlFor="discount">Discount:</Form.Label>
                <Form.Control
                  type="number"
                  required
                  id="discount"
                  name="discount"
                  value={couponformData.discount}
                  onChange={handleformData}
                />
              </div>
              <div className="mb-3">
                <Form.Label htmlFor="couponCode">Coupon Code:</Form.Label>
                <Form.Control
                  type="text"
                  required
                  id="couponCode"
                  name="couponCode"
                  value={couponformData.couponCode}
                  onChange={handleformData}
                />
              </div>
              <Button variant="outline-success" className="my-3" type="submit">
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      {/* </Row> */}
    </>
  );
}

export default CreateCoupon;
