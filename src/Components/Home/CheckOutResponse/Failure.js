import React from "react";
import img from "./failure.png";

function Failure() {
  return (
    <>
      <div className="text-center">
        <img
          style={{
            height: "125px",
            width: "125px",
            borderRadius: "50px",
            marginTop: "10%",
          }}
          alt="tick"
          src={img}
        />
        <h1 className="my-2 mx-2">Payment Failed</h1>
      </div>
    </>
  );
}

export default Failure;
