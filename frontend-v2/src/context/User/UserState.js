  
import React, { useReducer } from "react";

import UserContext from "./UserContext";
import UserReducer from "./UserReducer";

import { GET_VIEWS } from "../types";

const UserState = (props) => {
  const initialState = {
    views: []
  };

  const [state, dispatch] = useReducer(UserReducer, initialState);

  const getViews = async (views) => {
    try {
      dispatch({ type: GET_VIEWS, payload: views });
    } catch (error) {}
  };

  return (
    <UserContext.Provider
      value={{
        views: state.views,
        getViews
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;