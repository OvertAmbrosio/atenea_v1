import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import 'moment/locale/es-mx';
import es_ES from 'antd/es/locale/es_ES';

import './App.css';
import { rutas } from './constants/listaRutas';
import Index from './views/Index';
import Login from './views/Login';
import Layout from './components/layout';
import routes from './routes';
import PrivateRoute from './components/layout/PrivateRoute';
import SubirIndicadores from './views/SubirIndicadores';

export default function App() {
  return (
    <ConfigProvider locale={es_ES}>
      <Router>
        <Switch>
          <Route exact path="/" component={Index} />
          <Route exact path="/indicadores" component={SubirIndicadores} />
          <Route exact path={rutas.login} component={Login}/>
          <Layout>
          {routes.map((route, index) => (
              <PrivateRoute 
                key={index}
                path={route.path}
                exact={route.exact}
                nivel={route.nivel}
                component={
                  props => (<route.component {...props}/>)
                }
              />
            )
          )}
          </Layout>
        </Switch>
      </Router>
    </ConfigProvider>
  );
}
