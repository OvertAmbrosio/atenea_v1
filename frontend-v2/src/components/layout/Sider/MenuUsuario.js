import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  DashboardOutlined,
  ScheduleOutlined,
  TeamOutlined,
  IdcardOutlined,
  CarryOutOutlined,
  FileSearchOutlined,
  CoffeeOutlined,
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

import { rutas } from '../../../constants/listaRutas';
import UserContext from '../../../context/User/UserContext';

const { SubMenu, Item, Divider, ItemGroup } = Menu;

const getPath = () => {return String(window.location.pathname).substring(1)};

const items = [
  {
    titulo: "Panel de Control",
    rutas: [rutas.resumenGeneral],
    children: [
      {
        grupo: true,
        key: 'sub100',
        icon: DashboardOutlined,
        titulo: 'Dashboard',
        rutas: [rutas.resumenGeneral],
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
    titulo: "Configuracion del Sistema",
    rutas: [rutas.areas,rutas.cargos,rutas.tipoEmpleados,rutas.vistas,rutas.zonas],
    children: [
      {
        grupo: true,
        key: rutas.areas,
        icon: CoffeeOutlined,
        titulo: "Configuracion Empleados",
        rutas: [rutas.areas,rutas.cargos,rutas.tipoEmpleados,rutas.vistas,rutas.zonas],
        children: [
          {
            ruta: rutas.areas,
            icon: CoffeeOutlined,
            titulo: 'Areas'
          },
          {
            ruta: rutas.cargos,
            icon: CoffeeOutlined,
            titulo: 'Cargos'
          },
          {
            ruta: rutas.tipoEmpleados,
            icon: CoffeeOutlined,
            titulo: 'Tipo Empleados'
          },
          {
            ruta: rutas.vistas,
            icon: CoffeeOutlined,
            titulo: 'Vistas'
          },
          {
            ruta: rutas.zonas,
            icon: CoffeeOutlined,
            titulo: 'Zonas'
          }
        ]
      }
    ]
  },
  {
    titulo: "Rescursos Humanos",
    rutas: [rutas.listaPersonal, rutas.listaContratas],
    children: [
      {
        grupo: false,
        ruta: rutas.listaPersonal,
        icon: TeamOutlined,
        titulo: 'Lista de Personal'
      },
      {
        grupo: false,
        ruta: rutas.listaContratas,
        icon: IdcardOutlined,
        titulo: 'Lista de Contratas'
      }
    ]
  },
  {
    titulo: 'Instalaciones y Mantenimiento',
    rutas: [
      rutas.asignarRutas,
      rutas.listaAsistencia,
      rutas.gestionarAsistencia,
      rutas.adminAveriasHfc,
      rutas.adminAltasHfc,
      rutas.adminBasicas,
      rutas.adminSpeedy,
      rutas.gestionarListaOrdenes,
      rutas.gestionarLiquidarOrdenes
    ],
    children: [
      {
        grupo: true,
        key: 'listaRutas',
        icon: CarryOutOutlined,
        titulo: 'Lista Rutas',
        rutas: [rutas.asignarRutas, rutas.listaAsistencia],
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
        titulo: 'Asistencia'
      },
      {
        grupo: true,
        key: 'Administrar ordenes',
        icon: FileSearchOutlined,
        titulo: 'Administrar ordenes',
        rutas: [rutas.adminAveriasHfc,rutas.adminAltasHfc,rutas.adminBasicas,rutas.adminSpeedy],
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
            ruta: rutas.adminSpeedy,
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
        rutas: [rutas.gestionarListaOrdenes,rutas.gestionarLiquidarOrdenes],
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
];

// eslint-disable-next-line
function MenuUsuario() {
  const { views } = useContext(UserContext);

  if (!views) {
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
          e.rutas && e.rutas.some((e) => views.includes(e)) ?
          (<ItemGroup title={e.titulo} key={i}>
            <Divider/>
            {e.children.map((c) => (
                !c.grupo && views.includes(c.ruta) ?
                (<Item key={String(c.ruta).substring(1)}>
                  <Link to={c.ruta}>
                    <c.icon/>
                    <span>{c.titulo}</span>
                  </Link>
                </Item>)
                :
                c.grupo && c.rutas && c.rutas.some((e) => views.includes(e)) ?
                (<SubMenu 
                  key={c.key}
                  title={
                    <span>
                      <c.icon/>
                      <span>{c.titulo}</span>
                    </span>
                  }
                >
                  {c.children.map((sub) => {
                    if (views.includes(sub.ruta)) {
                      return (<Item key={String(sub.ruta).substring(1)}>
                        <Link to={sub.ruta}>
                          <sub.icon/>
                          <span>{sub.titulo}</span>
                        </Link>
                      </Item>)
                    } else {
                      return null;
                    }
                  })}
                </SubMenu>):null
            ))}
          </ItemGroup>):null  
        ))
      }
      </Menu>
    )
  };
};

export default MenuUsuario;
