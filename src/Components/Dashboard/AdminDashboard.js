import React from "react";
import AdminSideBar from "./AdminSideBar";
import { Outlet } from "react-router-dom";
import AdminHeader from "../Sections/Header/AdminHeader";

function AdminDashboard() {
  return (
    <>
      <div
        className="your-element"
        style={{
          backgroundImage: "url('/barner2.png')",
          backgroundSize: "cover",
          position: " relative",
          backgroundReapeat: "no-repeat",
        }}
      >
        <AdminHeader />
        <div className="container-fluid">
          <div className="row">
            <div
              className="col-3 mx-0 px-0"
              style={{
                //  backgroundColor: "#ffffff",
                marginTop: "7%",
              }}
            >
              <AdminSideBar />
            </div>
            <div
              className="col-9 mx-0 px-0"
              style={{
                // backgroundImage: "linear-gradient(#e66465, #9198e5)",
                // backgroundColor: "#ffffff",
                // color: "#C06C84",
                marginTop: "7%",
              }}
            >
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
