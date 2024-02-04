import React from "react";
import { gql, useQuery } from "@apollo/client";
import Header from "../Sections/Header/Header";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";

const GET_PRODUCT_BY_SEARCH = gql`
  query HomePageSearch($search: String) {
    homePageSearch(search: $search) {
      id
      productName
      images {
        imagePath
      }
      sellingPrice
    }
  }
`;

function SearchedProducts() {
  const { query } = useParams();

  // GETTING DATA
  const { data: products, loading } = useQuery(GET_PRODUCT_BY_SEARCH, {
    variables: { search: query },
  });

  return (
    <>
      <section className="slider">
        <Container fluid>
          <h1 className="text-center mb-5">
            Search Result for {`"${query}"`}{" "}
          </h1>
          <Row>
            {!loading ? (
              products?.homePageSearch.length > 0 ? (
                products?.homePageSearch
                  ?.slice(0)
                  .reverse()
                  .map((data, index) => {
                    return (
                      <Col
                        key={index}
                        lg={3}
                        md={4}
                        sm={6}
                        xs={6}
                        style={{ textAlign: "center" }}
                      >
                        <Link
                          to={`/shop/product/${data.id}`}
                          className="stretched-link"
                        ></Link>
                        <div className="flexslider">
                          <img
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            src={data?.images[0]?.imagePath[0]}
                            alt="products"
                          />
                          <div className="text-center">
                            <h6
                              className="text-center text-black"
                              style={{
                                padding: "2px 0px",
                                marginBottom: "0px",
                                fontFamily:
                                  "Neue-Helvetica, Helvetica, Arial, sans-serif",
                                letterSpacing: "1px",
                              }}
                            >
                              {data.productName}
                            </h6>
                            <div>
                              <h6
                                style={{
                                  fontFamily:
                                    "Neue-Helvetica, Helvetica, Arial, sans-serif",
                                }}
                                className="text-center"
                              >
                                ₹ {data.sellingPrice}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })
              ) : (
                <h1 className="text-center mb-5">No Data Found !</h1>
              )
            ) : (
              <h1 className="text-center mb-5">Loading</h1>
            )}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default SearchedProducts;
