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
            ruta: rutas.indicadoresGpon,
            icon: DashboardOutlined,
            titulo: 'Indicadores GPON'
          },
          {
            ruta: rutas.indicadoresHfc,
            icon: DashboardOutlined,
            titulo: 'Indicadores HFC'
          },
          {
            ruta: rutas.resumenTcfl,
            icon: DashboardOutlined,
            titulo: 'Resumen TCFL'
          },
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
            <Link to={rutas.indicadoresGpon}>
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
  // return (
  //   <Menu theme="light" mode="inline" defaultSelectedKeys={getPath()}>
  //     <ItemGroup title='Panel de Control'>
  //       <Divider/>
  //       <Item key="dashboard">
  //         <Link to={rutas.indicadoresGpon}>
  //         <DashboardOutlined />
  //         <span>Dashboard</span>
  //         </Link>
  //       </Item>
  //     </ItemGroup>
  //     <ItemGroup title='Usuarios y Personal'>
  //       <Divider/>
  //       <Item key="lista-personal" style={{ display: !permisos.listaPersonal.includes(cargo) && 'none' }}>
  //         <Link to={rutas.listaPersonal}>
  //           <TeamOutlined />
  //           <span>Lista de Personal</span>
  //         </Link>
  //       </Item>
  //       <Item key="lista-contratas" style={{ display: !permisos.listaContratas.includes(cargo) && 'none' }}>
  //         <Link to={rutas.listaContratas}>
  //           <IdcardOutlined />
  //           <span>Lista de Contratas</span>
  //         </Link>
  //       </Item>
  //     </ItemGroup>
  //     <ItemGroup title='Operativa'>
  //       <Divider/>
  //       <SubMenu //ACTUALIZAR
  //         key="sub3"
  //         title={
  //           <span>
  //             <CloudUploadOutlined />
  //             <span>Actualizar Ordenes</span>
  //           </span>
  //         }
  //       >
  //         <Item key="actualizar-averiashfc">
  //           <Link to='/actualizar-averiashfc'>
  //             <CloudUploadOutlined />
  //               Actualizar Averias HFC
  //           </Link>
  //         </Item>
  //         <Item key="actualizar-altashfc">
  //           <Link to='/actualizar-altashfc'>
  //             <CloudUploadOutlined />
  //             Actualizar Altas HFC
  //           </Link>
  //         </Item>
  //         <Item key="actualizar-basicas">
  //           <Link to='/actualizar-basicas'>
  //             <CloudUploadOutlined />
  //             Actualizar Básicas
  //           </Link>
  //         </Item>
  //         <Item key="actualizar-speedy">
  //          <Link to='/actualizar-speedy'>
  //             <CloudUploadOutlined />
  //             Actualizar Speedy
  //           </Link>
  //         </Item>
  //       </SubMenu>
  //       <SubMenu //ASIGNAR
  //         key="sub4"
  //         title={
  //           <span>
  //             <FileSearchOutlined />
  //             <span>Asignar Ordenes</span>
  //           </span>
  //         }
  //       >
  //         <Item key="asignar-averiashfc">
  //           <Link to='/asignar-averiashfc'>
  //             <FileSearchOutlined />
  //             Asignar Averias HFC
  //           </Link>
  //         </Item>
  //         <Item key="asignar-altashfc">
  //           <Link to='/asignar-altashfc'>
  //             <FileSearchOutlined />
  //             Asignar Altas HFC
  //           </Link>
  //         </Item>
  //         <Item key="asignar-basicas">
  //           <Link to='/asignar-basicas'>
  //             <FileSearchOutlined />
  //             Asignar Básicas
  //           </Link>
  //         </Item>
  //         <Item key="asignar-speedy">
  //           <Link to='/asignar-speedy'>
  //             <FileSearchOutlined />
  //             Asignar Speedy
  //           </Link>
  //         </Item>
  //       </SubMenu>
  //       <SubMenu //GESTION
  //         key="sub5"
  //         title={
  //           <span>
  //             <ScheduleOutlined />
  //             <span>Gestionar Ordenes</span>
  //           </span>
  //         }
  //       >
  //         <Item key="gestionar-averiashfc">
  //           <Link to='/gestionar-averiashfc'>
  //             <ScheduleOutlined />
  //             Gestionar Averias HFC
  //           </Link>
  //         </Item>
  //         <Item key="gestionar-altashfc">
  //           <Link to='/gestionar-altashfc'>
  //             <ScheduleOutlined />
  //             Gestionar Altas HFC
  //           </Link>
  //         </Item>
  //         <Item key="gestionar-basicas">
  //           <Link to='/gestionar-basicas'>
  //             <ScheduleOutlined />
  //             Gestionar Básicas
  //           </Link>
  //         </Item>
  //         <Item key="gestionar-speedy">
  //           <Link to='/gestionar-speedy'>
  //             <ScheduleOutlined />
  //             Gestionar Speedy
  //           </Link>
  //         </Item>
  //       </SubMenu>
  //       <Item key="produccion">
  //         <Link to='/produccion'>
  //           <BarChartOutlined />
  //           <span>Producción</span>
  //         </Link>
  //       </Item>
  //       <Item key="registro-historico">
  //         <Link to='/registro-historico'>
  //           <HistoryOutlined />
  //           <span>Registro Historico</span>
  //         </Link>
  //       </Item>
  //     </ItemGroup>
      // {/* <ItemGroup title='Logística'>
      //   <Divider/>
      //   <Item key="gestion-articulos">
      //     <Link to='/gestion-articulos'>
      //       <SlidersOutlined />
      //       <span>Gestion de Articulos</span>
      //     </Link>
      //   </Item>
      //   <SubMenu
      //     key="sub6"
      //     title={
      //       <span>
      //         <GroupOutlined />
      //         <span>Almacen Central</span>
      //       </span>
      //     }
      //   >
      //     <Item key="entrada-almacen-central">
      //       <Link to='/entrada-almacen-central'>
      //         <ImportOutlined />
      //         <span>Entrada Inventario</span>
      //       </Link>
      //     </Item>
      //     <Item key="salida-almacen-central">
      //       <Link to='/salida-almacen-central'>
      //         <ExportOutlined />
      //         <span>Salida Inventario</span>
      //       </Link> 
      //     </Item>
      //     <Item key="equipos-detalle-central">
      //       <Link to='/equipos-detalle-central'>
      //         <FieldTimeOutlined />
      //         <span>Equipos Detalle</span>
      //       </Link>
      //     </Item>
      //     <Item key="ferreteria-detalle-central">
      //       <Link to='/ferreteria-detalle-central'>
      //         <ShopOutlined />
      //         <span>Ferreteria Detalle</span>
      //       </Link>
      //     </Item>
      //   </SubMenu>
      //   <SubMenu
      //     key="sub7"
      //     title={
      //       <span>
      //         <GoldOutlined />
      //         <span>Almacen Primario</span>
      //       </span>
      //     }
      //   >
      //     <Item key="entrada-almacen-primario">
      //       <Link to='/entrada-almacen-primario'>
      //         <ImportOutlined />
      //         Entrada Inventario
      //       </Link>
      //     </Item>
      //     <Item key="salida-almacen-primario">
      //       <Link to='/salida-almacen-primario'>
      //         <ExportOutlined />
      //         Salida Inventario
      //       </Link>
      //     </Item>
      //     <Item key="equipos-detalle-primario">
      //       <Link to='/equipos-detalle-primario'>
      //         <FieldTimeOutlined />
      //         <span>Equipos Detalle</span>
      //       </Link>
      //     </Item>
      //   </SubMenu>
      //   <SubMenu
      //     key="sub8"
      //     title={
      //       <span>
      //         <CloudServerOutlined />
      //         <span>Almacen Secundario</span>
      //       </span>
      //     }
      //   >
      //     <Item key="lista-almacen-secundario">
      //       <Link to='/lista-almacen-secundario'>
      //         <TableOutlined />
      //         Lista
      //       </Link>
      //     </Item>
      //     <Item key="salida-almacen-secundario">
      //       <Link to='/salida-almacen-secundario'>
      //         <ExportOutlined />
      //         Salida Inventario
      //       </Link>
      //     </Item>
      //   </SubMenu>
      //   <Item key="buscar-serie">
      //     <Link to='/buscar-serie'>
      //       <SearchOutlined />
      //       <span>Buscar Serie</span>
      //     </Link>
      //   </Item>
      // </ItemGroup> */}
    // </Menu>
  // )
};

MenuUsuario.propTypes = {
  cargo: PropTypes.number
}

export default MenuUsuario;
