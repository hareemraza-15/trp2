import React, { useState, useEffect } from "react";
import {
  Speedometer,
  List,
  Person,
  Search,
  Cart,
  Bag,
  Heart,
  PersonCircle,
} from "react-bootstrap-icons";
import { Button, Modal, Card } from "react-bootstrap";
import logo1 from "./Images/logo-TRP.jpg";
import logo2 from "./Images/logo-TRP.png";
import { useMediaQuery } from "react-responsive";
import MediaQuery from "react-responsive";
import { useNavigate } from "react-router-dom";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import CartPage from "../../Home/CartSection/CartPage";
import CartPop from "../../Home/CartSection/CartPop";

function AdminHeader() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loggedIn, setLoggedIn] = useState(false);
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("role");
    setLoggedIn(false);
  };
  const ice = {
    maxWidth: "1000px",
    margin: "0 auto",
  };

  const [header, setHeader] = useState("headerAdmin");
  const [logo, setLogo] = useState(logo1);

  const listenScrollEvent = (event) => {
    if (window.scrollY < 73) {
      return setHeader("headerAdmin"), setLogo(logo1);
    } else if (window.scrollY > 70) {
      return setHeader("headerAdmin"), setLogo(logo1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent);
    return () => window.removeEventListener("scroll", listenScrollEvent);
  }, []);

  const [editModal, setEditModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [nav, setNav] = useState(false);

  const goToLoginPage = () => {
    navigate("/login");
  };

  // GETTING CART ITEMS
  const CART = gql`
    query Cart {
      cart {
        _id
        cartProducts {
          productId {
            id
            priveiwName
            productName
            images
            sellingPrice
          }
          quantity
        }
      }
    }
  `;

  const [getCartData, { data: cartData }] = useLazyQuery(CART);

  useEffect(() => {
    getCartData();
  }, []);

  const goToWishList = () => {
    navigate("/shop/wishlist");
    setProfileModal(false);
    setNav(false);
  };

  const goToProfile = () => {
    navigate("/shop/profile");
    setProfileModal(false);
  };

  const goToOrderPage = () => {
    navigate("/shop/order");
    setProfileModal(false);
  };

  const goToFAQPage = () => {
    navigate("/shop/faq");
  };

  const goToReturnPage = () => {
    navigate("/shop/return");
  };

  const goToAdmin = () => {
    navigate("/admin");
  };

  const goToHomePage = () => {
    navigate("/");
  };

  const goToShop = () => {
    navigate("/shop");
  };

  const goToAbout = () => {
    navigate("/shop/about");
  };

  return (
    <>
      <div style={{ cursor: "pointer" }} onClick={() => goToHomePage()}>
        <h1 className="text-center my-2">ADMIN PANEL</h1>
      </div>
      <header className="headerAdmin">
        <div className="d-flex align-items-center w-100">
          <MediaQuery minWidth={1200}>
            <div id="logo" className="logo">
              <a href="/">
                <img
                  className="mt-2 logo-img"
                  style={{
                    height: "100px",
                    width: "140px",
                    borderRadius: "15px",
                  }}
                  src={logo}
                  alt="Logo"
                />
              </a>
            </div>
            <div className="ms-auto mr-5">
              <PersonCircle
                onClick={() => setProfileModal(true)}
                className="mx-1"
                size={28}
              />
            </div>
          </MediaQuery>
          <MediaQuery minWidth={1035} maxWidth={1199}>
            <div id="logo" className="logo">
              <a href="/">
                <img
                  className="mt-2 logo-img"
                  style={{
                    height: "100px",
                    width: "140px",
                    borderRadius: "15px",
                  }}
                  src={logo}
                  alt="Logo"
                />
              </a>
            </div>
            <div className="ms-auto mr-5">
              <PersonCircle
                onClick={() => setProfileModal(true)}
                className="mx-1"
                size={28}
              />
            </div>
          </MediaQuery>
          <MediaQuery minWidth={769} maxWidth={800}>
            <div id="logo" className="logo">
              <a href="/">
                <img
                  className="mt-2 logo-img"
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "15px",
                  }}
                  src={logo}
                  alt="Logo"
                />
              </a>
            </div>

            <div className="ms-auto mr-5">
              <PersonCircle
                onClick={() => setProfileModal(true)}
                className="mx-1"
                size={28}
              />
            </div>
          </MediaQuery>
          <MediaQuery minWidth={801} maxWidth={875}>
            <div id="logo" className="logo">
              <a href="/">
                <img
                  className="mt-2 logo-img"
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "15px",
                  }}
                  src={logo}
                  alt="Logo"
                />
              </a>
            </div>

            <div className="ms-auto mr-5">
              <PersonCircle
                onClick={() => setProfileModal(true)}
                className="mx-1"
                size={28}
              />
            </div>
          </MediaQuery>

          <MediaQuery minWidth={876} maxWidth={950}>
            <div id="logo" className="logo">
              <a href="/">
                <img
                  className="mt-2 logo-img"
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "15px",
                  }}
                  src={logo}
                  alt="Logo"
                />
              </a>
            </div>
            <div className="ms-auto mr-5">
              <PersonCircle
                onClick={() => setProfileModal(true)}
                className="mx-1"
                size={28}
              />
            </div>
          </MediaQuery>

          <MediaQuery minWidth={951} maxWidth={1034}>
            <div id="logo" className="logo">
              <a href="/">
                <img
                  className="mt-2 logo-img"
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "15px",
                  }}
                  src={logo}
                  alt="Logo"
                />
              </a>
            </div>

            <div className="ms-auto mr-5">
              <PersonCircle
                onClick={() => setProfileModal(true)}
                className="mx-1"
                size={28}
              />
            </div>
          </MediaQuery>
          <MediaQuery maxWidth={768}>
            <div id="logo" className="logo">
              <a href="/">
                <img
                  className="mt-2"
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "15px",
                  }}
                  src={logo}
                  alt="Logo"
                />
              </a>
            </div>

            <div className="ms-auto mr-5">
              <PersonCircle
                onClick={() => setProfileModal(true)}
                className="mx-1"
                size={28}
              />
            </div>
          </MediaQuery>
        </div>

        {/* <MediaQuery maxWidth={768}>
          <div
            className="justify align-items-left"
            style={{
              alignContent: "left",
              justifyItems: "left",
              marginRight: "60px",
            }}
          >
            <div id="logo" className="logo">
              <a href="/">
                <img
                  className="mt-2 logo-img"
                  style={{ height: "10px", width: "10px", borderRadius: "3px" }}
                  src={logo}
                  alt="Logo"
                />
              </a>
            </div>
          </div>
          <div style={{ marginRight: "0px", paddingRight: "0px" }}>
            {!nav && (
              <List
                onClick={() => setNav(true)}
                className="me-4 mt-0 pt-0 list-btn"
                color="black"
                size={28}
              />
            )}
          </div>
        </MediaQuery> */}
      </header>

      {/* <MediaQuery maxWidth={768}>
        <Modal
          className="px-0 mx-0 toggle"
          show={nav}
          onHide={() => setNav(false)}
          scrollable
          dialogClassName="full"
        >
          <Modal.Header closeButton className="modalHead">
            <ul
              className="links nav-item d-flex"
              style={{ listStyle: "none", textAlign: "left" }}
            >
              <li>
                <Search className="  mx-1" size={30} />
              </li>
              <li>
                <Bag
                  onClick={() => {
                    setEditModal(true);
                    setNav(false);
                  }}
                  className="mx-1"
                  size={30}
                />
              </li>
              <li>
                <Heart
                  onClick={() => {
                    goToWishList(true);
                    setNav(false);
                  }}
                  className="mx-1"
                  size={30}
                />
              </li>
              <li>
                <PersonCircle
                  onClick={() => setProfileModal(true)}
                  className="mx-1"
                  size={30}
                />
              </li>
            </ul>
          </Modal.Header>
          <Modal.Body style={ice} className="px-0 mx-0 modalBod">
            <ul
              className="links nav-item"
              style={{ listStyle: "none", textAlign: "left" }}
            >
              <li onClick={() => goToHomePage()}>
                <a
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                  className="link-item nav-link"
                >
                  Home
                </a>
              </li>
              <hr />
              <li onClick={() => goToShop()}>
                <a
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                  className="link-item nav-link"
                >
                  Shop
                </a>
              </li>
              <hr />
              <li onClick={() => goToReturnPage()}>
                <a
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                  className="link-item nav-link"
                >
                  Returns/Exchange
                </a>
              </li>
              <hr />
              <li>
                <a
                  style={{ fontSize: "20px", fontWeight: "bold" }}
                  className="link-item nav-link"
                >
                  Track
                </a>
              </li>
              <hr />
              <li onClick={() => goToFAQPage()}>
                <a
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                  className="link-item nav-link"
                >
                  FAQ's
                </a>
              </li>
              <hr />
              <li onClick={() => goToAbout()}>
                <a
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                  className="link-item nav-link"
                >
                  About US
                </a>
              </li>
              <hr />
              <li>
                <a
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                  className="link-item nav-link"
                >
                  Profile
                </a>
              </li>
              <hr />
              <li>
                <a
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                  className="link-item nav-link"
                >
                  Wishlist
                </a>
              </li>
              <hr />
              <li>
                <a
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                  className="link-item nav-link"
                >
                  Cart
                </a>
              </li>
              <hr />
              <li>
                <a
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                  className="link-item nav-link"
                >
                  Login
                </a>
              </li>
              <hr />
            </ul>
          </Modal.Body>
          <Modal.Footer className="border-0"></Modal.Footer>
        </Modal>
        </MediaQuery> */}

      <CartPop show={editModal} onHide={() => setEditModal(false)} />

      <Modal
        className="modal-right scroll-out-negative"
        show={profileModal}
        onHide={() => setProfileModal(false)}
        scrollable
        dialogClassName="full"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold" as="h5">
            Profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="mx-0 px-0">
          <ul>
            {userRole === "admin" && (
              <li
                style={{ listStyle: "none", fontSize: "20px", cursor: 'pointer' }}
                className="fw-bold"
                onClick={() => goToAdmin()}
              >
                Admin Dashboard
              </li>
            )}
            <li
              style={{ listStyle: "none", fontSize: "20px", cursor: 'pointer' }}
              className="fw-bold"
              onClick={() => goToProfile()}
            >
              Profile
            </li>
            <li
              style={{ listStyle: "none", fontSize: "20px", cursor: 'pointer' }}
              className="fw-bold"
              onClick={() => goToOrderPage()}
            >
              Order
            </li>
          </ul>

          {!loggedIn && (
            <Button
              style={{
                backgroundColor: "black",
                color: "white",
                border: "1px solid black",
              }}
              className="mb-1 fs-5 fw-bold w-100"
              onClick={() => goToLoginPage()}
            >
              LOGIN
            </Button>
          )}
          {loggedIn && (
            <Button
              style={{
                backgroundColor: "black",
                color: "white",
                border: "1px solid black",
              }}
              className="mt-1 fs-5 fw-bold w-100"
              onClick={() => {
                logout();
                setProfileModal(false);
              }}
            >
              LOGOUT
            </Button>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0"></Modal.Footer>
      </Modal>
    </>
  );
}

export default AdminHeader;
