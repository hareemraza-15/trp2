import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import toast from "react-hot-toast";

function HandleResponse() {
  const { txnID } = useParams();
  const navigate = useNavigate();

  console.log("txnID", txnID);

  const PAYMENT_RESPONSE = gql`
    mutation HandlePaymentResponse($txn: String) {
      handlePaymentResponse(txn: $txn) {
        success
        message
      }
    }
  `;

  const [HandlePaymentResponse] = useMutation(PAYMENT_RESPONSE, {
    variables: {
      txn: txnID,
    },
    onCompleted: (res) => {
      if (res.handlePaymentResponse.success) {
        setTimeout(() => {
          navigate('/checkout/success');
        }, 2000);
      }
      if (!res.handlePaymentResponse.success) {
        setTimeout(() => {
          navigate('/checkout/failure');
        }, 2000);
      }
    },
    onError: (err) => {
      console.log('err', err);
      toast.error('Something Went Wrong !');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    },
  });

  useEffect(() => {
    HandlePaymentResponse();
  }, [txnID]);

  return (
    <>
      <div className="text-center">
        <div>
          <span className="spinner spinner-large spinner-blue spinner-slow" />
        </div>
        <br />
        <br />
        <h1 className='mt-5' style={{marginTop: "10%"}}>Loading...</h1>
      </div>
    </>
  );
}

export default HandleResponse;