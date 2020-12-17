import React, { useState } from 'react';
import { Popover, Badge, List } from 'antd';
import { BellOutlined, RightOutlined } from '@ant-design/icons';

// import StateIcon from '../../common/StateIcon'

const notifications = [{title:'Hola', icon: 'success'},{title:'Hola', icon: 'error'}, {title:'Hola', icon: 'warning'}];

const Notificaciones = () => {
  const [visible, setVisible] = useState(false);

  return (
    <Popover
      trigger="click"
      placement="bottomRight"
      overlayClassName="notification-popover"
      visible={visible}
      onVisibleChange={(v) => setVisible(v)}
      content={
        <div className="caja-notificaciones" style={{ minWidth: '20rem' }}>
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            locale={{
              emptyText: <span>You have viewed all notifications.</span>,
            }}
            renderItem={item => (
              <List.Item className="item-notificaciones">
                {/* <StateIcon 
                  estado={item.icon} 
                  style={{fontSize: '2rem', paddingRight: '.8rem'}}
                /> */}
                <List.Item.Meta
                  className="datos-notificaciones"                
                  title={
                    <span lines={1}>
                      Orden Actualizada
                    </span>
                  }
                  description="hola k tal como te va"
                />
                <RightOutlined className="flecha-notificaciones"/>
              </List.Item>
            )}
          />
          {notifications.length ? (
            <div
              // onClick={onAllNotificationsRead}
              className="clear-button"
            >
              <span>Limpiar Notificaciones</span>
            </div>
          ) : null}
        </div>
      }
    >
       <Badge
        count={0}//numero de notificaciones
        dot
        offset={[-10, 10]}
        className="icon-button"
      >
        <BellOutlined className="icon-font"/>
      </Badge>
    </Popover>
  )
};

export default Notificaciones;
