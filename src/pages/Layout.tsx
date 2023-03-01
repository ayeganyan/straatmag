import Layout, { Content, Header } from 'antd/es/layout/layout';
import { Link, Outlet } from 'react-router-dom';
import { Breadcrumb, MenuProps, theme } from 'antd';
import { Menu } from 'antd';
import { TeamOutlined, UserAddOutlined, HomeOutlined } from '@ant-design/icons';
import { useState } from 'react';

const items: MenuProps['items'] = [
    {
        label: (<Link to={'/vendors'}>Vendors</Link>),
        key: 'view',
        icon: <TeamOutlined />,
    }
];
function AppLayout() {
    const [current, setCurrent] = useState('view');
    const onClick: MenuProps['onClick'] = (e: any) => {
      console.log('click ', e);
      setCurrent(e.key);
    };
    const {
        token: { colorBgContainer },
      } = theme.useToken();
    return (
        <Layout className='layout'>
            <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%'  }}  >
                <div className='logo' >
                    <img src='/Z_LogoAmStraatkrantRGB.png' />
                    <div className='logo-text'> Z-Krant</div>
                </div>
                <Menu theme='dark' defaultSelectedKeys={['view']} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />

            </Header>
            <Content >
                {/* TODO: add breadcrumbs linked to redux store */}
                <Outlet />
            </Content>
        </Layout>
    )
}

export default AppLayout