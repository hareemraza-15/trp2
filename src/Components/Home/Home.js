import React, { useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FloatingWhatsApp } from "react-floating-whatsapp";

import "./Home.css";



const GET_ALL_GALLERY = gql`
  query GetAllGallery {
    getAllGallery {
      id
      title
      description
      image
    }
  }
`;

function Home() {

  const video = document.getElementById('trp'); // Replace 'yourVideoId' with the actual ID of your video element

  // Wait for a brief moment and then attempt to autoplay
  setTimeout(() => {
    if (video) {
      video.play().catch(error => {
        // Autoplay failed, handle the error
        console.error('Autoplay failed:', error);
      });
    }
  }, 1000); // Adjust the delay as needed
  

  const [hoverImage, setHoverImage] = useState(null);
  const navigate = useNavigate();
  // const [header, setHeader] = useState("header");

  // const listenScrollEvent = event => {
  //   if (window.scrollY < 73) {
  //     return setHeader("header");
  //   } else if (window.scrollY > 70) {
  //     return setHeader("header2");
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener("scroll", listenScrollEvent);

  //   return () => window.removeEventListener("scroll", listenScrollEvent);
  // }, []);

  const [editModal, setEditModal] = useState(false);

  // GETTING DATA
  const GET_ALL_PRODUCT = gql`
    query GetAllProducts {
      getAllProducts {
        id
        color
        description
        discount
        gender
        gst
        priveiwName
        productName
        sellingPrice
        size
        stock {
          quantity
          gender
          color
          size
        }
        images {
          imagePath
          color
          gender
        }
      }
    }
  `;

  const { data: product, refetch } = useQuery(GET_ALL_PRODUCT);

  const { data: galleryItems } = useQuery(GET_ALL_GALLERY);

  const handleNext = () => { };
  const handlePrev = () => { };

  const GET_HOME_PAGE_SLIDER = gql`
    query GetAllHomePageSlider {
      getAllHomePageSlider {
        id
        images
        url
        content
      }
    }
  `;

  const { data: homePageSlider } = useQuery(GET_HOME_PAGE_SLIDER);

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };
  return (
    <>
      <FloatingWhatsApp
        onClick={() =>
          (window.location.href = "https://wa.me/918829999060?text=")
        }
        phoneNumber="918829999060"
        accountName="The Royal Pajama"
        statusMessage="Online"
        allowEsc
        chatboxHeight={300}
        chatboxStyle
        allowClickAway
        notification={false}
        notificationSound={false}
        chatMessage={`Hi There,
You can contact us here for any suggestion or query!`}
      />
      <Container
        fluid
        className="v-conatiner"
        style={{
          marginTop: "-150px",
          marginRight: "0px",
          marginLeft: "0px",
          paddingLeft: "0px",
          paddingRight: "0px",
          maxWidth: "none",
        }}
      >

        <div
          style={{
            mt: 2,
            position: "relative",
            width: "100%",
            paddingTop: "56.25%",
          }}
        >
          <video
          id="trp"
            playsInline
            loop
            muted
            controls={false}
            width="100%"
            height="100%"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              background:'transparent'
            }}
            data-wf-ignore="true" data-object-fit="cover"
            >
            <source src="/trpbanner.mp4" type="video/mp4" data-wf-ignore="true"/>
          </video>
        </div>
      </Container>
      {/* <div id="carouselExampleControls" className="carousel slide" data-ride="carousel" style={{ marginTop: '-130px' }}>
      <div className="carousel-inner">
        {homePageSlider?.getAllHomePageSlider && homePageSlider?.getAllHomePageSlider[0]?.images && <div className="carousel-item active">
          <img className="d-block w-100"
            src={homePageSlider?.getAllHomePageSlider[0]?.images} alt="First slide" />
        </div>}
        {homePageSlider?.getAllHomePageSlider && homePageSlider?.getAllHomePageSlider?.map((item, index) => index > 0 &&
          <div key={item.id} className="carousel-item">
            <img className="d-block w-100"
              src={item.images} alt="Second slide" />
          </div>)}
      </div>
      <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
      </a>
      <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" />
      </a>
    </div> */}

      {/* <section id="about" className="about"> */}

      <Container fluid className="pt-4" id="new-arrivals">
        <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          <h2 className='text-center' style={{ fontWeight: 800 }}>New Arrivals</h2>
        </div>
        <div
          id="carouselExampleControlsDamn"
          className="carousel slide"
          data-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="row row1">
                {product && (
                  <Carousel responsive={responsive}>
                    {product &&
                      product?.getAllProducts
                        ?.slice(0)
                        .reverse()
                        .map((data, index) => {
                          return (
                            <div
                              key={index}
                              className="mx-3"
                              onMouseEnter={() => setHoverImage(index)}
                              onMouseLeave={() => setHoverImage(null)}
                            >
                              <img
                                src={
                                  hoverImage === index
                                    ? data?.images[0]?.imagePath[1] ||
                                    data?.images[0]?.imagePath[0]
                                    : data?.images[0]?.imagePath[0]
                                }
                                style={{
                                  width: "100%",
                                  height: "300px",
                                  objectFit: "cover",
                                }}
                                alt="products"
                              />
                              <Link
                                style={{ textDecoration: "none" }}
                                to={`/shop/product/${data.id}`}
                                className="stretched-link">
                                <h6
                                  style={{
                                    padding: "2px 0px",
                                    marginBottom: "0px",
                                    fontFamily:
                                      "Neue-Helvetica, Helvetica, Arial, sans-serif",
                                    letterSpacing: "1px",
                                  }}
                                  className="text-black"
                                >
                                  {data.productName}
                                </h6>
                              </Link>
                              <h6
                                style={{
                                  fontFamily:
                                    "Neue-Helvetica, Helvetica, Arial, sans-serif",
                                }}
                              >
                                {" "}
                                ₹ {data.sellingPrice}
                              </h6>
                            </div>
                          );
                        })}
                  </Carousel>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
      {/* </section> */}

      {galleryItems?.getAllGallery?.length > 0 && (
        <section id="gallery" className="gallery">
          <Container>
            <h2 className='text-center mb-5 mt-5' style={{ fontWeight: 800 }}>Gallery</h2>
            <Row>
              {galleryItems?.getAllGallery.map((item, index) => (
                <Col
                  key={index}
                  lg={3}
                  md={4}
                  sm={6}
                  xs={6}
                  style={{ textAlign: "center", marginBottom: "8px" }}
                >
                  <Link
                    to={item.title}
                    target="_blank"
                    className="stretched-link"
                  >
                    <div className="flexslider">
                      <img
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        src={item?.image}
                        alt="products"
                      />
                      {/* <div className="text-center">
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
                          {item.title}
                        </h6>
                        <div>
                          <h6
                            style={{
                              fontFamily:
                                "Neue-Helvetica, Helvetica, Arial, sans-serif",
                            }}
                            className="text-center"
                          >
                            {item.description}
                          </h6>
                        </div>
                      </div> */}
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
      {/* <Instagram /> */}
    </>
  );
}

export default Home;
