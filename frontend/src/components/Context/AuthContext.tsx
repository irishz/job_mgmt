import { createContext } from "react";
import { iUserAPI } from "../../types/user-types";
import React, { Dispatch, SetStateAction } from "react";

interface IAuthContext {
  userToken: string;
  setuserToken: Dispatch<SetStateAction<string>>;
  userData: iUserAPI | null;
  setuserData: Dispatch<SetStateAction<iUserAPI | null>>;
}

const AuthContext = createContext<IAuthContext | null>(null);

export default AuthContext;
