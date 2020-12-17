import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";
import Cookie from "js-cookie";

import variables from "../../constants/config";
import { AuthToken } from "../../services/authToken";
import NotFound from "./NotFound";

function PrivateRoute({ component: Component, nivel=[], ...rest }) {
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    setUsuario(new AuthToken(Cookie.get(variables.TOKEN_STORAGE_KEY)).decodedToken);
  },[nivel])

  if(nivel.includes(0)) {
    return (<Route {...rest} render={props => (<Component {...props}/>)}/>)
  } else if (usuario && nivel.includes(usuario.cargo)) {
    return (<Route {...rest} render={props => (<Component {...props}/>)}/>)
  } else {
    return (<Route {...rest} render={() => (<NotFound/>)}/>)
  }
};

PrivateRoute.propTypes = {
  component: PropTypes.func,
  nivel: PropTypes.array
};

export default PrivateRoute;