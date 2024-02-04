import React from 'react';
import { Card } from 'react-bootstrap';

function FAQ() {
  return (<>
    <section className="slider">
      <h1 className='text-center pt-5 pb-3'>Frequently Asked Questions</h1> </section>
    <Card style={{ border: "none" }}>
      <Card.Body className='mx-lg-5'>
        <div className='text-left mx-lg-5' >
          <h5 style={{ fontFamily: "raleway", letterSpacing: "2px", fontWeight: "bolder" }} className='fw-bold fs-5 text-black'>1.) How can I get updated on new arrivals about TRP_FITS_OFFICIAL regularly?</h5>
          <p style={{ fontWeight: "bold", fontFamily: "raleway", letterSpacing: "2px" }} className='fw-bold fs-6'>A. You can follow our Social media channels and visit our Websites for regular updates. Be the first to know about news, events, and more. Don't miss out – join our community today!</p>
          <br />
          <h5 style={{ fontFamily: "raleway", letterSpacing: "2px", fontWeight: "bolder" }} className='fw-bold fs-5 text-black'>2.) How about our Refund and Return policy?</h5>
          <p style={{ fontWeight: "bold", fontFamily: "raleway", letterSpacing: "2px" }} className='fw-bold fs-6'>A. We always serve quality products, and we do not offer a refund or return policy. Rest assured, our commitment to delivering top-notch products. Your satisfaction is our priority.</p>
          <br />
          <h5 style={{ fontFamily: "raleway", letterSpacing: "2px", fontWeight: "bolder" }} className='fw-bold fs-5 text-black'>3.) How long will it take to get my order?</h5>
          <p style={{ fontWeight: "bold", fontFamily: "raleway", letterSpacing: "2px" }} className='fw-bold fs-6'>A. It usually takes the same day to 3 days after ordering the products, we will keep notify you.</p>
          <br />
          <h5 style={{ fontFamily: "raleway", letterSpacing: "2px", fontWeight: "bolder" }} className='fw-bold fs-5 text-black'>4.) What sizes do we offer for Sportswear?</h5>
          <p style={{ fontWeight: "bold", fontFamily: "raleway", letterSpacing: "2px" }} className='fw-bold fs-6'>A. We provide a range of sizes for our sportswear, including S, M, L, XL, XXL, and all +sizes. Our aim is to create a more customer-friendly and inclusive sportswear shopping experience.</p>
          <br />
          <h5 style={{ fontFamily: "raleway", letterSpacing: "2px", fontWeight: "bolder" }} className='fw-bold fs-5 text-black'>5.) What Category do we offer in our Store?</h5>
          <p style={{ fontWeight: "bold", fontFamily: "raleway", letterSpacing: "2px" }} className='fw-bold fs-6'>A. Check out categories we deal in our comfortable track pants, stylish T-shirts, cool shorts, leggings, yoga clothes and more. All made from top-quality materials for your comfort and performance.</p>
          <br />
          <h5 style={{ fontFamily: "raleway", letterSpacing: "2px", fontWeight: "bolder" }} className='fw-bold fs-5 text-black'>6.) Where can I go for help or assistance?</h5>
          <p style={{ fontWeight: "bold", fontFamily: "raleway", letterSpacing: "2px" }} className='fw-bold fs-6'>A. For any queries or assistance, feel free to reach out to us via email at [YourEmailAddress]. We're here to help and eager to address any concerns you may have.</p>
        </div>
      </Card.Body>
    </Card>
  </>);
}

export default FAQ;