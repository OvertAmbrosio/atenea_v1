import React, { useState, useEffect } from 'react';
import { Carousel, Image } from 'antd';

import { socket } from '../services/socket';
import Contenedor from '../components/common/Contenedor';
import { rutas } from '../constants/listaRutas'
import cogoToast from 'cogo-toast';

export default function Index() {
  const [listaImagenes, setListaImagenes] = useState([]);

  useEffect(() => {
    socket.emit('enviarIndicadores');
    
    socket.on('indicadoresimagenes', (imagenes) => {
      setListaImagenes(imagenes);
    });

    socket.on('error', (e) => {
      console.log(e);
      cogoToast.error('Error conectando al servidor.', { position: 'top-left' })
    });

    return () => {
      socket.off('indicadoresimagenes');
    };
    // eslint-disable-next-line
  },[]);

  return (
    <div>
      <Contenedor>
        <div style={{ fontSize: "1.5rem" }}>
          <a href={rutas.login}>login</a>
        </div><br/><br/>
        <Carousel autoplay autoplaySpeed={30000}>
        {
          listaImagenes && listaImagenes.length > 0 ?
          listaImagenes.map((img, i) => img? (<div key={i} style={{ minWidth: '100vw', height: '80vh' }}>
            <Image src={img} width="100vw" height="80vh"/>
          </div>) :null)
          :null
        }
        </Carousel>
      </Contenedor>
    </div>
  )
}