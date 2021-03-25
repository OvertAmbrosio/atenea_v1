import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { socket } from '../../../../services/socket';
import TablaPendientes from './TablaPendientes';
import cogoToast from 'cogo-toast';
import metodos from '../../../../constants/metodos';

const { Option } = Select;

function Index({contratas=[], gestores=[], tecnicos=[], zonas=[], nodos=[], tipo}) {
  const [listaOrdenes, setListaOrdenes] = useState([]);

  useEffect(() => {
    return () => {
      console.log("Socket desconectado.");
      cogoToast.info("Sincronización finalizada.", { position: "bottom-left" })
      socket.off(metodos.ORDENES_SOCKET_PENDIENTES);
    };
  },[])

  useEffect(() => {
    if (zonas.length === 1) {
      console.log("conectando... ");
      cogoToast.loading("Conectando con el servidor...", { position: "bottom-left" })
      socket.emit(metodos.UNIR_SALA_PENDIENTES, {zona: zonas[0]._id, tipo});
      socket.on(metodos.ORDENES_SOCKET_PENDIENTES, ({data}) => {
        console.log("doble");
        setListaOrdenes(data);
      })
      socket.on('disconnect', () => {
        console.log("desconectado por inactividad");
        cogoToast.loading("Reconectando al servidor...", { position: "bottom-left" });
        socket.emit(metodos.UNIR_SALA_PENDIENTES, {zona: zonas[0]._id, tipo});
      })
    };   
  //eslint-disable-next-line
  },[zonas]);

  return (
    <div>
      {
        zonas.length > 1 ?
        (<div style={{ marginBottom: '.5rem' }}>
          <Select style={{ width: 200 }} size="small" placeholder="Seleccionar Zona">
            {zonas.map((e,i) => (
              <Option key={i} value={e._id}>{e.nombre}</Option>
            ))}
          </Select>
          <Button 
            size="small" 
            style={{ marginLeft: '.5rem' }}
            icon={<SearchOutlined/>}
            type="primary"
          >
            Buscar
          </Button>
        </div>):null
      }
      <TablaPendientes
        ordenes={listaOrdenes}
        contratas={contratas}
        gestores={gestores}
        tecnicos={tecnicos}
        tipo={tipo}
        nodos={nodos.length > 0 ? nodos: []}
      />
    </div>
  )
};

Index.propTypes = {
  contratas: PropTypes.array,
  gestores: PropTypes.array,
  tecnicos: PropTypes.array,
  zonas: PropTypes.array,
  tipo: PropTypes.string
};

export default Index;

