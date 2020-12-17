import React, { Component } from "react";
import Cookie from "js-cookie";

import variables from "../../constants/config";
import { rutas } from '../../constants/listaRutas';
import { session } from "../../services/apiUsuario";
import { AuthToken } from "../../services/authToken";

export default function PrivateLayout(WrappedComponent) {
  return class extends Component {  

    constructor(props)   {
      super(props)
      this.state = {
        spin: true,
        cargo: null,
      }
    }
    async componentDidMount() {
      const token = Cookie.get(variables.TOKEN_STORAGE_KEY);
      if (!token) {
        document.location.href = (rutas.login);
      } else {
        const usuario = new AuthToken(token);
        await session(true).then((data) => {
          if(data.status === 'error') {
            Cookie.remove(variables.TOKEN_STORAGE_KEY);
            document.location.href = (rutas.login);
          } else {
            this.setState({spin: false, cargo: usuario.decodedToken.cargo })
          }
        }).catch((error) => {
          this.setState({spin: false})
          console.log(error);
          console.log('error de sesion en (PrivateRoutes)');
        });
      }
    }

    render() {
      return <WrappedComponent {...this.props} spinLoading={this.state.spin} cargo={this.state.cargo}/>;
    }
  };
};