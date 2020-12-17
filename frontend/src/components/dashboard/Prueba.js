import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Prueba extends Component {
  static propTypes = {
    prop: PropTypes
  }

  render() {
    console.log('holas')
    return (
      <div>
        hola
      </div>
    )
  }
}
