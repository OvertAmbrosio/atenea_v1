import { spawn  } from 'child_process';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import moment from 'moment';
import csv from 'csvtojson';
import fetch from 'node-fetch';

import logger from '../lib/logger';
import { variables } from '../config/config';
import { valoresToa, valoresRuta, TOrdenToa } from '../lib/devolverValores';

//funcion

//controlador que se encargara de recibir la peticion del servidor de amazon
//luego correrá el script de python
//guardara errores y enviará el estado del script
export const getOrdenes = async(req:Request, res:Response):Promise<any> => {
  //establecer la ruta del bot
  const pathBot = path.join(__dirname + '/../script/bot.py');
  try {
    //extrar variables
    const cuenta = req.query;
    console.log(cuenta)
    //declarar el script a ejecutar en nodejs
    const pythonprocc = spawn('python', [pathBot, `--user=${cuenta.user}`, `--psw=${cuenta.pass}`]);
    //ejecutar el codigo en la linea de comandos
    pythonprocc.stdout.on('data', function(data:Buffer) {
      //convertir el resultado a json
      const buffData =  data.toString('utf8');
      //guardar el resultado en el logger
      logger.info({
        message: buffData,
        service: '-bot ejecutado con exito-'
      })
      //retornar en la peticion el resultado del script
      return res.send({status: 'success'});
    });
    //ejecutar el metodo stderr para capturar en caso salga un error
    pythonprocc.stderr.on('data', (data:Buffer) => {
      //convertir el resultado a json
      const buffData =  data.toString('utf8');
      //guardar en el logger el error
      logger.error({
        message: buffData,
        service: '-error ejecutando el bot-'
      })
      //retornar en la peticion el resultado del script
      return res.send({status: 'error'});
    });
  } catch (error) {
    //en caso de haber error en la setencia enviarlo
    return res.send({status: 'error', message: error});
  };  
};
//controlador que se encargará de recibir la petición de python
//recibirá un archivo csv
//luego lo convertirá en json y enviará (post) al servidor de amazon
//guardará un registro de los estados en el logger
export const postOrdenes = async(req:Request, res:Response):Promise<Response> => {
  try {
    const registroBot = JSON.stringify(req.body);

    if (!req.file.path) {
      return res.send({status: 'error'});
    }

    return await csv().fromFile(req.file.path).then(async(jsonObj) => {
      fs.unlinkSync(req.file.path);
      let rutas:Array<string> = jsonObj.filter((o) => o['Estado actividad'] === 'Iniciado').map((o) => valoresRuta(o)).filter((e) => String(e).length === 6);
      let hfcR:Array<TOrdenToa> = jsonObj.filter((o) => o['Categoría de Capacidad'] === 'HFC - Reparación').map((o) => valoresToa(o));
      let hfcP:Array<TOrdenToa> = jsonObj.filter((o) => o['Categoría de Capacidad'] === 'HFC - Provisión').map((o) => valoresToa(o));
      let adsl:Array<TOrdenToa> = jsonObj.filter((o) => o['Categoría de Capacidad'] === 'ADSL - Reparación').map((o) => valoresToa(o));
      const strBody = JSON.stringify({
        rutas, hfcR, hfcP, adsl,
        registro: registroBot
      });
      
      return await fetch(variables.api_private, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: strBody
      }).then(() => res.send('success'))
        .catch((e) => {
          console.log(e);
          return res.send('error')
        });
    });
  } catch (err) {
    console.log(err);
    logger.error({
      message: err.message,
      service: 'postOrdenes'
    });
    return res.send('error');
  };
};