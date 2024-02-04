import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { NavConfig } from './navConfig';
import logo1 from './Images/logo-TRP.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Image, Modal, Stack } from 'react-bootstrap';
import { gql, useLazyQuery } from '@apollo/client';
import CartPop from '../Components/Home/CartSection/CartPop';
import { Bag, Filter, Heart, PersonCircle, Search } from 'react-bootstrap-icons';
import toast from 'react-hot-toast';

export default function ShopWebHeader() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [loggedIn, setLoggedIn] = React.useState(false);
  const userRole = localStorage.getItem('userRole');
  const [editModal, setEditModal] = React.useState(false);
  const [profileModal, setProfileModal] = React.useState(false);

  React.useEffect(() => {
    if (token) {
      setLoggedIn(true);
    }
    else {
      setLoggedIn(false);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('role');
    setLoggedIn(false);
  }

  const goToLoginPage = () => {
    navigate('/login');
  }

  const goToProfile = () => {
    navigate('/shop/profile');
    setProfileModal(false);
  }

  const goToOrderPage = () => {
    navigate('/shop/order');
    setProfileModal(false);
  }

  const goToWishList = () => {
    navigate('/shop/wishlist');
    setProfileModal(false);
  }

  const goToAdmin = () => {
    navigate('/admin');
  }

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

  React.useEffect(() => {
    getCartData();
  }, []);


  // handle search bar
  const [searchbarview, setSearchbarview] = useState(false);

  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query) {
      setSearchbarview(false);
      navigate(`/shop/search/${query}`);

    }
    else {
      toast.error('Please Enter Some Value')

    }
  }

  return (
    <React.Fragment>
      <Navbar
        sticky="top"
        style={{
          backgroundColor: "#000000",
          color: "#ffffff",
          boxShadow: "1px -6px 12px #000000",
        }}
        expand="lg"
        collapseOnSelect>
        <Container style={{ marginBottom: '0px' }}>
          <Link href="/" legacyBehavior passHref>
            <Navbar.Brand>
              <Image src={logo1} height={100} width={140} alt='Logo' style={{ borderRadius: "15px" }} />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle
            style={{ background: "transparent", border: 'none', color: "#ffffff" }}
            aria-controls="basic-navbar-nav"
          >
            <Filter size={22} />
          </Navbar.Toggle>
          <Navbar.Offcanvas
            id={`navbar-expand`}
            aria-labelledby={`navbar-expand`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`navbar-expand`}>
                <Image src={logo1} height={50} width={50} alt='Logo' />
              </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>

              <Nav className="ms-auto">
                {NavConfig && NavConfig.map((menu, index) => {
                  return (

                    <Nav.Link
                      style={{
                        color: "#ffffff",
                        fontSize: "16px",
                        padding: "10px 23px"
                      }}
                      key={`menu-${index}`}
                      onClick={() => navigate(menu.href)}
                    >
                      {menu.title}
                    </Nav.Link>
                  )
                })}
                <Stack direction='horizontal' gap={3}>
                  <Search style={{ color: "#ffffff" }} className='icons mx-1' size={22}
                    onClick={() => setSearchbarview(true)} />
                  <Bag style={{ color: "#ffffff" }} onClick={() => { setEditModal(true) }} className='icons mx-1' size={22} />
                  <Heart style={{ color: "#ffffff" }} onClick={() => { goToWishList(true) }} className='icons mx-1' size={22} />
                  <PersonCircle style={{ color: "#ffffff" }} onClick={() => setProfileModal(true)} className='icons mx-1' size={22} />
                </Stack>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <CartPop show={editModal} onHide={() => setEditModal(false)} />
      <Modal className="modal-right scroll-out-negative" show={profileModal} onHide={() => setProfileModal(false)} scrollable dialogClassName="full">
        <Modal.Header closeButton>
          <Modal.Title className='fw-bold' as="h5">Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className='mx-0 px-0'>
          <ul>
            {userRole === "admin" && <li style={{ listStyle: "none", fontSize: "20px", cursor: 'pointer' }} className='fw-bold' onClick={() => goToAdmin()} >Admin Dashboard</li>}
            <li style={{ listStyle: "none", fontSize: "20px", cursor: 'pointer' }} className='fw-bold' onClick={() => goToProfile()} >Profile</li>
            <li style={{ listStyle: "none", fontSize: "20px", cursor: 'pointer' }} className='fw-bold' onClick={() => goToOrderPage()}>Order</li>
          </ul>

          {!loggedIn && <Button style={{ backgroundColor: "black", color: "white", border: "1px solid black" }} className='mb-1 fs-5 fw-bold w-100' onClick={() => goToLoginPage()} >LOGIN</Button>}
          {loggedIn && <Button style={{ backgroundColor: "black", color: "white", border: "1px solid black" }} className='mt-1 fs-5 fw-bold w-100' onClick={() => { logout(); setProfileModal(false) }} >LOGOUT</Button>}

        </Modal.Body>
        <Modal.Footer className="border-0"></Modal.Footer>
      </Modal>

      {
        <Modal
          className="modal-right scroll-out-negative"
          show={searchbarview}
          onHide={() => setSearchbarview(false)}
          scrollable
          dialogClassName="full"
        >
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold" as="h5">
              Search Product
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="mx-0 px-0">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="input-group">
                    <input
                      className="form-control border-secondary py-2"
                      type="search"
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={handleSearch}
                      >
                        <Search className="icons mx-1" size={22} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      }
    </React.Fragment>
  )
}
