import Layout, { Content, Header } from 'antd/es/layout/layout';
import { Link, Outlet } from 'react-router-dom';
import { Menu, MenuProps } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { useState } from 'react';

const items: MenuProps['items'] = [
  {
    label: <Link to={'/vendors'}>Vendors</Link>,
    key: 'view',
    icon: <TeamOutlined />,
  },
];
function AppLayout() {
  const [current, setCurrent] = useState('view');
  const onClick: MenuProps['onClick'] = (e: any) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return (
    <Layout className='layout'>
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
        <div className='logo'>
          <img src='/Z_LogoAmStraatkrantRGB.png' />
          <div className='logo-text'> Z-Krant</div>
        </div>
        <Menu
          theme='dark'
          defaultSelectedKeys={['view']}
          onClick={onClick}
          selectedKeys={[current]}
          mode='horizontal'
          items={items}
        />
      </Header>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default AppLayout;
