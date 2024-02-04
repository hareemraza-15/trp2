import React from "react";
import img from "./success.png";

function Success() {
  return (
    <>
      <div className="text-center">
        <img
          style={{
            height: "175px",
            width: "140px",
            borderRadius: "50px",
            marginTop: "10%",
          }}
          alt="tick"
          src={img}
        />
        <h1 className="my-2 mx-2">Payment Successful</h1>
      </div>
    </>
  );
}

export default Success;
