import Layout, { Content, Header } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';

function AppLayout() {
    return (
        <Layout>
            <Header style={{ color: "white" }}>Z-Krant</Header>
            <Content >
                {/* TODO: add breadcrumbs linked to redux store */}
                <Outlet/>
            </Content>
        </Layout>
    )
}

export default AppLayout