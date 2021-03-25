import React from 'react';
import { rutas } from '../constants/listaRutas'

export default function Index() {
  return (
    <div>
      <a href={rutas.login}>login</a>
    </div>
  )
}