import { Link } from "react-router-dom";
import logo from "./logo.png";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";



export default function Header() {
  const { userinfo, setUserinfo } = useContext(UserContext);
  
  useEffect(() => {
      fetch("http://localhost:3001/auth/profil", {
        method: "GET",
        headers: {
          credentials: "include",
          Authorization: localStorage.getItem("token"),
        },
      }).then((reponse) => {
        reponse.json().then((userinfo) => {
         setUserinfo(userinfo);
         
        });
      });
  }, []);
 
  function Logout() {
    
    fetch("http://localhost:3001/auth/logout", {
      method: "POST",
      headers: {
        credentials: "include",
        Authorization: localStorage.getItem("token"),
      },
    })
      .then(() => {
        localStorage.removeItem("token");
        setUserinfo(null);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  const isUserLoggedIn = userinfo !== null && Object.keys(userinfo).length > 0;
      console.log(isUserLoggedIn);
  
  return (
    <header>
      <Link to="/" className="logo-">
        <img src={logo} width="200" className="logo" style={{marginLeft:"-18px"}} />
      </Link>
      <nav>
        {isUserLoggedIn ?(
          <>
            <Link to="/Create" className="header-h" style={{marginTop: "10px"}}>Create New Artcile</Link>
            <Link to="/profil" style={{paddingLeft: "10px",paddingRight: "10px" ,marginTop: "10px"}} className="header-h">Profil</Link>
            <a onClick={Logout} className="header-h" style={{paddingLeft: "10px",paddingRight: "10px" ,marginTop: "10px"}}>Logout</a>
            
          </>
        ):(
          <>
            <Link to="/login" className="header-h">Login</Link>
            <Link to="/Register" className="header-h">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
