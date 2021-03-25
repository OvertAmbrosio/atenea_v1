import React, { useContext } from "react";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";

import NotFound from "./NotFound";
import UserContext from "../../context/User/UserContext";

function PrivateRoute({ component: Component, path, ...rest }) {
  const { views } = useContext(UserContext);

  if (path && views && views.length > 0) {
    if(views.includes(path)) {
      return (<Route path={path} {...rest} render={props => (<Component {...props}/>)}/>)
    } else {
      return (<Route path={path} {...rest} render={() => (<NotFound/>)}/>)
    }
  } else {
    return null
  };
};

PrivateRoute.propTypes = {
  component: PropTypes.func,
  path: PropTypes.string
};

export default PrivateRoute;