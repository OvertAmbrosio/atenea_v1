import { Table, Tag, Tooltip } from 'antd';
import Text from 'antd/lib/typography/Text';
import capitalizar from '../../libraries/capitalizar';

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
      className: 'columna-resumen-completado',
      render: (o) => <strong>{o ? o : 0}</strong> 
    },
    {
      title: 'Iniciado',
      dataIndex: 'iniciado',
      align: 'center',
      className: 'columna-resumen-iniciado',
      render: (e) => e ? e : 0
    },
    {
      title: 'No Realizada',
      dataIndex: 'no_realizada',
      align: 'center',
      render: (e) => e ? e : 0
    },
    {
      title: 'Pendiente',
      dataIndex: 'pendiente',
      align: 'center',
      render: (e) => e ? e : 0
    },
    {
      title: 'Suspendido',
      dataIndex: 'suspendido',
      align: 'center',
      render: (e) => e ? e : 0
    },
    {
      title: 'Cancelado',
      dataIndex: 'cancelado',
      align: 'center',
      render: (e) => e ? e : 0
    },
    {
      title: `Total / ${capitalizar(tipo)}`,
      dataIndex: 'total',
      align: 'center',
      render: (e) => e ? <strong>{e ? e : 0}</strong>  : 0
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
          <Text><strong>{totalC}</strong></Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell align="center">
          <Text>{totalI}</Text>
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
          <Text strong>{totalT}</Text>
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </>
  );
};

export function columnasTotalTcfl(pageData) {
  let totalPlazo = 0;
  let totalVencidas = 0;
  let totalAgendadas = 0;
  let totalTotal = 0;

  pageData.forEach(({ en_plazo, vencidas, agendadas, total }) => {
    totalPlazo += en_plazo.length;
    totalVencidas += vencidas.length;
    totalAgendadas +=agendadas.length;
    totalTotal += total.length;
  });

  let pTotal =  Math.round((totalPlazo*100) / (totalPlazo + totalVencidas) )

  return (
    <>
      <Table.Summary.Row style={{ backgroundColor: "#F7F7F7" }}>
        <Table.Summary.Cell><strong>Total</strong></Table.Summary.Cell>
        <Table.Summary.Cell align="center">
          <Text>{totalPlazo}</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell align="center">
          <Text>{totalVencidas}</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell align="center">
          <Text>{pTotal < 80 && pTotal > 50 ? 
                  <Tag color="warning">{pTotal} %</Tag> : pTotal <= 50 ? 
                  <Tag color="error">{pTotal} %</Tag> : pTotal >= 80 ? 
                  <Tag color="success">{pTotal} %</Tag> : <Tag>0 %</Tag>}</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell align="center">
          <Text>{totalAgendadas}</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell align="center">
          <Text>{totalTotal}</Text>
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </>
  );
};