import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Success from "./Success";
import Failure from "./Failure";

function HandlePaymentPage() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search).get(
    "status"
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/shop/order");
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchParams, navigate]);

  return <>{searchParams === "true" ? <Success /> : <Failure />}</>;
}

export default HandlePaymentPage;
