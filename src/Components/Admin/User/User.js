import React, { useState, useEffect } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Card, Col, Row, Button, Modal, Form } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";
import toast from "react-hot-toast";

function User() {
  const GET_ALL_USER = gql`
    query GetAllUser {
      getAllUser {
        id
        firstName
        lastName
        email
        profilepic
        mobileNo
        role
      }
    }
  `;

  const { data, refetch } = useQuery(GET_ALL_USER);

  const DELETE_USER = gql`
    mutation DeleteUser($deleteUserId: ID!) {
      deleteUser(id: $deleteUserId) {
        id
        firstName
        email
      }
    }
  `;

  const [deleteUser, { data: deleteUserData }] = useMutation(DELETE_USER, {
    onCompleted: () => {
      // toast.success(deleteUserData?.deleteUser?.firstName);
      toast.success("User Deleted Successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeleteUser = async (id, name) => {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete ${name}'s Details?`
    );
    if (shouldDelete) {
      await deleteUser({
        variables: {
          deleteUserId: id,
        },
      });
    }
  };

  // handle searching

  const [searchQuery, setsearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data?.getAllUser) {
      setFilteredData(data.getAllUser);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setsearchQuery(searchTerm);

    const filteredItems = data.getAllUser?.filter((item) =>
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(filteredItems);
  };

  return (
    <>
      <Col className="mx-auto my-5">
        <Card>
          <Card.Body>
            <h2>Table of User List</h2>
            <div className="col-6">
              <div className="input-group">
                <input
                  className="form-control border-secondary py-2"
                  type="search"
                  placeholder="Find User"
                  value={searchQuery}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <table className="table mt-2 border ">
              <thead className="table-head">
                <tr className="border">
                  <th className="border">Sr No</th>
                  <th className="border">User Name</th>
                  <th className="border">Email</th>
                  <th className="border">Mobile No</th>
                  <th className="border">Role</th>
                  <th className="border">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {data &&
                  data.getAllUser &&
                  filteredData
                    ?.slice(0)
                    .reverse()
                    .map((user, index) => (
                      <tr className="border" key={user.id}>
                        <td className="border">{index + 1}</td>
                        <td className="border">
                          {user.firstName} {user.lastName}
                        </td>

                        <td className="border">{user.email}</td>
                        <td className="border">{user.mobileNo}</td>

                        <td className="border"> {user.role.join(", ")}</td>

                        <td className="border">
                          <Button
                            className="btn btn-sm"
                            onClick={() =>
                              handleDeleteUser(user.id, user.firstName)
                            }
                          >
                            <Trash size={20} color="black" />
                          </Button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default User;
