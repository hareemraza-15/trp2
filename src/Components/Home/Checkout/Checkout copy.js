import React, { useEffect, useState } from "react";
import { gql, useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Row, Col, Form, Card, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { Cart } from "react-bootstrap-icons";
import * as Yup from "yup";
import { useFormik } from "formik";

function Checkout(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [grandSum, setGrandSum] = useState(0);

  const temp = location?.state?.temp;

  const state = location?.state?.newArray;

  const [modal, showModal] = useState(false);

  const [payNowCheck, setPayNowCheck] = useState(true);

  const [totalAmount, setTotalAmount] = useState(
    // state?.reduce((acc, curr) => acc + curr?.quantity * curr?.price, 0)
    state?.reduce(
      (acc, curr) =>
        acc + curr?.quantity * ((1 - curr?.discount / 100) * curr?.price),
      0
    )
  );

  const [shippingAddress, setShippingAddress] = useState("");

  // console.log("state:" , state);
  // console.log( "FINAL shippingAddress" , shippingAddress);

  const [shippingAsBilling, setShippingAsBilling] = useState(false);

  // GET_BILLING_ADDRESS
  const GET_BILLING_ADDRESS = gql`
    query GetAllAddressesByUser {
      getAllAddressesByUser {
        id
      }
    }
  `;

  const SHOW_ALL_ADDRESS_BY_USER = gql`
    query GetAllAddressesByUser {
      getAllAddressesByUser {
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
    }
  `;

  const { data: addressByUser, refetch: refetchAdd } = useQuery(
    SHOW_ALL_ADDRESS_BY_USER
  );
  // if(addressByUser){
  //   console.log("addressByUser", addressByUser);
  // }

  // CREATE ORDER
  const CREATE_ORDER = gql`
    mutation CreateOrder(
      $paymentMethod: String
      $totalAmount: Float
      $orderProducts: [OrderProducts]
      $shippingAddress: ID
      $billingAddress: ID
      $status: String
    ) {
      createOrder(
        paymentMethod: $paymentMethod
        totalAmount: $totalAmount
        orderProducts: $orderProducts
        shippingAddress: $shippingAddress
        billingAddress: $billingAddress
        status: $status
      ) {
        id
        user {
          email
          firstName
          id
          mobileNo
        }
        paymentMethod
        totalAmount
        orderProducts {
          productId {
            id
            productName
            priveiwName
            sellingPrice
          }
          price
          quantity
          packedImage
          shippedImage
          shippedBy
          trackingNo
          trackingUrl
        }
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
        status
        paymentStatus
        paymentProof
        paymentId
      }
    }
  `;

  // MAKE PAYMENT
  const MAKE_PAYMENT = gql`
    mutation MakePayment(
      $orderId: String
      $amount: String
      $firstname: String
      $email: String
      $phone: String
    ) {
      makePayment(
        orderId: $orderId
        amount: $amount
        firstname: $firstname
        email: $email
        phone: $phone
      ) {
        success
        message
        redirectUrl
      }
    }
  `;

  // const MAKE_PAYMENT = gql`
  //   mutation Mutation($amount: String, $firstname: String, $email: String, $phone: String) {
  //     makePayment(amount: $amount, firstname: $firstname, email: $email, phone: $phone) {
  //       success
  //       message
  //       redirectUrl
  //     }
  //   }
  // `;

  // CREATE SHIPPING ADDRESS
  const CREATE_SHIPPING_ADDRESS = gql`
    mutation CreateAddress(
      $addressLine1: String!
      $city: String!
      $state: String!
      $postalCode: String!
      $country: String!
      $addressLine2: String
      $mobileNo: String
      $lastName: String
      $firstName: String
    ) {
      createAddress(
        addressLine1: $addressLine1
        city: $city
        state: $state
        postalCode: $postalCode
        country: $country
        addressLine2: $addressLine2
        mobileNo: $mobileNo
        lastName: $lastName
        firstName: $firstName
      ) {
        id
      }
    }
  `;

  //   const CREATE_SHIPPING_ADDRESS = gql`
  //     mutation CreateAddress($addressLine1: String!, $city: String!, $state: String!, $postalCode: String!, $country: String!, $firstName: String, $lastName: String, $mobileNo: String, $addressLine2: String) {
  //       createAddress(addressLine1: $addressLine1, city: $city, state: $state, postalCode: $postalCode, country: $country, firstName: $firstName, lastName: $lastName, mobileNo: $mobileNo, addressLine2: $addressLine2) {
  //         id
  //       }
  //     }
  //  `;

  // GET CART
  const CART = gql`
    query Cart {
      cart {
        _id
        cartProducts {
          color
          gender
          size
          quantity
          productId {
            id
            priveiwName
            productName
            discount
            sellingPrice
            images {
              imagePath
              color
              gender
            }
          }
        }
      }
    }
  `;

  // Mutations and Query
  const [paymentMethod, setPaymentMethod] = useState("");

  const { data: cartData } = useQuery(CART);
  const { data: billingAddress } = useQuery(GET_BILLING_ADDRESS);
  const [createOrder, { data: orderData }] = useMutation(CREATE_ORDER, {
    onCompleted: () => {
      toast.success("Order Created Successfully");
    },
    onError: (error) => {
      toast.error("Some Error Occured");
      console.error("ERROR ", error.message);
    },
  });

  const [createPayment, { data: paymentData }] = useMutation(MAKE_PAYMENT, {
    onCompleted: () => {
      toast("Redirecting to payment Gateway");
      console.log("Create Payment Success");
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  const [createShippingAddress, { data: shippingData }] = useMutation(
    CREATE_SHIPPING_ADDRESS,
    {
      onCompleted: () => {
        toast.success("Address Saved Successfully");
        showModal(false);
        refetchAdd();
      },
      onError: (error) => {
        toast.error("Error ");
        console.error(error.message);
      },
    }
  );

  // if(orderData){
  //   console.log("orderData", orderData);
  // }

  // if(billingAddress){
  //   console.log("billingAddress", billingAddress?.getAllAddressesByUser[0]?.id);
  // }

  if (paymentData) {
    console.log("paymentData", paymentData);
  }

  // if(shippingData){
  //   console.log(shippingData?.createAddress?.id)
  // }

  useEffect(() => {
    if (paymentData?.makePayment?.success) {
      // navigate(paymentData?.makePayment?.redirectUrl);
      window.location.href = paymentData?.makePayment?.redirectUrl;
    }
  }, [paymentData?.makePayment]);

  const [addressForShipping, setAddressForShipping] = useState("");

  useEffect(() => {
    if (
      totalAmount &&
      state &&
      paymentMethod &&
      addressForShipping &&
      billingAddress?.getAllAddressesByUser[0]?.id
    ) {
      setPayNowCheck(false);
    }
  }, [
    paymentMethod,
    totalAmount,
    state,
    addressForShipping,
    billingAddress?.getAllAddressesByUser[0]?.id,
  ]);

  const [showProcessBtn, setShowProcessBtn] = useState(false);

  const handleOrder = async () => {
    const finalorderProduct = state.map(({ discount, ...rest }) => rest);

    const response = await createOrder({
      variables: {
        paymentMethod: paymentMethod,
        totalAmount: parseFloat(grandSum),
        orderProducts: finalorderProduct,
        shippingAddress: addressForShipping,
        billingAddress: billingAddress?.getAllAddressesByUser[0]?.id,
        status: "pending",
      },
    });

    if (
      response?.data &&
      response?.data?.createOrder?.paymentMethod === "COD"
    ) {
      navigate("/order");
    }

    if (
      response?.data &&
      response?.data?.createOrder?.user &&
      response?.data?.createOrder?.totalAmount &&
      response?.data?.createOrder?.paymentMethod === "ONLINE"
    ) {
      await createPayment({
        variables: {
          orderId: response?.data?.createOrder?.id,
          amount: String(response?.data?.createOrder?.totalAmount),
          firstname: response?.data?.createOrder?.user?.firstName,
          email: response?.data?.createOrder?.user?.email,
          phone: response?.data?.createOrder?.user?.mobileNo,
        },
      });
    }
  };

  // useEffect(() => {
  //   if(orderData?.createOrder?.user && orderData?.createOrder?.totalAmount && orderData?.createOrder?.paymentMethod){
  //     createPayment({
  //       variables : {
  //         amount: String(orderData?.createOrder?.totalAmount),
  //         firstname: orderData?.createOrder?.user?.firstName,
  //         email: orderData?.createOrder?.user?.email,
  //         phone: orderData?.createOrder?.user?.mobileNo,
  //       }
  //     });
  //     }
  // }, [orderData?.createOrder?.user]);

  const goToCart = () => {
    navigate("/shop/cart", { state });
  };

  // Setting Shipping Address ID
  useEffect(() => {
    if (shippingAsBilling) {
      console.log("bill", billingAddress?.getAllAddressesByUser[0]?.id);
      setShippingAddress(billingAddress?.getAllAddressesByUser[0]?.id);
    } else {
      console.log("ship", shippingData?.createAddress?.id);
      setShippingAddress(shippingData?.createAddress?.id);
    }
  }, [
    shippingAsBilling,
    shippingData?.createAddress?.id,
    billingAddress?.getAllAddressesByUser[0]?.id,
  ]);

  // console.log("shippingAsBilling", shippingAsBilling);
  // /////////////////// CREATE ADDRESS FORM ///////////////////////

  const phoneRegExp =
    /^(\+91)?(-)?\s*?(91)?\s*?(\d{3})-?\s*?(\d{3})-?\s*?(\d{4})$/;
  const pincodeRegExp = /^[0-9]*$/;

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Enter firstName"),
    lastName: Yup.string().required("Enter lastName"),
    mobileNo: Yup.string()
      .matches(phoneRegExp, "Mobile No is invalid")
      .required("Enter Mobile No"),
    address: Yup.string().required("Enter Address"),
    address2: Yup.string().required("Enter Landmark"),
    city: Yup.string().required("Enter your City name"),
    pincode: Yup.string()
      .matches(pincodeRegExp, "Pincode is not valid")
      .required("Enter Pincode"),
    state: Yup.string().required("Enter your State"),
    country: Yup.string().required("Country Name is required"),
  });

  const initialValues = {
    address: "",
    address2: "",
    city: "",
    pincode: "",
    state: "",
    country: "India",
    firstName: "",
    lastName: "",
    mobileNo: "",
  };

  const onSubmit = async (values, { resetForm }) => {
    await createShippingAddress({
      variables: {
        addressLine1: values.address,
        addressLine2: values.address2,
        postalCode: values.pincode,
        ...values,
      },
    });

    // console.log("createShippingAddress Clicked");
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  // handle coupon

  const [couponCode, setCouponCode] = useState("");
  const [DiscountPercentage, setDiscountPercentage] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [cartValue, setCartValue] = useState(0);

  const [invalidCoupon, setInvalidCoupon] = useState("");

  const GET_COUPON_DETAIL = gql`
    query GetCouponCodeByName($code: String) {
      getCouponCodeByName(code: $code) {
        couponName
        discount
        couponCode
      }
    }
  `;

  const [getCouponDiscount, { data: CouponData }] = useLazyQuery(
    GET_COUPON_DETAIL,
    {
      onCompleted: () => {
        if (CouponData?.getCouponCodeByName === null) {
          setInvalidCoupon("Invalid Coupon Code");
        } else if (CouponData) {
          setInvalidCoupon("");
          setDiscountPercentage(CouponData?.getCouponCodeByName?.discount);
          console.log("CouponData", CouponData);
          toast.success("Coupon Code Applied");
        }
      },
      onError: (err) => {
        toast.error("Invalid Coupon Code");
      },
    }
  );

  function handleCoupon() {
    getCouponDiscount({
      variables: {
        code: couponCode,
      },
    });
  }

  useEffect(() => {
    if (temp === undefined || state === undefined) {
      navigate("/");
    }

    let totalCartValue = totalAmount;
    let shipping = 0;
    let DiscountPercentage1 = 0;

    if (temp?.length > 0) {
      if (CouponData?.getCouponCodeByName?.discount > 0) {
        const DiscountPercentage11 = CouponData?.getCouponCodeByName?.discount;
        DiscountPercentage1 = DiscountPercentage11;
      } else {
        DiscountPercentage1 = 0;
      }
      if (couponCode === "") {
        DiscountPercentage1 = 0;
      }
      if (couponCode !== CouponData?.getCouponCodeByName?.couponCode) {
        DiscountPercentage1 = 0;
      }
      const DiscountedPrice =
        ((100 - DiscountPercentage1) * totalCartValue) / 100;

      setCouponDiscount(DiscountedPrice.toFixed(2));

      setCartValue(totalCartValue.toFixed(2));
      const totalSum = DiscountedPrice + shipping;
      setGrandSum(totalSum.toFixed(2));
    }
  }, [
    cartData?.cart?.cartProducts,
    couponCode,
    CouponData,
    couponDiscount,
    totalAmount,
    temp,
  ]);

  return (
    <>
      <div className="my-5 mx-5 d-flex">
        <Col className="col-md-10 col-10">
          <h5>THE ASSEMBLE CLOTHING</h5>
        </Col>

        <Col className="col-md-1 col-1">
          <Button
            variant="outline-dark"
            style={{ border: "none" }}
            className="d-inline"
            onClick={() => goToCart()}
          >
            <Cart size={26} />
          </Button>
        </Col>
      </div>

      <hr className="my-0 py-0" />
      <Row className="mx-3">
        <Col className="col-lg-7 col-12">
          {/* <Card>
      <Card.Body> */}
          <div className="accordion" id="accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  <h4> 1. Delivery Address </h4>
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  {addressByUser &&
                    addressByUser?.getAllAddressesByUser?.map(
                      (address, index) => (
                        <Card key={address.id} className="mb-5 mt-2">
                          <Card.Body className="mb-3">
                            <Row>
                              <div className="mb-3">
                                <div className="text-md text-muted mb-2">
                                  Address {index + 1}
                                </div>
                                <div>
                                  {address.firstName} {address.lastName}
                                </div>
                                <div>
                                  {address.addressLine1}, {address.addressLine2}
                                </div>
                                <div>
                                  {address.city}, {address.postalCode}
                                </div>
                                <div>
                                  {address.state}, {address.country}
                                </div>
                                <div>{address.mobileNo}</div>
                              </div>
                              <Form.Check
                                type="radio"
                                className="ms-0 me-3 px-4"
                                value={address.id}
                                name="address"
                                onChange={() =>
                                  setAddressForShipping(address.id)
                                }
                              />
                              <p className="px-2 mx-4">
                                Select this Address for Shipping
                              </p>
                            </Row>
                          </Card.Body>
                        </Card>
                      )
                    )}
                  <Button
                    onClick={() => showModal(true)}
                    className="my-2"
                    variant="outline-dark"
                  >
                    ADD NEW ADDRESS
                  </Button>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  <h4>2. Payment Method</h4>
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <Card>
                    <Card.Body>
                      <Form.Check
                        inline
                        label="ONLINE"
                        value="ONLINE"
                        name="paymentMethod"
                        type="radio"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* </Card.Body>
    </Card> */}

          <div className="mx-3 mt-5">
            {/* <h5>Shippin Address</h5>
        <Form.Check type='checkbox' className='ms-0 me-3 px-4' onChange={() => setShippingAsBilling(!shippingAsBilling)}/> <p className='px-2 mx-4'> Same as Billing Address</p>
  
        {!shippingAsBilling  && <>
        <h5>
          Add New Shipping Address
        </h5>
        <form id="sellerForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
          <div className="mb-3 d-flex filled form-group tooltip-end-top">
          
            <Form.Control type="text" className='col-6 ms-0 me-1' autoComplete="firstName"  name="firstName"
             onChange={handleChange} placeholder="Enter first Name..." value={values.firstName} />
             {errors.firstName && touched.firstName && <div className="d-block invalid-tooltip">{errors.firstName}</div>}
           
           <Form.Control  type="text"  autoComplete="lastName" className='col-6 me-0 ms-0' name="lastName" onChange={handleChange} placeholder="Enter last Name..." value={values.lastName} />
                      {errors.lastName && touched.lastName && <div className="d-block invalid-tooltip">{errors.lastName}</div>}
                    </div>
                    <div className="mb-3 filled form-group tooltip-end-top">
                     
                      <Form.Control
                        type="text"
                        autoComplete="mobileNo"
                        name="mobileNo"
                        maxLength={10}
                        onChange={handleChange}
                        placeholder="Enter mobile No..."
                        value={values.mobileNo}
                      />
                      {errors.mobileNo && touched.mobileNo && <div className="d-block invalid-tooltip">{errors.mobileNo}</div>}
                    </div>
                    <div className="mb-3 filled form-group tooltip-end-top">
                      
                      <Form.Control
                        type="text"
                        autoComplete="street-address"
                        name="address"
                        onChange={handleChange}
                        placeholder="Enter House No, Colony name..."
                        value={values.address}
                      />
                      {errors.address && touched.address && <div className="d-block invalid-tooltip">{errors.address}</div>}
                    </div>
                    <div className="mb-3 filled form-group tooltip-end-top">
                       
                      <Form.Control type="text" name="address2" onChange={handleChange} placeholder="Enter Street No, Area, Landmark" value={values.address2} />
                      {errors.address2 && touched.address2 && <div className="d-block invalid-tooltip">{errors.address2}</div>}
                    </div>
                    <div className="mb-3 d-flex filled form-group tooltip-end-top">
                      
                      <Form.Control  type="text" className='col-6 ms-0 me-1' name="city" onChange={handleChange} placeholder="Enter City" value={values.city} />
                      {errors.city && touched.city && <div className="d-block invalid-tooltip">{errors.city}</div>}
                   
                      
                      <Form.Control className='col-6 me-0 ms-0' type="text" name="pincode" onChange={handleChange} placeholder="Enter Pincode" value={values.pincode} maxLength={6} />
                      {errors.pincode && touched.pincode && <div className="d-block invalid-tooltip">{errors.pincode}</div>}
                    </div>
                    <div className="mb-3 d-flex filled form-group tooltip-end-top">
                      
                      <Form.Select className='col-6 ms-0 me-1' name="state" onChange={handleChange} aria-label="Default select example">
                        <option>Select State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Dadar and Nagar Haveli">Dadar and Nagar Haveli</option>
                        <option value="Daman and Diu">Daman and Diu</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                        <option value="Puducherry">Puducherry</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                      </Form.Select>
                      
                      <Form.Control className='col-6 me-0 ms-0' type="text" name="country" onChange={handleChange} placeholder="Enter Country" value={values.country} />
                      {errors.country && touched.country && <div className="d-block invalid-tooltip">{errors.country}</div>}
                    </div>
                    <div className="text-center">
                      
                      <Button variant="primary" className="btn-icon btn-icon-start mb-3" type="submit">
                        Submit Address
                      </Button>
                    </div>
                  </form>
           </>} */}
          </div>

          {!showProcessBtn && (
            <Row className="mt-5 mb-5 mx-4 px-4">
              <Button
                disabled={payNowCheck}
                className="py-3 "
                style={{
                  backgroundColor: "black",
                  color: "white",
                  fontSize: "20px",
                  border: "1px solid black",
                }}
                onClick={() => {
                  handleOrder();
                  setShowProcessBtn(true);
                }}
              >
                PAY NOW
              </Button>
            </Row>
          )}

          {showProcessBtn && (
            <Row className="mt-5 mb-5 mx-4 px-4">
              <Button
                className="py-3 "
                style={{
                  backgroundColor: "black",
                  color: "white",
                  fontSize: "20px",
                  border: "1px solid black",
                }}
              >
                PROCESSING...
              </Button>
            </Row>
          )}
        </Col>

        <Col
          className="col-lg-5 col-12 my-0 py-0"
          style={{ backgroundColor: "#fafafa" }}
        >
          {/* Cart Summary  */}
          <div className="mt-5"></div>
          {cartData?.cart?.cartProducts?.length > 0 &&
            temp?.map((item, index) => (
              <div key={index} className="mb-1 mx-md-1 mx-0 px-0 mt-1">
                <Row className="my-2 mx-0 ">
                  <Col className="col-md-3 col-4 mx-md-1 mx-0 px-0">
                    <img
                      style={{
                        height: "100px",
                        width: "70px",
                        border: "2px solid black",
                      }}
                      className="ms-3"
                      src={item?.image}
                      alt="s"
                    />
                  </Col>
                  <Col className="col-md-5 col-4 mx-0 mx-md-2 px-0 flex-wrap">
                    <p className="fs-6 my-0 py-0 mx-1">{item?.productName}</p>

                    <p className="fs-6 my-0 py-0 mx-1">{`${item?.size}/${item?.color}/${item?.gender}`}</p>
                    {/* <p className="fs-6 my-0 py-0 mx-1">{item?.color}</p> */}
                    {/* <p className="fs-6 my-0 py-0 mx-1">{item?.gender}</p> */}
                  </Col>
                  <Col className="col-md-3 col-4">
                    {/* <Row> */}

                    <p>{item?.quantity} Pc</p>

                    <p className="fw-bold">
                      {/* ₹ {item?.quantity * item?.sellingPrice} */}
                      {item?.quantity *
                        ((1 - item?.discount / 100) * item?.sellingPrice)}
                    </p>

                    {/* </Row> */}
                  </Col>
                </Row>
              </div>
            ))}
          <hr />

          <Row className="my-2">
            <Col className="fs-5 fw-bold mx-1 col-7 col-lg-8 col-md-9 ">
              <input
                className="w-100"
                name="coupon"
                type="text"
                placeholder="Enter Coupon Code"
                onChange={(e) => setCouponCode(e.target.value)}
                value={couponCode}
              />
            </Col>
            <Col className="fs-5 fw-bold mx-1 col-4 d-inline col-lg-3 col-md-2">
              <Button
                disabled={couponCode === ""}
                className="btn-icon btn-icon-end w-100"
                variant="primary"
                onClick={() => handleCoupon()}
              >
                <span>Apply</span>
              </Button>
            </Col>
            {invalidCoupon && (
              <>
                <div className="text-danger">{invalidCoupon}</div>
              </>
            )}
          </Row>
          <Row className="my-2">
            <Col className="fs-5 fw-bold mx-1 col-7 col-lg-8 col-md-9 ">
              Total
            </Col>
            {/* col-lg-7 col-md-5  */}
            <Col className="fs-5 fw-bold mx-1 col-4 d-inline col-lg-3 col-md-2">
              ₹ {totalAmount}
            </Col>
            {/* col-lg-3 col-md-1 */}
          </Row>
          {/* <Row className="my-2">
            <Col className="fs-5 fw-bold mx-1 col-7 col-lg-8 col-md-9 ">
              Coupon Code Discount
            </Col>
            <Col className="fs-5 fw-bold mx-1 col-4 d-inline col-lg-3 col-md-2">
              {DiscountPercentage} %
            </Col>
          </Row> */}
          {couponDiscount && (
            <Row>
              <Col className="fs-5 fw-bold mx-1 col-7 col-lg-8 col-md-9 ">
                Coupon Discount
              </Col>
              <Col className="fs-5 fw-bold mx-1 col-4 d-inline col-lg-3 col-md-2">
                {/* {DiscountPercentage} % */}
                {!DiscountPercentage || DiscountPercentage <= 0 ? (
                  <>&#8377; 0.00 </>
                ) : (
                  <> - &#8377; {(cartValue - couponDiscount).toFixed(2)}</>
                )}
              </Col>
            </Row>
          )}
          <Row className="my-2">
            <Col className="fs-5 fw-bold mx-1 col-7 col-lg-8 col-md-9 ">
              GRAND TOTAL
            </Col>
            <Col className="fs-5 fw-bold mx-1 col-4 d-inline col-lg-3 col-md-2">
              {grandSum && (
                <p className="mb-1 fw-bolder"> &#8377; {grandSum}</p>
              )}
            </Col>
          </Row>
          {/* <div className='my-2'>
      <p className='fw-bold d-inline fs-5 ms-3' style={{marginRight: "40px", paddingRight: "50px"}}>SUBTOTAL </p>
      <p className='fw-bold d-inline fs-5' style={{ marginLeft: "140px", alignItems: "end", alignContent: "end"}}>
         ₹ {totalAmount}
      </p>
    </div> */}
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
          <Modal.Title as="h5"> Add New Address </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            id="sellerForm"
            className="tooltip-end-bottom"
            onSubmit={handleSubmit}
          >
            <div className="mb-3 d-flex filled form-group tooltip-end-top">
              <Form.Control
                type="text"
                className="col-6 ms-0 me-1"
                autoComplete="firstName"
                name="firstName"
                onChange={handleChange}
                placeholder="Enter first Name..."
                value={values.firstName}
              />
              {errors.firstName && touched.firstName && (
                <div className="d-block invalid-tooltip">
                  {errors.firstName}
                </div>
              )}
              <Form.Control
                type="text"
                autoComplete="lastName"
                className="col-6 me-0 ms-0"
                name="lastName"
                onChange={handleChange}
                placeholder="Enter last Name..."
                value={values.lastName}
              />
              {errors.lastName && touched.lastName && (
                <div className="d-block invalid-tooltip">{errors.lastName}</div>
              )}
            </div>
            <div className="mb-3 filled form-group tooltip-end-top">
              <Form.Control
                type="text"
                autoComplete="mobileNo"
                name="mobileNo"
                maxLength={10}
                onChange={handleChange}
                placeholder="Enter mobile No..."
                value={values.mobileNo}
              />
              {errors.mobileNo && touched.mobileNo && (
                <div className="d-block invalid-tooltip">{errors.mobileNo}</div>
              )}
            </div>
            <div className="mb-3 filled form-group tooltip-end-top">
              {/* <CsLineIcons icon="home" /> */}
              <Form.Control
                type="text"
                autoComplete="street-address"
                name="address"
                onChange={handleChange}
                placeholder="Enter House No, Colony name..."
                value={values.address}
              />
              {errors.address && touched.address && (
                <div className="d-block invalid-tooltip">{errors.address}</div>
              )}
            </div>
            <div className="mb-3 filled form-group tooltip-end-top">
              {/* <CsLineIcons icon="home" /> */}
              <Form.Control
                type="text"
                name="address2"
                onChange={handleChange}
                placeholder="Enter Street No, Area, Landmark"
                value={values.address2}
              />
              {errors.address2 && touched.address2 && (
                <div className="d-block invalid-tooltip">{errors.address2}</div>
              )}
            </div>
            <div className="mb-3 d-flex filled form-group tooltip-end-top">
              {/* <CsLineIcons icon="building-large" /> */}
              <Form.Control
                type="text"
                className="col-6 ms-0 me-1"
                name="city"
                onChange={handleChange}
                placeholder="Enter City"
                value={values.city}
              />
              {errors.city && touched.city && (
                <div className="d-block invalid-tooltip">{errors.city}</div>
              )}

              {/* <CsLineIcons icon="bookmark" /> */}
              <Form.Control
                className="col-6 me-0 ms-0"
                type="text"
                name="pincode"
                onChange={handleChange}
                placeholder="Enter Pincode"
                value={values.pincode}
                maxLength={6}
              />
              {errors.pincode && touched.pincode && (
                <div className="d-block invalid-tooltip">{errors.pincode}</div>
              )}
            </div>
            <div className="mb-3 d-flex filled form-group tooltip-end-top">
              {/* <CsLineIcons icon="plane" /> */}
              <Form.Select
                className="col-6 ms-0 me-1"
                name="state"
                onChange={handleChange}
                aria-label="Default select example"
              >
                <option>Select State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Andaman and Nicobar Islands">
                  Andaman and Nicobar Islands
                </option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Dadar and Nagar Haveli">
                  Dadar and Nagar Haveli
                </option>
                <option value="Daman and Diu">Daman and Diu</option>
                <option value="Delhi">Delhi</option>
                <option value="Lakshadweep">Lakshadweep</option>
                <option value="Puducherry">Puducherry</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
              </Form.Select>
              {/* <Form.Control type="text" name="state" onChange={handleChange} placeholder="Enter State" value={values.state} />
                      {errors.state && touched.state && <div className="d-block invalid-tooltip">{errors.state}</div>} */}

              {/* <CsLineIcons icon="web" /> */}
              <Form.Control
                className="col-6 me-0 ms-0"
                type="text"
                name="country"
                onChange={handleChange}
                placeholder="Enter Country"
                value={values.country}
              />
              {errors.country && touched.country && (
                <div className="d-block invalid-tooltip">{errors.country}</div>
              )}
            </div>
            <div className="text-center">
              {/* <Button onClick={() => setAddressModal(false)} variant="primary" className="btn-icon me-2">
                        Cancel
                      </Button> */}
              <Button
                variant="primary"
                className="btn-icon btn-icon-start mb-3"
                type="submit"
              >
                Submit Address
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Checkout;
