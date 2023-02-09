import Layout, { Content, Header } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';

function AppLayout() {
    return (
        <Layout className='layout'>
            <Header style={{ color: "white" }}>
                <div className='logo' >
                    <img src='/Z_LogoAmStraatkrantRGB.png' />
                    <div className='logo-text'> Z-Krant Admin</div>
                </div>
            </Header>
            <Content >
                {/* TODO: add breadcrumbs linked to redux store */}
                <Outlet />
            </Content>
        </Layout>
    )
}

export default AppLayout