import React, { useEffect } from "react";
import { Card, Col, Row, Button, Modal, Form } from "react-bootstrap";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Pencil, Trash } from "react-bootstrap-icons";
import { useState } from "react";

function ListCategory() {
  const [modal, showModal] = useState(false);

  const GET_ALL_CATEGORY = gql`
    query GetAllCategory {
      getAllCategory {
        id
        categoryName
      }
    }
  `;

  const { data, refetch } = useQuery(GET_ALL_CATEGORY);

  useEffect(() => {
    refetch();
  }, []);

  // EDIT

  const [categoryName, setCategoryName] = useState("");
  const [categroryId, setCategoryId] = useState("");

  const EDIT_CATEGORY = gql`
    mutation UpdateCategory($updateCategoryId: ID, $categoryName: String) {
      updateCategory(id: $updateCategoryId, categoryName: $categoryName) {
        id
        categoryName
      }
    }
  `;

  const [editCategory, { data: dataEdit }] = useMutation(EDIT_CATEGORY, {
    onCompleted: () => {
      refetch();
    },
  });

  function handleEdit(id, name) {
    showModal(true);
    setCategoryId(id);
    setCategoryName(name);
  }

  const handleSubmit = async () => {
    await editCategory({
      variables: {
        updateCategoryId: categroryId,
        categoryName: categoryName,
      },
    });
    showModal(false);
  };

  // Delete

  const [deleteId, setDeleteId] = useState("");

  const DELETE = gql`
    mutation DeleteCategory($deleteCategoryId: ID!) {
      deleteCategory(id: $deleteCategoryId) {
        id
        categoryName
      }
    }
  `;

  const [deleteCategory, { data: deleteCat }] = useMutation(DELETE, {
    onCompleted: () => {
      refetch();
    },
  });

  if (deleteCat) {
    console.log("deleteCat", deleteCat);
  }

  function handleDelete(id) {
    setDeleteId(id);
    deleteCategory({
      variables: {
        deleteCategoryId: id,
      },
    });
  }

  // handle searching

  const [searchQuery, setsearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data?.getAllCategory) {
      setFilteredData(data.getAllCategory);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setsearchQuery(searchTerm);

    const filteredItems = data.getAllCategory?.filter((item) =>
      item.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(filteredItems);
  };

  return (
    <>
      <Card className="my-5 mx-5" style={{ backgroundColor: "#ffffff" }}>
        <Card.Body>
          <h2>Category List</h2>
          <div className="col-6">
            <div className="input-group">
              <input
                className="form-control border-secondary py-2"
                type="search"
                placeholder="Find Category"
                value={searchQuery}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <table className="table mt-2 " style={{ border: "none" }}>
            <thead className="table-head" style={{ border: "none" }}>
              <tr style={{ border: "none" }}>
                <th style={{ border: "none" }}>Index</th>
                <th style={{ border: "none" }}>Category Name</th>
                <th style={{ border: "none" }}>Action</th>
                {/* <th  style={{ backgroundColor: "black", color: "white", border: "1px solid black", border: "1px solid black"}} className="border">Delete</th> */}
              </tr>
            </thead>
            <tbody style={{ border: "none" }} className="table-body">
              {data &&
                data.getAllCategory &&
                filteredData
                  .slice(0)
                  .reverse()
                  .map((item, index) => (
                    <tr style={{ border: "none" }} key={item.id}>
                      <td style={{ border: "none" }}>{index + 1}</td>
                      <td style={{ border: "none" }}>{item.categoryName}</td>
                      <td style={{ border: "none" }}>
                        <button
                          className="btn btn-sm  btn-outline-info mx-2"
                          onClick={() => handleEdit(item.id, item.categoryName)}
                        >
                          <Pencil size={20} color="#e46567" />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash size={20} color="#e46567" />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </Card.Body>
      </Card>
      {/* </Col> */}
      {/* </Row> */}

      <Modal
        className="modal-right scroll-out-negative"
        show={modal}
        onHide={() => showModal(false)}
        scrollable
        dialogClassName="full"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Update Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Category Name</h5>
          <Form.Control
            type="text"
            name="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <Button
            type="submit"
            className="my-2 btn btn-light"
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>

          {/* <OverlayScrollbarsComponent options={{ overflowBehavior: { x: 'hidden', y: 'scroll' } }} className="scroll-track-visible">
            <Form onSubmit={updateCategory}>
              {originalCategory && (
                <div className="mb-3">
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control type="text" defaultValue={originalCategory} readOnly />
                </div>
              )}
              <div className="mb-3">
                <Form.Label>New Category</Form.Label>
                <Form.Control
                  type="text"
                  value={newcatName}
                  onChange={(e) => {
                    if (e.target.value.includes('_')) {
                      e.target.value = e.target.value.replace('_', '');
                    }
                    if (e.target.value.includes('/')) {
                      e.target.value = e.target.value.replace('/', '');
                    }
                    setNewCatName(e.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <Form.Label>New Description</Form.Label>
                <Form.Control type="text" maxLength="130" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
              </div>
              <div className="mb-3">
                <Form.Label>New Image</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={(e) => setNewCatImage(e.target.files[0])} />
              </div>
              <Button variant="primary" type="submit" className="btn-icon btn-icon-start">
                <CsLineIcons icon="save" />
                <span>Update</span>
              </Button>
            </Form>
          </OverlayScrollbarsComponent> */}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ListCategory;
