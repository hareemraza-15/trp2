import React from 'react';
import Header from '../../Sections/Header/Header';
import { Outlet } from 'react-router-dom';
import Footer from '../../Sections/Footer/Footer';

function DashHome() {
  return (<>
  <Header />
  <Outlet />
  <Footer />

  </>)
}

export default DashHome;