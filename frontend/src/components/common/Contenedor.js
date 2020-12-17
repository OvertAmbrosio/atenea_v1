import React from 'react'
import { Col, Row } from 'antd';

export default function Contenedor({children}) {
  const style_row = {
    margin: '0 24px 1rem',
    borderRadius: '.3rem'
    // minHeight: '68vh'
  };
  const style_col = {
    borderRadius: '.3rem',
    padding: '0 1rem',
    backgroundColor: '#fff',
    WebkitBoxShadow: '0px 0px 10px 0px rgba(0,0,0,0.03)',
    MozBoxShadow: '0px 0px 10px 0px rgba(0,0,0,0.03)',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.03)'
  };
  return (
    <Row style={style_row}>
      <Col span={24} style={style_col}>
      {children}
      </Col>
    </Row>
  )
}
