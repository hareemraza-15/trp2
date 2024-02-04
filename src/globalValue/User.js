import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

function User() {
  const token = localStorage.getItem('token');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if(token) {
      setLoggedIn(true);
    }
    else {
      setLoggedIn(false);
    }
  }, [token]);
  
 
 console.log("loggedIn: ", loggedIn);
 console.log("!loggedIn", !loggedIn );

  return loggedIn, setLoggedIn;
}

export default User;