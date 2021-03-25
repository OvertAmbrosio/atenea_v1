import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import countdown from 'countdown';
import { Tag } from 'antd';
import { lime, orange, red } from '@ant-design/colors';
import { AlertOutlined } from '@ant-design/icons';
import moment from 'moment';

const numero = (numero) => numero < 10 ? `0${numero}` : numero;

const color = (valorTimer, horaTimer) => {
  if (valorTimer > 0) {
    if (horaTimer > 20) {
      return lime.primary;
    } else if (horaTimer <= 20 && horaTimer > 12) {
      return "#87d068";
    } else if (horaTimer <= 12 && horaTimer > 6) {
      return orange.primary;
    } else if (horaTimer <= 6 && horaTimer > 3) {
      return red.primary;
    } else if (horaTimer <= 3 && horaTimer > 0) {
      return red[7];
    } else {
      return "#000000";
    }
  } else {
    return "#000000";
  };
}

export default function Cronometro({fecha}) {
  const [timer, setTimer] = useState({
    tiempo: 0, horaTimer: 0, valorTimer: 0, colorTimer: "default"
  });
  const increment = useRef(null)

  useEffect(() => {
    increment.current = setInterval(() => {
      const duracion = countdown( new Date(), moment(fecha).add(24,"hours"), countdown.HOURS|countdown.MINUTES|countdown.SECONDS)   
      setTimer({
        tiempo: `${numero(duracion.hours)}:${numero(duracion.minutes)}:${numero(duracion.seconds)}`,
        horaTimer: duracion.hours,
        valorTimer: duracion.value,
        colorTimer: color(duracion.value,duracion.hours)
      });
    }, 1000);
    return (() => clearInterval(increment.current))
  //eslint-disable-next-line
  },[]);

  return (
    <Tag 
      color={timer.colorTimer}
      icon={<AlertOutlined />}
    >
      {timer.valorTimer >= 0 ? timer.tiempo : `-${timer.tiempo}`}
    </Tag>
  )
};

Cronometro.propTypes = {
  fecha: PropTypes.any,
};
