import React from 'react'
import Footer from '../Sections/Footer/Footer'
import { Outlet } from 'react-router-dom';
import ShopWebHeader from '../../layout/shopHeader';

function ShopDashboard() {
  return (<>
    <ShopWebHeader />
    <Outlet />
    <Footer />
  </>);
}

export default ShopDashboard;