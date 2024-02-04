import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { Row, Col, Button, Dropdown, Card, Modal, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { gql, useLazyQuery, useMutation } from "@apollo/client";

const OrdersDetail = () => {
  const title = "Order Detail";
  const { orderID } = useParams();
  
  // const GET_ORDER = gql`
  // query GetOrder($getOrderId: ID!) {
  //   getOrder(id: $getOrderId) {
  //     id
  //     user {
  //       lastName
  //       id
  //       firstName
  //     }
  //     paymentMethod
  //     totalAmount
  //     orderProducts {
  //       productId {
  //         id
  //         priveiwName
  //         productName
  //       }
  //     }
  //     shippingAddress {
  //       firstName
  //       id
  //     }
  //     billingAddress {
  //       id
  //       firstName
  //     }
  //     status
  //     paymentStatus
  //     paymentProof
  //     paymentId
  //   }
  // }`;


  const GET_ORDER = gql`
    query GetOrder($getOrderId: ID!) {
      getOrder(id: $getOrderId) {
        id
        paymentMethod
        totalAmount
        shippingAddress {
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
        orderProducts {
          productId {
            id
            productName
            priveiwName
          }
          price
          quantity
          shippedImage
          trackingNo
          trackingUrl
        }
      }
    }
  `;

  const [GetOrder, { data: orderDetailData, refetch }] = useLazyQuery(
    GET_ORDER,
    {
      variables: {
        getOrderId: orderID,
      },
      onCompleted: (res) => {
        console.log("res", res.getOrder);
      },
      onError: (error) => {
        console.error("GetOrder", error);
      },
    }
  );

  useEffect(() => {
    GetOrder();
  }, []);

  const [totalCartValue, setTotalCartValue] = useState(0);

  useEffect(() => {
    if (orderDetailData && orderDetailData.getOrder) {
      const { orderProducts } = orderDetailData.getOrder;

      const calculatedTotalCartValue = orderProducts.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );

      setTotalCartValue(calculatedTotalCartValue);
    }
  }, [orderDetailData]);

  // handle dropdown

  const [orderStatus, setorderStatus] = useState("Pending");
  const [formErrors, setFormErrors] = useState({});

  // all modals

  const [packedmodalShow, setpackedModalShow] = useState(false);
  const [shippedmodalShow, setshippedModalShow] = useState(false);
  const [deliveredmodalShow, setdeliveredModalShow] = useState(false);

  const initialFormData = {
    orderPackedId: orderID,
    status: "",
    file: null,
    packedDate: "",
  };

  const initialshippedFormData = {
    orderShippedId: orderID,
    status: "",
    file: null,
    trackingNo: "",
    trackingUrl: "",
    shippedDate: "",
  };

  const initialdeliveredFormData = {
    orderDeliveredId: orderID,
    status: "",
    deliveredDate: "",
  };

  const [packedFormData, setpackedFormData] = useState(initialFormData);

  const [shippedformData, setshippedFormData] = useState(
    initialshippedFormData
  );

  const [deliveredformData, setdeliveredFormData] = useState(
    initialdeliveredFormData
  );

  const [checkProductList, setcheckProductList] = useState({
    orderProducts: [],
  });

  const [selectedPackageIdentifiers, setSelectedPackageIdentifiers] = useState(
    []
  );

  const handleSelect = (orderkaStatus) => {
    setFormErrors({});
    setcheckProductList({ orderProducts: [] });
    setSelectedPackageIdentifiers([]);

    if (orderkaStatus === "pending") {
      return;
    }
    if (orderkaStatus === "packed") {
      setpackedModalShow(true);
      setpackedFormData((prevValue) => ({
        ...prevValue,
        status: orderkaStatus,
      }));
    }
    if (orderkaStatus === "shipped") {
      setshippedModalShow(true);
      setshippedFormData((prevValue) => ({
        ...prevValue,
        status: orderkaStatus,
      }));
    }
    if (orderkaStatus === "delivered") {
      setdeliveredModalShow(true);
      setdeliveredFormData((prevValue) => ({
        ...prevValue,
        status: orderkaStatus,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setpackedFormData((prevValue) => ({
        ...prevValue,
        [name]: files[0],
      }));
    } else {
      setpackedFormData((prevValue) => ({
        ...prevValue,
        [name]: value,
      }));
    }
  };

  // handleCheckboxChange

  const handleCheckboxChange = (event, productId) => {
    const { name, checked } = event.target;

    // Check if the checkbox is checked or unchecked
    if (checked) {
      // Create an object with the productId
      const productToAdd = { productId };

      // Add the object to the orderProducts array in the packedFormData
      setcheckProductList((prevData) => ({
        ...prevData,
        orderProducts: [...prevData.orderProducts, productToAdd],
      }));
    } else {
      // Remove the object with the productId from the orderProducts array
      setcheckProductList((prevData) => ({
        ...prevData,
        orderProducts: prevData.orderProducts.filter(
          (product) => product.productId !== productId
        ),
      }));
    }
  };

  // handle validation

  const validateForm = () => {
    const errors = {};

    if (!packedFormData.status.trim()) {
      errors.status = "Status is required.";
    }

    if (!packedFormData.packedDate.trim()) {
      errors.packedDate = "Date is required.";
    }

    if (!packedFormData.file) {
      errors.file = "Package Image is required.";
    }
    if (!checkProductList.orderProducts.length) {
      errors.productlist = "Product Selection is required.";
    }

    return errors;
  };

  // order shipped

  const ORDER_SHIPPED = gql`
  mutation OrderShipped($orderShippedId: ID, $status: String, $orderProducts: [OrderProducts], $file: Upload, $trackingNo: String, $trackingUrl: String, $shippedDate: String) {
    orderShipped(id: $orderShippedId, status: $status, orderProducts: $orderProducts, file: $file, trackingNo: $trackingNo, trackingUrl: $trackingUrl, shippedDate: $shippedDate) {
      id
    }
  }`;

  // const ORDER_SHIPPED = gql`
  //   mutation OrderShipped(
  //     $orderShippedId: ID
  //     $status: String
  //     $file: Upload
  //     $shippedBy: String
  //     $trackingNo: String
  //     $trackingUrl: String
  //     $shippedDate: String
  //     $orderProducts: [OrderProducts]
  //   ) {
  //     orderShipped(
  //       id: $orderShippedId
  //       status: $status
  //       file: $file
  //       shippedBy: $shippedBy
  //       trackingNo: $trackingNo
  //       trackingUrl: $trackingUrl
  //       shippedDate: $shippedDate
  //       orderProducts: $orderProducts
  //     ) {
  //       id
  //     }
  //   }
  // `;

  const [OrderShipped, { loading: shippedLoading }] = useMutation(
    ORDER_SHIPPED,
    {
      onCompleted: () => {
        refetch();
        setshippedModalShow(false);
        setshippedFormData(initialshippedFormData);
        setcheckProductList({ orderProducts: [] });
      },
      onError: (error) => {
        console.error("ORDER_SHIPPED", error);
      },
    }
  );

  const handleshippedItemChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setshippedFormData((prevValue) => ({
        ...prevValue,
        [name]: files[0],
      }));
    } else {
      setshippedFormData((prevValue) => ({
        ...prevValue,
        [name]: value,
      }));
    }
  };

  const handleshippedSubmit = async (e) => {
    e.preventDefault();

    console.log("shippedformData", shippedformData);
    console.log(
      "checkProductList.orderProducts",
      checkProductList.orderProducts
    );
    await OrderShipped({
      variables: {
        ...shippedformData,
        orderProducts: checkProductList.orderProducts,
      },
    });
  };

  // handle delivered item

  const ORDER_DELIVERED = gql`
    mutation OrderDelivered(
      $orderDeliveredId: ID
      $status: String
      $deliveredDate: String
      $orderProducts: [OrderProducts]
    ) {
      orderDelivered(
        id: $orderDeliveredId
        status: $status
        deliveredDate: $deliveredDate
        orderProducts: $orderProducts
      ) {
        id
      }
    }
  `;

  const [OrderDelivered, { loading: deliveryLoading }] = useMutation(
    ORDER_DELIVERED,
    {
      onCompleted: () => {
        refetch();
        setdeliveredModalShow(false);
        setdeliveredFormData(initialdeliveredFormData);
        setcheckProductList({ orderProducts: [] });
      },
      onError: (error) => {
        console.error("ORDER_DELIVERED", error);
      },
    }
  );

  const handledeliveredItemChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setshippedFormData((prevValue) => ({
        ...prevValue,
        [name]: files[0],
      }));
    } else {
      setshippedFormData((prevValue) => ({
        ...prevValue,
        [name]: value,
      }));
    }
  };

  const handledeliveredSubmit = async (e) => {
    e.preventDefault();
    await OrderDelivered({
      variables: {
        ...deliveredformData,
        orderProducts: checkProductList.orderProducts,
      },
    });
  };
  // handle multiple shipmemt

  const handlemultipleCheckboxChange = (packageIdentifier) => {
    if (selectedPackageIdentifiers.includes(packageIdentifier)) {
      setSelectedPackageIdentifiers(
        selectedPackageIdentifiers.filter((id) => id !== packageIdentifier)
      );
    } else {
      setSelectedPackageIdentifiers([
        ...selectedPackageIdentifiers,
        packageIdentifier,
      ]);
    }
  };

  useEffect(() => {
    if (orderDetailData?.getOrder?.orderProducts) {
      const selectedProducts = orderDetailData.getOrder.orderProducts
        .filter((product) =>
          selectedPackageIdentifiers.includes(product.packageIdentifier)
        )
        .map((product) => ({
          variantId: product.variantId.id,
        }));

      setcheckProductList((prevData) => ({
        ...prevData,
        orderProducts: selectedProducts,
      }));
    }
  }, [selectedPackageIdentifiers]);

  return (<>
    <div className="page-title-container">
      <Row className="g-0">
        <Col className="col-auto mb-3 mb-sm-0 me-auto">
          <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back"
              to="/seller/order/list">
            <span className="align-middle text-small ms-1">Seller</span>
          </NavLink>
          <h1 className="mb-0 pb-0 display-4" id="title">{title}</h1>
        </Col>
        {orderDetailData?.getOrder && (
        <Col xs="12" sm="auto" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
          <Dropdown onSelect={handleSelect} className="w-100 w-md-auto">
            <Dropdown.Toggle className="w-100 w-md-auto" variant="outline-primary">
            Status: {orderStatus}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="pending">
                Status: Pending
              </Dropdown.Item>
              <Dropdown.Item eventKey="shipped">
                Status: Shipped
              </Dropdown.Item>
              <Dropdown.Item eventKey="delivered">
                Status: Delivered
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="ms-1">
            <Dropdown.Toggle className="btn-icon btn-icon-only dropdown-toggle-no-arrow" variant="outline-primary" ></Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <NavLink to={`/invoice?orderID=${orderID}`}> View Invoice </NavLink>
                </Dropdown.Item>
                <Dropdown.Item> Track Package </Dropdown.Item>
              </Dropdown.Menu>
          </Dropdown>
        </Col>)}
      </Row>
    </div>

    {orderDetailData?.getOrder && (
      <Row>
        <Col xl="8" xxl="9">
          <h2 className="small-title">Status</h2>
          <Row className="g-2 mb-5">
            <Col sm="6">
                <Card className="sh-13 sh-lg-15 sh-xl-14">
                  <Card.Body className="h-100 py-3 d-flex align-items-center">
                    <Row className="g-0 align-items-center">
                      <Col xs="auto" className="pe-3">
                        <div className="border border-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center"></div>
                      </Col>
                      <Col>
                        <div className="d-flex align-items-center lh-1-25">
                          Order Id
                        </div>
                        <div className="text-primary">
                          {orderDetailData.getOrder.id}
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
            </Col>
            <Col sm="6">
                <Card className="sh-13 sh-lg-15 sh-xl-14">
                  <Card.Body className="h-100 py-3 d-flex align-items-center">
                    <Row className="g-0 align-items-center">
                      <Col xs="auto" className="pe-3">
                        <div className="border border-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center"></div>
                      </Col>
                      <Col>
                        <div className="d-flex align-items-center lh-1-25">
                          Order Status
                        </div>
                        <div className="text-primary">
                          {orderDetailData.getOrder.status}
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
            </Col>
            <Col sm="6">
              <Card className="sh-13 sh-lg-15 sh-xl-14">
                  <Card.Body className="h-100 py-3 d-flex align-items-center">
                    <Row className="g-0 align-items-center">
                      <Col xs="auto" className="pe-3">
                        <div className="border border-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center"></div>
                      </Col>
                      <Col>
                        <div className="d-flex align-items-center lh-1-25">
                          Delivery Date
                        </div>
                        <div className="text-primary">
                          {orderDetailData.getOrder.paymentMethod
                            .replace("_", " ")
                            .toUpperCase()}{" "}
                          17.11.2023
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
              </Card>
            </Col>
            <Col sm="6">
                <Card className="sh-13 sh-lg-15 sh-xl-14">
                  <Card.Body className="h-100 py-3 d-flex align-items-center">
                    <Row className="g-0 align-items-center">
                      <Col xs="auto" className="pe-3">
                        <div className="border border-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center"></div>
                      </Col>
                      <Col>
                        <div className="d-flex align-items-center lh-1-25">
                          Tracking Code
                        </div>
                        <div className="text-primary">US4244290109</div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
            </Col>
          </Row>
          {/* Status End */}

          {/* Cart Start */}
          <h2 className="small-title mt-3">Cart</h2>
          <Card className="mb-5">
            <Card.Body>
              <div className="mb-5">
                {orderDetailData.getOrder.orderProducts.length > 0 && (
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Product Name</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetailData.getOrder.orderProducts.map((product, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="ps-3">
                                <div>{product.productId.productName}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Row className="g-0">
                              <Col xs="6" className="d-flex flex-row pe-2 align-items-end text-alternate" >
                                <span>{product.quantity}</span>
                                <span className="text-muted ms-1 me-1"> x </span>
                                <span> {product.price}  </span>
                              </Col>
                              <Col xs="6" className="d-flex flex-row align-items-end justify-content-end text-alternate" >
                                <span>
                                <span className="text-small">₹ </span>
                                {product.quantity * product.price}
                                </span>
                              </Col>
                            </Row>
                          </td>
                      </tr>))}
                    </tbody>
                  </table>)}
              </div>

              <div>
                <Row className="g-0 mb-2">
                  <Col xs="auto" className="ms-auto ps-3 text-muted pe-2">
                    Total {"  "}
                  </Col>
                  <Col xs="auto" className="sw-13 text-end">
                    <span>
                      <span className="text-muted">₹ </span>
                      {totalCartValue && totalCartValue}
                    </span>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
            {/* Cart End */}
        </Col>

        <Col xl="4" xxl="3">
          {/* Address Start */}
          <h2 className="small-title">Address</h2>
            <Card className="mb-5">
              <Card.Body className="mb-n5">
                {orderDetailData.getOrder?.user && (<div className="mb-5">
                    <p className="text-small text-muted mb-2">CUSTOMER</p>
                    <Row className="g-0 mb-2">
                      <Col xs="auto">
                        <div className="sw-3 me-1"></div>
                      </Col>
                      <Col className="text-alternate">
                        {orderDetailData.getOrder.user.firstName}{" "}
                        {orderDetailData.getOrder.user.lastName}
                      </Col>
                    </Row>
                    <Row className="g-0 mb-2">
                      <Col xs="auto">
                        <div className="sw-3 me-1"></div>
                      </Col>
                      <Col className="text-alternate">
                        {orderDetailData.getOrder.user.email}
                      </Col>
                    </Row>
                </div>)}
                {orderDetailData.getOrder.shippingAddress && (<div className="mb-5">
                    <p className="text-small text-muted mb-2">
                      SHIPPING ADDRESS
                    </p>
                    <Row className="g-0 mb-2">
                      <Col xs="auto">
                        <div className="sw-3 me-1"></div>
                      </Col>
                      <Col className="text-alternate">
                        {orderDetailData.getOrder.shippingAddress.firstName}{" "}
                        {orderDetailData.getOrder.shippingAddress.lastName}
                      </Col>
                    </Row>
                    <Row className="g-0 mb-2">
                      <Col xs="auto">
                        <div className="sw-3 me-1"></div>
                      </Col>
                      <Col className="text-alternate">
                        {orderDetailData.getOrder.shippingAddress.addressLine1}{" "}
                        {orderDetailData.getOrder.shippingAddress.addressLine2}
                        <br />
                        {orderDetailData.getOrder.shippingAddress.city},{" "}
                        {orderDetailData.getOrder.shippingAddress.postalCode},{" "}
                        {orderDetailData.getOrder.shippingAddress.state},{" "}
                        {orderDetailData.getOrder.shippingAddress.country}
                      </Col>
                    </Row>
                    <Row className="g-0 mb-2">
                      <Col xs="auto">
                        <div className="sw-3 me-1"></div>
                      </Col>
                      <Col className="text-alternate">
                        {orderDetailData.getOrder.shippingAddress.mobileNo}
                      </Col>
                    </Row>
                </div>)}
                {orderDetailData.getOrder.billingAddress && (
                  <div className="mb-5">
                    <p className="text-small text-muted mb-2">
                      BILLING ADDRESS
                    </p>
                    <Row className="g-0 mb-2">
                      <Col xs="auto">
                        <div className="sw-3 me-1"></div>
                      </Col>
                      <Col className="text-alternate">
                        {orderDetailData.getOrder.billingAddress.firstName}{" "}
                        {orderDetailData.getOrder.billingAddress.lastName}
                      </Col>
                    </Row>
                    <Row className="g-0 mb-2">
                      <Col xs="auto">
                        <div className="sw-3 me-1"></div>
                      </Col>
                      <Col className="text-alternate">
                        {orderDetailData.getOrder.billingAddress.addressLine1}{" "}
                        {orderDetailData.getOrder.billingAddress.addressLine2}
                        ,
                        <br />
                        {orderDetailData.getOrder.billingAddress.city},{" "}
                        {orderDetailData.getOrder.billingAddress.postalCode},
                        {orderDetailData.getOrder.billingAddress.state},{" "}
                        {orderDetailData.getOrder.billingAddress.country}
                      </Col>
                    </Row>
                    <Row className="g-0 mb-2">
                      <Col xs="auto">
                        <div className="sw-3 me-1"></div>
                      </Col>
                      <Col className="text-alternate">
                        {orderDetailData.getOrder.billingAddress.mobileNo}
                      </Col>
                    </Row>
                  </div>
                )}

                <div className="mb-5">
                  <p className="text-small text-muted mb-2">PAYMENT</p>
                  <Row className="g-0 mb-2">
                    <Col xs="auto">
                      <div className="sw-3 me-1"></div>
                    </Col>
                    <Col className="text-alternate">
                      {orderDetailData.getOrder.paymentMethod}
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
            {/* Address End */}
          </Col>
        </Row>
      )}

      {/* status shipped handle  */}
      <Modal show={shippedmodalShow} onHide={() => setshippedModalShow(false)}>
        <Modal.Header className="mx-2 my-2 px-2 py-2" closeButton>
          <Modal.Title>Order Shipped</Modal.Title>
        </Modal.Header>
        <Modal.Body className="mx-2 my-2 px-2 py-2">
          <Form onSubmit={handleshippedSubmit}>
            <div className="mb-3">
              <Form.Label className="fs-5">Order Status</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={shippedformData.status}
                disabled
              />
            </div>
            <div className="mb-3">
              <Form.Label className="fs-5">Tracking No</Form.Label>
              <Form.Control
                type="text"
                name="trackingNo"
                value={shippedformData.trackingNo}
                onChange={handleshippedItemChange}
              />
            </div>
            <div className="mb-3">
              <Form.Label className="fs-5">Tracking Url</Form.Label>
              <Form.Control
                type="text"
                name="trackingUrl"
                value={shippedformData.trackingUrl}
                onChange={handleshippedItemChange}
              />
            </div>
            <div className="mb-3">
              <Form.Label className="fs-5">Package Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                name="file"
                onChange={handleshippedItemChange}
              />
            </div>
            <div className="mb-3">
              <Form.Label className="fs-5">Date</Form.Label>
              <Form.Control
                type="date"
                name="shippedDate"
                onChange={handleshippedItemChange}
              />
            </div>

            <div className="mb-3">
              {orderDetailData?.getOrder?.orderProducts.length > 0 && (
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Product</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetailData.getOrder.orderProducts.map(
                      (product, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="ps-3">
                                <div>{product.productId.productName}</div>
                              </div>
                              <div className="ms-5">
                                <Form.Check
                                  type="checkbox"
                                  name="orderProducts"
                                  inline
                                  onChange={(event) =>
                                    handleCheckboxChange(
                                      event,
                                      product.productId.id
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>

            <div className="d-flex justify-content-center mt-4">
              {shippedLoading ? (
                <Button>Loading</Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* status delivered handle  */}
      <Modal
        show={deliveredmodalShow}
        onHide={() => setdeliveredModalShow(false)}
      >
        <Modal.Header className="mx-2 my-2 px-2 py-2" closeButton>
          <Modal.Title>Order Delivered </Modal.Title>
        </Modal.Header>
        <Modal.Body className="mx-2 my-2 px-2 py-2">
          <Form onSubmit={handledeliveredSubmit}>
            <div className="mb-3">
              <Form.Label className="fs-5">Order Status</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={deliveredformData.status}
                disabled
              />
            </div>
            <div className="mb-3">
              <Form.Label className="fs-5">Delivered Date</Form.Label>
              <Form.Control
                type="date"
                name="deliveredDate"
                onChange={handledeliveredItemChange}
              />
            </div>

            <div className="mb-3">
              {orderDetailData?.getOrder?.orderProducts?.length > 0 && (
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Product</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetailData.getOrder.orderProducts
                      // .filter(
                      //   (item) =>
                      //     item.shipped === true && !item.delivered === true
                      // )
                      .map((product, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="ps-3">
                                <div>{product?.productId?.productName}</div>
                                {/* <div className="text-muted text-small">{}</div> */}
                                {/* <Row className="g-0">
                                  <Col
                                    xs="6"
                                    className="d-flex flex-row pe-2 align-items-end text-alternate"
                                  >
                                    {product.variantId.variantName}
                                  </Col>
                                </Row> */}
                                {/* <div className="text-muted text-small">
                                  {product.packageIdentifier}
                                </div> */}
                              </div>
                              <div className="mb-2 ms-5">
                                <Form.Check
                                  type="checkbox"
                                  name="orderProducts"
                                  inline
                                  onChange={() =>
                                    handlemultipleCheckboxChange(
                                      product?.productId?.id
                                    )
                                  }
                                  checked={selectedPackageIdentifiers.includes(
                                    product?.productId?.id
                                  )}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="d-flex justify-content-center mt-4">
              {deliveryLoading ? (
                <Button>Loading</Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </div>
          </Form>
        </Modal.Body>
      </Modal>
  </>);
};

export default OrdersDetail;
