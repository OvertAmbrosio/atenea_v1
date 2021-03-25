import React, { Component } from "react";
import Cookie from "js-cookie";

import variables from "../../constants/config";
import { rutas } from '../../constants/listaRutas';
import { session } from "../../services/apiUsuario";
import UserContext from "../../context/User/UserContext";

export default function PrivateLayout(WrappedComponent) {
  
  return class extends Component {  

    static contextType = UserContext

    constructor(props) {
      super(props)
      this.state = {
        spin: true
      }
    }

    async componentDidMount() {
      const token = Cookie.get(variables.TOKEN_STORAGE_KEY);
      if (!token) {
        document.location.href = (rutas.login);
      } else {
        await session(true).then((data) => {
          if(data.status !== 'success') {
            Cookie.remove(variables.TOKEN_STORAGE_KEY);
            document.location.href = (rutas.login);
          } else {
            if(data && data.data && data.data.vistas) this.context.getViews(data.data.vistas)
            this.setState({spin: false })
          }
        }).catch((error) => {
          this.setState({spin: false})
          console.log(error);
          console.log('error de sesion en (PrivateRoutes)');
        });
      }
    }

    render() {
      return <WrappedComponent {...this.props} spinLoading={this.state.spin}/>;
    }
  };
};