import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Button, Modal, Form } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";

function ListGallery() {
  const [modal, showModal] = useState(false);

  const GET_ALL_GALLERY_ITEMS = gql`
    query GetAllGallery {
      getAllGallery {
        id
        title
        description
        image
      }
    }
  `;

  const { data, refetch } = useQuery(GET_ALL_GALLERY_ITEMS);

  //------------------------------------------------------
  // --------------function for handle EDIT start---------
  //------------------------------------------------------

  const EDIT_GALLLERY_ITEM = gql`
    mutation UpdateGallery(
      $updateGalleryId: ID
      $title: String
      $description: String
      $imageurl: String
      $imagefile: Upload
    ) {
      updateGallery(
        id: $updateGalleryId
        title: $title
        description: $description
        imageurl: $imageurl
        imagefile: $imagefile
      ) {
        id
      }
    }
  `;

  const [EditData] = useMutation(EDIT_GALLLERY_ITEM, {
    onCompleted: () => {
      showModal(false);
      refetch();
    },
  });

  const [itemEdit, setItemEdit] = useState(null);

  function handleEdit(item) {
    showModal(true);
    setItemEdit(item);
    // setColorId(id);
    // setColorName(name);
  }

  const handleGalleryformData = (e) => {
    const { name, value, files } = e.target;

    if (name === "imagefile") {
      setItemEdit((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setItemEdit((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, image, __typename, ...rest } = itemEdit;

    await EditData({
      variables: {
        ...rest,
        updateGalleryId: id,
        imageurl: image,
      },
    });
    // setColorName("");
  };

  //------------------------------------------------------
  // --------------function for handle EDIT END---------
  //------------------------------------------------------

  //------------------------------------------------------
  // --------------function for handle DELETE start---------
  //------------------------------------------------------

  const DELETE_GALLERY = gql`
  mutation DeleteGallery($deleteGalleryId: ID!) {
    deleteGallery(id: $deleteGalleryId) {
      id
    }
  }
  `;

  const [DeleteGallery] = useMutation(DELETE_GALLERY, {
    onCompleted: () => {
      refetch();
    },
  });

  async function handleDelete(id, name) {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete "${name}"`
    );
    if (shouldDelete) {
      await DeleteGallery({
        variables: {
          deleteGalleryId: id,
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
    if (data?.getAllGallery) {
      setFilteredData(data.getAllGallery);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setsearchQuery(searchTerm);

    const filteredItems = data.getAllGallery?.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(filteredItems);
  };

  return (
    <>
      {/* <Row> */}
      <Col className="mx-auto my-5">
        <Card>
          <Card.Body>
            <h2>Table of Gallery Item </h2>
            <div className="col-6">
              <div className="input-group">
                <input
                  className="form-control border-secondary py-2"
                  type="search"
                  placeholder="Find Gallery"
                  value={searchQuery}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <table className="table mt-2 border">
              <thead className="table-head">
                <tr className="border">
                  <th className="border">Sr No</th>
                  <th className="border">Post</th>
                  <th className="border">Description</th>
                  <th className="border">Image</th>
                  <th className="border">Edit</th>
                  <th className="border">Delete</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {data &&
                  data.getAllGallery &&
                  filteredData
                    ?.slice(0)
                    .reverse()
                    .map((item, index) => (
                      <tr className="border" key={item.id}>
                        <td className="border">{index + 1}</td>
                        <td className="border">{item.title}</td>
                        <td className="border">{item.description}</td>
                        <td className="border">
                          <img
                            style={{
                              height: "100px",
                              width: "100px",
                            }}
                            src={item.image}
                            alt="Selected"
                          />
                        </td>
                        <td className="border">
                          <Button
                            className="btn btn-sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil size={20} color="black" />
                          </Button>
                        </td>
                        <td className="border">
                          <Button
                            className="btn btn-sm"
                            onClick={() =>
                              handleDelete(item.id, item.title)
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

        {modal && (
          <Modal
            className=""
            show={modal}
            onHide={() => showModal(false)}
            scrollable
            dialogClassName="full"
          >
            <Modal.Header closeButton>
              <Modal.Title as="h5">Update Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <Form.Label htmlFor="title">Title:</Form.Label>
                  <Form.Control
                    type="text"
                    id="title"
                    name="title"
                    value={itemEdit.title}
                    onChange={handleGalleryformData}
                  />
                </div>
                <div className="mb-3">
                  <Form.Label htmlFor="description">Description:</Form.Label>
                  <Form.Control
                    type="text"
                    id="description"
                    name="description"
                    value={itemEdit.description}
                    onChange={handleGalleryformData}
                  />
                </div>
                <div className="mb-3">
                  <Form.Label htmlFor="imagefile">Image file:</Form.Label>
                  <Form.Control
                    type="file"
                    id="imagefile"
                    name="imagefile"
                    onChange={handleGalleryformData}
                  />
                </div>
                <Button
                  variant="outline-success"
                  className="my-3"
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        )}
      </Col>
      {/* </Row> */}
    </>
  );
}

export default ListGallery;
