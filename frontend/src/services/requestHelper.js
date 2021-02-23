// eslint-disable-next-line no-unused-vars
import axios, { AxiosRequestConfig } from 'axios';
import Cookie from "js-cookie";
import cogoToast from 'cogo-toast';
//objeto con variables del sistema (direccion url de la api)
import variables from '../constants/config';

/**
 * @param {AxiosRequestConfig} config - Objeto con las variables de configuracion de axios
*/
export const restAuth = async (config) => {
  //iniciar toast de loading
  const closeLoading = cogoToast.loading('Iniciando sesión...', {
    hideAfter: 0, position: 'top-right', role: "success"
  });
  //inicializar objeto para realiuzar la consulta (axios)
  const newAxiosRequest = axios.create({
    baseURL: variables.urlApi
  });
  //retorna la peticion, y se extrae la propiedad "data"
  return await newAxiosRequest(({...config})).then(({data}) => {
    //una vez que se obtiene la respuesta se debe 
    //cerrar el toast de loading
    closeLoading.hide();
    //si se encuentra la data enviarla al fron
    if (data && data.data) {
      cogoToast.success(data.message, { position: 'top-right' })
      return ({data: data.data, errors: false});
    } else {
    //error que salta al no poder obtener la data del data
      cogoToast.error('No se puede obtener la data' ,{ position: 'top-right'})
      throw Error("No se puede obtener la data");
    }
  }).catch(err => {
    //en caso de error cerrar el loading
    closeLoading.hide();
    //enviar un mensaje en escenario posible dependiendo del error
    if (err.response) {
      //mostrar el error por consola
      console.log(err.response);
      //guardar la informacion del error en un avariables
      const errData = (err.response.data);
      //mostrar como mensaje el primero error que muestre
      const message = errData[Object.keys(errData)[0]] !== undefined ? 
        errData[Object.keys(errData)[0]] 
        : 'Error en la solicitud.';
      //enviar un aviso con el mensaje de error
      cogoToast.warn( message, { position: 'top-right' });
      //retornar le data vacia
      return {
        data: false, 
        errors: errData
      }
    } else if (err.request) {
      console.log(err.request);
      cogoToast.warn("Se realizó la solicitud, pero no se recibió respuesta.",
      { position: 'top-right'})
      throw err
    } else {
      cogoToast.error('Algo sucedió al configurar la solicitud que provocó un error.',
      { position: 'top-right'})
      throw err
    }
  })
};

/**
 * @param {AxiosRequestConfig} config
 * @param {boolean} toast false si no se quiere mostrar el toast
*/
export const restPrivate = async (config, toast) => {
  let closeLoading;
  if (toast) {
    closeLoading = cogoToast.loading('Cargando...', {
      hideAfter: 0, position: 'top-right', role: "success"
    });
  }

  const newAxiosRequest = axios.create({
    baseURL: variables.urlApi,
    headers: {
      Authorization: 'Bearer ' + Cookie.get(variables.TOKEN_STORAGE_KEY)
    }
  });

  return await newAxiosRequest(({...config})).then(({data}) => {
    if (toast) {
      closeLoading.hide();
      cogoToast[data.status ? data.status : 'error'](data.message, { position: 'top-right' })
    }
    return (data);
  }).catch(err => {
    if (toast) closeLoading.hide();
    if (err.response) {
      const errData = err.response.data;
      if (String(err.response.status) === "401") {
        cogoToast.error('Token Invalido, cerrando sesión.',
        { position: 'top-right'});
        Cookie.remove(variables.TOKEN_STORAGE_KEY);
        document.location.href="/login";
      } else {
        cogoToast.warn( errData.message !== 'undefined' ? errData.message : 'Error en la solicitud.',
        { position: 'top-right'})
      }
      return {
        data: null, 
        errors: errData
      }
    } else if (err.request) {
      console.log(err.request);
      cogoToast.warn("Se realizó la solicitud, pero no se recibió respuesta.",
      { position: 'top-right'})
      throw err
    } else {
      cogoToast.error('Algo sucedió al configurar la solicitud que provocó un error.',
      { position: 'top-right'})
      throw err
    }
  })
};