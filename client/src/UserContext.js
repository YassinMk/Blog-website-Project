import { createContext, useState } from "react";

export const  UserContext=createContext({});
export function UserContextProvider({children}){
    const [userinfo,setUserinfo]=useState({});
    return(
        <UserContext.Provider value={{userinfo,setUserinfo}}>
                {children}
        </UserContext.Provider>
    );
}