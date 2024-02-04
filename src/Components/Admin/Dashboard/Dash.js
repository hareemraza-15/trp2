import React from 'react';
import { Outlet } from "react-router-dom";
import { ProSidebarProvider, Sidebar, SidebarContext } from "react-pro-sidebar";
import Dashboard from './Dashboard';
import Header from '../../Sections/Header/Header';

function Dash() {
  return (
    <>
    <div className="your-element" style={{backgroundImage:"url('/barner2.png')",backgroundSize:"cover", position:" relative",backgroundReapeat:"no-repeat"
     }}>
      {/* <AdminNavbar /> */}
      {/* <Header /> */}
     <div className="container-fluid">
      <div className="row">
        <div className="col-3 mx-0 px-0" style={{ backgroundColor: "black"}}>
          <Dashboard />
        </div>
        <div className="col-9 mx-0 px-0" style={{ backgroundColor: "black", color: "white"}}>
          <Outlet />
        </div>
      </div>
    </div>
      {/* <AdminFooter /> */}
      </div>
    </>
  )
}

export default Dash