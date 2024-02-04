import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { Card, Col, Row, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import moment from "moment";

function ListOrder() {
  const LIST_ORDER = gql`
    query GetAllOrder {
      getAllOrder {
        id
        createdAt
        paymentId
        paymentMethod
        paymentProof
        paymentStatus
        status
        totalAmount
        user {
          firstName
          lastName
        }
      }
    }
  `;

  const { data: orderData, error, loading } = useQuery(LIST_ORDER);
  if (error) {
    console.error("error", error);
  }

  // handle searching

  const [searchQuery, setsearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (orderData?.getAllOrder) {
      setFilteredData(orderData.getAllOrder);
    }
  }, [orderData]);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setsearchQuery(searchTerm);

    const filteredItems = orderData.getAllOrder?.filter((item) =>
      item?.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(filteredItems);
  };

  return (
    <>
      <Col className="mx-auto my-5">
        <Card>
          <Card.Body>
            <h2>Table of Order List</h2>
            <div className="col-6">
              <div className="input-group">
                <input
                  className="form-control border-secondary py-2"
                  type="search"
                  placeholder="Find Order"
                  value={searchQuery}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <table className="table mt-2 border ">
              <thead className="table-head">
                <tr className="border">
                  <th className="border">Order ID</th>
                  <th className="border">NAME</th>
                  <th className="border">Amount</th>
                  <th className="border">Date</th>
                  <th className="border">Status</th>
                </tr>
              </thead>
              {loading ? (
                "Loading"
              ) : (
                <tbody className="table-body">
                  {orderData && orderData?.getAllOrder?.length > 0 ? (
                    filteredData
                      ?.slice(0)
                      .reverse()
                      .map((order, index) => (
                        <tr className="border" key={order.id}>
                          <td className="border">
                            {/* {index + 1} */}
                            <Link
                              to={`/admin/orderdetail/${order?.id}`}
                              className="text-truncate h-100 d-flex align-items-center"
                            >
                              <span maxLength={2}>
                                {order?.id?.substring(0, 12)}...
                              </span>
                            </Link>
                          </td>
                          <td className="border">
                            {order?.user?.firstName} {order?.user?.lastName}
                          </td>
                          <td className="border">
                            {" "}
                            <span>
                              <span className="text-small">₹ </span>
                              {order?.totalAmount}
                            </span>
                          </td>
                          <td className="border">
                            {moment(parseInt(order?.createdAt)).format("ll")}
                          </td>
                          <td className="border">
                            <Badge className="badge bg-dark">
                              {order?.status}
                            </Badge>
                            {/* {order?.status} */}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr className="border">
                      <td colSpan={5} className="text-center">
                        Order Not Found
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default ListOrder;
