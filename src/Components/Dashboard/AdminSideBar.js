import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Button } from "react-bootstrap";
import {
  ArrowRight,
  Calendar,
  Cart,
  Airplane,
  Balloon,
  Speedometer,
  List,
  Person,
  BagHeart,
  LayoutWtf,
  PaletteFill,
  GenderTrans,
  Rulers,
  Image,
  Receipt,
} from "react-bootstrap-icons";

function AdminSideBar() {
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(
    window.matchMedia("(max-width: 800px)").matches
  );

  return (
    <>
      <div
        style={{ display: "flex", height: "100%", backgroundColor: "#ffffff" }}
      >
        <Sidebar
          onBackdropClick={() => setToggled(false)}
          toggled={toggled}
          customBreakPoint="800px"
          onBreakPoint={setBroken}
        >
          <Menu
            menuItemStyles={{
              button: ({ level, active, disabled }) => {
                return {
                  // color: disabled ? "grey" : "#C06C84",
                  backgroundColor: active ? "#ffffff" : "whitesmoke",
                };
              },
            }}
          >
            <MenuItem
              component={<Link to="/" />}
              active
              icon={<Speedometer color="#C06C84" size={20} />}
            >
              Home
            </MenuItem>
            <SubMenu
              active
              label="Category"
              icon={<LayoutWtf color="#C06C84" size={20} />}
            >
              <MenuItem component={<Link to="/admin/CreateCategory" />}>
                Create Category
              </MenuItem>
              <MenuItem component={<Link to="/admin/ListCategory" />}>
                List Category
              </MenuItem>
            </SubMenu>
            <SubMenu
              active
              label="Coupon"
              icon={<LayoutWtf color="#C06C84" size={20} />}
            >
              <MenuItem component={<Link to="/admin/create_coupon" />}>
                Create Coupon
              </MenuItem>
              <MenuItem component={<Link to="/admin/list_coupon" />}>
                List Coupon
              </MenuItem>
            </SubMenu>
            <SubMenu
              active
              label="Gallery"
              icon={<LayoutWtf color="#C06C84" size={20} />}
            >
              <MenuItem component={<Link to="/admin/CreateGallery" />}>
                Create Gallery
              </MenuItem>
              <MenuItem component={<Link to="/admin/ListGallery" />}>
                List Gallery
              </MenuItem>
            </SubMenu>
            <SubMenu
              active
              label="Color"
              icon={<PaletteFill color="#C06C84" size={20} />}
            >
              <MenuItem component={<Link to="/admin/CreateColor" />}>
                Create Color
              </MenuItem>
              <MenuItem component={<Link to="/admin/ListColor" />}>
                List Color
              </MenuItem>
            </SubMenu>
            <SubMenu
              active
              label="Gender"
              icon={<GenderTrans color="#C06C84" size={20} />}
            >
              <MenuItem component={<Link to="/admin/CreateGender" />}>
                Create Gender
              </MenuItem>
              <MenuItem component={<Link to="/admin/ListGender" />}>
                List Gender
              </MenuItem>
            </SubMenu>
            <SubMenu
              active
              label="Order"
              icon={<Receipt color="#C06C84" size={20} />}
            >
              <MenuItem component={<Link to="/admin/ListOrder" />}>
                List Order
              </MenuItem>
            </SubMenu>
            <SubMenu
              active
              label="Product"
              icon={<BagHeart color="#C06C84" size={20} />}
            >
              <MenuItem component={<Link to="/admin/CreateProduct" />}>
                Create Product
              </MenuItem>
              <MenuItem component={<Link to="/admin/ListProduct" />}>
                List Product
              </MenuItem>
              <MenuItem component={<Link to="/admin/UpdateProduct" />}>
                Update Product
              </MenuItem>
            </SubMenu>
            <SubMenu
              active
              label="Size"
              icon={<Rulers color="#C06C84" size={20} />}
            >
              <MenuItem component={<Link to="/admin/CreateSize" />}>
                Create Size
              </MenuItem>
              <MenuItem component={<Link to="/admin/ListSize" />}>
                List Size
              </MenuItem>
            </SubMenu>
            <SubMenu
              active
              label="Slider"
              icon={<Image color="#C06C84" size={20} />}
            >
              <MenuItem component={<Link to="/admin/CreateSlider" />}>
                Add Slider
              </MenuItem>
              <MenuItem component={<Link to="/admin/ListSlider" />}>
                List Slider
              </MenuItem>
            </SubMenu>
            <SubMenu
              active
              label="User"
              icon={<Person color="#C06C84" size={20} />}
            >
              <MenuItem component={<Link to="/admin/User" />}>User</MenuItem>
            </SubMenu>
          </Menu>
        </Sidebar>
        <main style={{ padding: 10 }}>
          <div>
            {broken && (
              <Button
                className="btn btn-dark mt-5"
                onClick={() => setToggled(!toggled)}
              >
                <List size={20} />
              </Button>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default AdminSideBar;
