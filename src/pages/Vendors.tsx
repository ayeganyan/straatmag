// @ts-ignore
import React, { ReactNode, useState } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import VendorForm from '../components/CreateVendorForm';
import ViewVendors from '../components/ViewVendors';
import ViewVendorContainer from '../components/ViewVendorContainer';

export default function AppTest() {
  const location = useLocation();
  console.log(location);
  const breadcrumbNameMap: Record<string, string | ReactNode> = {
    '/vendors': (
      <div>
        <HomeOutlined height={10} /> Home
      </div>
    ),
    '/vendors/create': 'New Vendor',
    '/vendors/edit': 'View Vendor',
  };

  const pathSnippets = location.pathname
    .split('/')
    .filter((i) => i)
    .slice(0, 2);

  // @ts-ignore
  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });

  return (
    <div>
      {/* <Breadcrumb className='breadcrumb-container'>{breadcrumbItems}</Breadcrumb> */}
      <Routes>
        <Route path='/' element={<ViewVendors />} />
        <Route path='/create' element={<VendorForm />} />
        <Route path='/:uuid' element={<ViewVendorContainer />} />
      </Routes>
    </div>
  );
}
