import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Modal, Select } from 'antd'

const { Option } = Select;

function ModalBucket({visible, abrir, buckets=[]}) {
  const [bucketSeleccionado, setBucketSeleccionado] = useState(null);

  return (
    <Modal
      title="Editar Bucket"
      width={400}
      visible={visible}
      onCancel={abrir}
      destroyOnClose
      centered
    >
      <Select
        placeholder="Seleccionar bucket"
        style={{ width: 300 }}
        onChange={(e) => setBucketSeleccionado(e)}
        defaultValue={bucketSeleccionado}
      >
      {
        buckets && buckets.length > 0 ? 
        buckets.map((b, i) => (
          <Option value={b.value} key={i}>{b.text}</Option>
        ))
        :
        <Option>Sin data</Option>
      }
      </Select>
    </Modal>
  )
}

ModalBucket.propTypes = {
  visible: PropTypes.bool,
  abrir: PropTypes.func,
  buckets: PropTypes.array
}

export default ModalBucket

