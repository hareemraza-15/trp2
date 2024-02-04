import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../Sections/Footer/Footer';
import WebHeader from '../../layout/header';
// import Header from '../Sections/Header/Header';

function UserDashboard() {
  return (<>
    {/* <Header /> */}
    <WebHeader />
    <Outlet />
    <Footer />
  </>)
}

export default UserDashboard;