import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader } from 'antd';

const TituloVista = ({titulo, subtitulo}) => {
  const routes = [
    {
      breadcrumbName: subtitulo,
    },
  ];

  return (
    <PageHeader
      className="site-page-header"
      title={titulo}
      breadcrumb={{routes}}
    />
  )
};

TituloVista.propTypes = {
  titulo: PropTypes.string,
  subtitulo: PropTypes.string
}

export default TituloVista
