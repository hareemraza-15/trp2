import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Button, Modal, Form } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";

function ListSize() {
  const [modal, showModal] = useState(false);
  const [sizeName, setSizeName] = useState("");
  const [sizeId, setSizeId] = useState("");

  const GET_ALL_SIZE = gql`
    query GetAllSize {
      getAllSize {
        id
        sizeName
      }
    }
  `;

  const { data, refetch } = useQuery(GET_ALL_SIZE);

  if (data) {
    console.log("data", data);
  }

  //------------------------------------------------------
  // --------------function for handle EDIT start---------
  //------------------------------------------------------

  const EDIT_SIZE = gql`
    mutation UpdateSize($updateSizeId: ID, $sizeName: String) {
      updateSize(id: $updateSizeId, sizeName: $sizeName) {
        id
        sizeName
      }
    }
  `;

  const [EditData] = useMutation(EDIT_SIZE);

  function hadleEdit(id, name) {
    showModal(true);
    // console.log(id);
    setSizeId(id);
    setSizeName(name);
  }

  const handleSubmit = async () => {
    await EditData({
      variables: {
        updateSizeId: sizeId,
        sizeName: sizeName,
      },
    });
    showModal(false);
    setSizeName("");
  };

  //------------------------------------------------------
  // --------------function for handle EDIT END---------
  //------------------------------------------------------

  //------------------------------------------------------
  // --------------function for handle DELETE start---------
  //------------------------------------------------------

  const DELETE_SIZE = gql`
    mutation DeleteSize($deleteSizeId: ID!) {
      deleteSize(id: $deleteSizeId) {
        id
        sizeName
      }
    }
  `;

  const [DeleteSize] = useMutation(DELETE_SIZE, {
    onCompleted: () => {
      refetch();
    },
  });

  async function handleDelete(id, name) {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete "${name}"`
    );
    if (shouldDelete) {
      await DeleteSize({
        variables: {
          deleteSizeId: id,
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
    if (data?.getAllSize) {
      setFilteredData(data.getAllSize);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setsearchQuery(searchTerm);

    const filteredItems = data.getAllSize?.filter((item) =>
      item.sizeName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(filteredItems);
  };

  return (
    <>
      <Col className="mx-auto my-5">
        <Card>
          <Card.Body>
            <h2>List of Sizes</h2>
            <div className="col-6">
              <div className="input-group">
                <input
                  className="form-control border-secondary py-2"
                  type="search"
                  placeholder="Find Color"
                  value={searchQuery}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <table className="table mt-2 border ">
              <thead className="table-head">
                <tr className="border">
                  <th className="border">Sr No</th>
                  <th className="border">Size</th>
                  <th className="border">Edit</th>
                  <th className="border">Delete</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {data &&
                  data?.getAllSize &&
                  filteredData
                    ?.slice(0)
                    .reverse()
                    .map((item, index) => (
                      <tr className="border" key={item.id}>
                        <td className="border">{index + 1}</td>
                        <td className="border">{item?.sizeName}</td>
                        <td className="border">
                          <Button
                            className="btn btn-sm"
                            onClick={() => hadleEdit(item.id, item.sizeName)}
                          >
                            <Pencil size={20} color="black" />
                          </Button>
                        </td>
                        <td className="border">
                          <Button
                            className="btn btn-sm"
                            onClick={() => handleDelete(item.id, item.sizeName)}
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

      <Modal
        className="modal-right scroll-out-negative"
        show={modal}
        onHide={() => showModal(false)}
        scrollable
        dialogClassName="full"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Update Size</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Size Name</h5>
          <Form.Control
            type="text"
            name="sizeName"
            value={sizeName}
            onChange={(e) => setSizeName(e.target.value)}
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
    </>
  );
}

export default ListSize;
