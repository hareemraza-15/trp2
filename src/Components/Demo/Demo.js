import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Button } from 'flowbite-react';
import { FloatingWhatsApp } from 'react-floating-whatsapp';

function Demo() {
  const navigate = useNavigate();
  
  const mystyle = { 
    color: "black"
  }
  
  return (
    <div>
      <Navbar fluid rounded>
      <Navbar.Brand as={Link} href="https://flowbite-react.com">
        {/* <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" /> */}
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React</span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link as={Link} href="#">
          About
        </Navbar.Link>
        <Navbar.Link href="#">Services</Navbar.Link>
        <Navbar.Link href="#">Pricing</Navbar.Link>
        <Navbar.Link href="#">Contact</Navbar.Link>
      </Navbar.Collapse>
      </Navbar> 
      <FloatingWhatsApp   
        onClick={() =>  window.location.href="https://wa.me/918829999060?text="} 
        phoneNumber="918829999060"
        accountName="The Royal Pajama"
        statusMessage='Online'
        allowEsc
        chatboxHeight={300}
        chatboxStyle
      
        allowClickAway
        notification={false}
        notificationSound={false}
        chatMessage={`Hi There,
You can contact us here for any suggestion or query!`}
       
        /> 
      {/* <Button outline gradientDuoTone="purpleToPink">
        Purple to Pink
      </Button> */}
      {/* <button class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
<span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
Pink to orange
</span>
      </button>

     <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Default</button> */}
    </div>
  )
}

export default Demo