import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  DashboardOutlined,
  ScheduleOutlined,
  TeamOutlined,
  IdcardOutlined,
  CarryOutOutlined,
  FileSearchOutlined,
  // HistoryOutlined,
  // GroupOutlined,
  // ExportOutlined,
  // ImportOutlined,
  // CloudServerOutlined,
  // GoldOutlined,
  // SlidersOutlined,
  // TableOutlined,
  // SearchOutlined,
  // FieldTimeOutlined,
  // ShopOutlined,
  // BarChartOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';

import { rutas, permisos } from '../../../constants/listaRutas';

const { SubMenu, Item, Divider, ItemGroup } = Menu;

const getPath = () => {return String(window.location.pathname).substring(1)};

const items = [
  {
    permisos: [...permisos.todos, 9],
    titulo: 'Panel de Control',
    children: [
      {
        grupo: true,
        key: 'sub100',
        icon: DashboardOutlined,
        titulo: 'Dashboard',
        permisos: permisos.todos,
        children: [
          {
            ruta: rutas.resumenGeneral,
            icon: DashboardOutlined,
            titulo: 'Resumen General'
          }
        ]
      }
    ]
  },
  {
    permisos: permisos.todos,
    titulo: 'Usuarios y Contratas',
    children: [
      {
        grupo: false,
        ruta: rutas.listaPersonal,
        icon: TeamOutlined,
        permisos: permisos.todos,
        titulo: 'Lista de Personal'
      },
      {
        grupo: false,
        ruta: rutas.listaContratas,
        icon: IdcardOutlined,
        permisos: permisos.listaContratas,
        titulo: 'Lista de Contratas'
      }
    ]
  },
  {
    permisos: permisos.grupoOperativa,
    titulo: 'Operativa',
    children: [
      {
        grupo: true,
        key: 'listaRutas',
        icon: CarryOutOutlined,
        titulo: 'Lista Rutas',
        permisos: permisos.administrarOrdenes,
        children: [
          {
            ruta: rutas.asignarRutas,
            icon: CarryOutOutlined,
            titulo: 'Asignar Rutas'
          },
          {
            ruta: rutas.listaAsistencia,
            icon: CarryOutOutlined,
            titulo: 'Asistencias'
          }
        ]
      },
      {
        grupo: false,
        ruta: rutas.gestionarAsistencia,
        icon: CarryOutOutlined,
        permisos: permisos.gestion,
        titulo: 'Asistencia'
      },
      {
        grupo: true,
        key: 'sub98',
        icon: FileSearchOutlined,
        titulo: 'Administrar ordenes',
        permisos: permisos.administrarOrdenes,
        children: [
          {
            ruta: rutas.adminAveriasHfc,
            icon: FileSearchOutlined,
            titulo: 'Averias Hfc'
          },
          {
            ruta: rutas.adminAltasHfc,
            icon: FileSearchOutlined,
            titulo: 'Altas Hfc'
          },
          {
            ruta: rutas.adminBasicas,
            icon: FileSearchOutlined,
            titulo: 'Basicas'
          },
          {
            ruta: rutas.adminspeedy,
            icon: FileSearchOutlined,
            titulo: 'Speedy'
          }
        ]
      },
      {
        grupo: true,
        key: 'sub97',
        icon: ScheduleOutlined,
        titulo: 'Gestionar ordenes',
        permisos: permisos.gestion,
        children: [
          {
            ruta: rutas.gestionarListaOrdenes,
            icon: ScheduleOutlined,
            titulo: 'Lista de Ordenes'
          },
          {
            ruta: rutas.gestionarLiquidarOrdenes,
            icon: ScheduleOutlined,
            titulo: 'Liquidar Orden'
          },
        ]
      }
    ]
  }
]

// eslint-disable-next-line
function MenuUsuario({cargo}) {
  if (!cargo) {
    return (
      <Menu theme="light" mode="inline" defaultSelectedKeys={getPath()}>
        <ItemGroup title='Panel de Control'>
          <Divider/>
          <Item key="dashboard">
            <Link to={rutas.resumenGeneral}>
            <DashboardOutlined />
            <span>Dashboard</span>
            </Link>
          </Item>
        </ItemGroup>
      </Menu>
    )
  } else {
    return (
      <Menu theme="light" mode="inline" defaultSelectedKeys={getPath()}>
      {
        items.map((e,i) =>(
          e.permisos.includes(cargo) ?
          (<ItemGroup title={e.titulo} key={i}>
            <Divider/>
            {e.children.map((c) => (
                !c.grupo && c.permisos.includes(cargo) ?
                (<Item key={String(c.ruta).substring(1)}>
                  <Link to={c.ruta}>
                    <c.icon/>
                    <span>{c.titulo}</span>
                  </Link>
                </Item>)
                :
                c.grupo && c.permisos.includes(cargo) ?
                (<SubMenu 
                  key={c.key}
                  title={
                    <span>
                      <c.icon/>
                      <span>{c.titulo}</span>
                    </span>
                  }
                >
                  {c.children.map((sub) => (
                    <Item key={String(sub.ruta).substring(1)}>
                      <Link to={sub.ruta}>
                        <sub.icon/>
                        <span>{sub.titulo}</span>
                      </Link>
                    </Item>
                  ))}
                </SubMenu>):null
            ))}
          </ItemGroup>):null  
        ))
      }
      </Menu>
    )
  };
};

MenuUsuario.propTypes = {
  cargo: PropTypes.number
}

export default MenuUsuario;
