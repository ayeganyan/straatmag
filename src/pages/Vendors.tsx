import React, { ReactNode, useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Breadcrumb, MenuProps } from 'antd';
import { Menu } from 'antd';
import { TeamOutlined, UserAddOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, Route, Routes, useLocation, useParams, redirect } from 'react-router-dom';
import CreateVendor from '../components/CreateVendorForm';
import ViewVendors from '../components/ViewVendors';
import ViewVendorContainer from '../components/ViewVendorContainer';
import VendorForm from '../components/CreateVendorForm';



export default function AppTest() {
  const [current, setCurrent] = useState('view');
  const location = useLocation();
  console.log(location);
  const onClick: MenuProps['onClick'] = (e: any) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const breadcrumbNameMap: Record<string, string | ReactNode> = {
    '/vendors': <div><HomeOutlined height={10}/> Home</div>,
    '/vendors/create': 'New Vendor',
    '/vendors/edit': 'View Vendor',
  };

  const pathSnippets = location.pathname.split('/').filter((i) => i).slice(0, 2);

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = extraBreadcrumbItems;

  return <div>
      {/* <Breadcrumb className='breadcrumb-container'>{breadcrumbItems}</Breadcrumb> */}
    <Routes>
      <Route path="/" element={<ViewVendors />} />
      <Route path="/create" element={<VendorForm />} />
      <Route path="/:uuid" element={<ViewVendorContainer />} />
    </Routes>
  </div>
};