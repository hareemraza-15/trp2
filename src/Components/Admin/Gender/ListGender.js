import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Button, Modal, Form } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";

function ListGender() {
  const [modal, showModal] = useState(false);
  const [genderName, setGenderName] = useState("");
  const [genderId, setGenderId] = useState("");

  const GET_ALL_COLOUR = gql`
    query GetAllGender {
      getAllGender {
        id
        genderName
      }
    }
  `;

  const { data, refetch } = useQuery(GET_ALL_COLOUR);

  //------------------------------------------------------
  // --------------function for handle EDIT start---------
  //------------------------------------------------------

  const EDIT_GENDER = gql`
    mutation UpdateGender($updateGenderId: ID, $genderName: String) {
      updateGender(id: $updateGenderId, genderName: $genderName) {
        id
        genderName
      }
    }
  `;

  const [EditData] = useMutation(EDIT_GENDER);

  function handleEdit(id, name) {
    showModal(true);
    setGenderId(id);
    setGenderName(name);
  }

  const handleSubmit = async () => {
    await EditData({
      variables: {
        updateGenderId: genderId,
        genderName: genderName,
      },
    });
    showModal(false);
    setGenderName("");
  };

  //------------------------------------------------------
  // --------------function for handle EDIT END---------
  //------------------------------------------------------

  //------------------------------------------------------
  // --------------function for handle DELETE start---------
  //------------------------------------------------------

  const DELETE_GENDER = gql`
    mutation DeleteGender($deleteGenderId: ID!) {
      deleteGender(id: $deleteGenderId) {
        id
        genderName
      }
    }
  `;

  const [DeleteGender] = useMutation(DELETE_GENDER, {
    onCompleted: () => {
      refetch();
    },
  });

  async function handleDelete(id, name) {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete "${name}"`
    );
    if (shouldDelete) {
      await DeleteGender({
        variables: {
          deleteGenderId: id,
        },
      });
    }
  }

  //------------------------------------------------------
  // --------------function for handle DELETE END---------
  //------------------------------------------------------

  useEffect(() => {
    refetch();
  }, [refetch]);

  // handle searching

  const [searchQuery, setsearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data?.getAllGender) {
      setFilteredData(data.getAllGender);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setsearchQuery(searchTerm);

    const filteredItems = data.getAllGender?.filter((item) =>
      item.genderName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(filteredItems);
  };

  return (
    <>
      {/* <Row> */}
      <Col className="mx-auto my-5">
        <Card>
          <Card.Body>
            <h2>Table of Gender</h2>

            <div className="col-6">
              <div className="input-group">
                <input
                  className="form-control border-secondary py-2"
                  type="search"
                  placeholder="Find Gender"
                  value={searchQuery}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <table className="table mt-2 border ">
              <thead className="table-head">
                <tr className="border">
                  <th className="border">Index No</th>
                  <th className="border">Gender</th>
                  <th className="border">Edit</th>
                  <th className="border">Delete</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {data &&
                  data?.getAllGender &&
                  filteredData
                    ?.slice(0)
                    .reverse()
                    .map((item, index) => (
                      <tr className="border" key={item?.id}>
                        <td className="border">{index + 1}</td>
                        <td className="border">{item?.genderName}</td>
                        <td className="border">
                          <Button
                            className="btn btn-sm"
                            onClick={() =>
                              handleEdit(item?.id, item.genderName)
                            }
                          >
                            <Pencil size={20} color="black" />
                          </Button>
                        </td>
                        <td className="border">
                          <Button
                            className="btn btn-sm"
                            onClick={() =>
                              handleDelete(item?.id, item?.genderName)
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

        <Modal
          className="modal-right scroll-out-negative"
          show={modal}
          onHide={() => showModal(false)}
          scrollable
          dialogClassName="full"
        >
          <Modal.Header closeButton>
            <Modal.Title as="h5">Update Color</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Color Name</h5>
            <Form.Control
              type="text"
              name="genderName"
              value={genderName}
              onChange={(e) => setGenderName(e.target.value)}
            />
            <Button
              type="submit"
              className="my-2 btn btn-primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Modal.Body>
        </Modal>
      </Col>
      {/* </Row> */}
    </>
  );
}

export default ListGender;
