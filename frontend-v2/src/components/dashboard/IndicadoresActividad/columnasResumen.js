import { CheckCircleOutlined, FieldTimeOutlined, IssuesCloseOutlined } from '@ant-design/icons';
import { Table, Tag, Tooltip } from 'antd';
import Text from 'antd/lib/typography/Text';
import capitalizar from '../../../libraries/capitalizar';

export function columnasResumen(tipo) {
  return [
    {
      title: capitalizar(tipo),
      dataIndex: tipo,
      ellipsis: {
        showTitle: false,
      },
      width: 200,
      align: 'left',
      render: (t) => (
        <Tooltip placement="topLeft" title={t}>{t}</Tooltip>
      )
    },
    {
      title: 'Completado',
      dataIndex: 'completado',
      align: 'center',
      sorter: (a, b) => {
        if (a.completado < b.completado) {
          return -1;
        }
        if (a.completado > b.completado) {
          return 1;
        }
        return 0;
      },
      // className: 'columna-resumen-completado',
      render: (o) => <Tag icon={<CheckCircleOutlined />} color="#8994e9">{o ? o : 0}</Tag> 
    },
    {
      title: 'Iniciado',
      dataIndex: 'iniciado',
      align: 'center',
      sorter: (a, b) => {
        if (a.iniciado < b.iniciado) {
          return -1;
        }
        if (a.iniciado > b.iniciado) {
          return 1;
        }
        return 0;
      },
      // className: 'columna-resumen-iniciado',
      render: (o) => <Tag icon={<IssuesCloseOutlined />} color="#66CC33">{o ? o : 0}</Tag> 
    },
    {
      title: 'No Realizada',
      dataIndex: 'no_realizada',
      align: 'center',
      sorter: (a, b) => {
        if (a.no_realizada < b.no_realizada) {
          return -1;
        }
        if (a.no_realizada > b.no_realizada) {
          return 1;
        }
        return 0;
      },
      render: (e) => e ? e : 0
    },
    {
      title: 'Pendiente',
      dataIndex: 'pendiente',
      align: 'center',
      sorter: (a, b) => {
        if (a.pendiente < b.pendiente) {
          return -1;
        }
        if (a.pendiente > b.pendiente) {
          return 1;
        }
        return 0;
      },
      render: (e) => e ? e : 0
    },
    {
      title: 'Suspendido',
      dataIndex: 'suspendido',
      align: 'center',
      sorter: (a, b) => {
        if (a.suspendido < b.suspendido) {
          return -1;
        }
        if (a.suspendido > b.suspendido) {
          return 1;
        }
        return 0;
      },
      render: (e) => e ? e : 0
    },
    {
      title: 'Cancelado',
      dataIndex: 'cancelado',
      align: 'center',
      sorter: (a, b) => {
        if (a.cancelado < b.cancelado) {
          return -1;
        }
        if (a.cancelado > b.cancelado) {
          return 1;
        }
        return 0;
      },
      render: (e) => e ? e : 0
    },
    {
      title: `Total`,
      dataIndex: 'total',
      align: 'center',
      sorter: (a, b) => {
        if (a.total < b.total) {
          return -1;
        }
        if (a.total > b.total) {
          return 1;
        }
        return 0;
      },
      render: (e) => e ? <Tag color="#999999"><strong>{e ? e : 0}</strong></Tag>  : 0
    },
  ]
};

export function columnasTotal(pageData) {
  let totalC = 0;
  let totalI = 0;
  let totalN = 0;
  let totalP = 0;
  let totalS = 0;
  let totalCan = 0;
  let totalT = 0;

  pageData.forEach(({ completado, iniciado, no_realizada, pendiente, suspendido, cancelado, total }) => {
    totalC += completado;
    totalI += iniciado;
    totalN += no_realizada;
    totalP += pendiente;
    totalS += suspendido;
    totalCan += cancelado;
    totalT += total;
  });

  return (
    <>
      <Table.Summary.Row style={{ backgroundColor: "#F7F7F7" }}>
        <Table.Summary.Cell><strong>Total</strong></Table.Summary.Cell>
        <Table.Summary.Cell align="center">
          <Tag icon={<CheckCircleOutlined />} color="#8994e9"><strong>{totalC}</strong></Tag> 
        </Table.Summary.Cell>
        <Table.Summary.Cell align="center">
          <Tag icon={<FieldTimeOutlined />} color="#66CC33">{totalI}</Tag> 
          {/* <Text>{totalI}</Text> */}
        </Table.Summary.Cell>
        <Table.Summary.Cell align="center">
          <Text>{totalN}</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell align="center">
          <Text>{totalP}</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell align="center">
          <Text>{totalS}</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell align="center">
          <Text>{totalCan}</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell align="center">
          <Tag color="#999999"><strong>{totalT}</strong></Tag>
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </>
  );
};
