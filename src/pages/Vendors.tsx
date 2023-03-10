// @ts-ignore
import React, { ReactNode, useState } from 'react';
import { MenuProps } from 'antd';
import { Route, Routes, useLocation } from 'react-router-dom';
import ViewVendors from '../components/ViewVendors';
import ViewVendorContainer from '../components/ViewVendorContainer';
import VendorForm from '../components/CreateVendorForm';

export default function AppTest() {
  const [, setCurrent] = useState('view');
  const location = useLocation();
  console.log(location);
  // @ts-ignore
  const onClick: MenuProps['onClick'] = (e: any) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  // const breadcrumbNameMap: Record<string, string | ReactNode> = {
  //   '/vendors': (
  //     <div>
  //       <HomeOutlined height={10} /> Home
  //     </div>
  //   ),
  //   '/vendors/create': 'New Vendor',
  //   '/vendors/edit': 'View Vendor',
  // };

  // const pathSnippets = location.pathname
  //     .split('/')
  //     .filter((i) => i)
  //     .slice(0, 2);

  // const extraBreadcrumbItems = pathSnippets.map((_, index) => {
  //   const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
  //   return (
  //     <Breadcrumb.Item key={url}>
  //       <Link to={url}>{breadcrumbNameMap[url]}</Link>
  //     </Breadcrumb.Item>
  //   );
  // });

  return (
    <div>
      <Routes>
        <Route path='/' element={<ViewVendors />} />
        <Route path='/create' element={<VendorForm />} />
        <Route path='/edit/:uuid' element={<ViewVendorContainer />} />
      </Routes>
    </div>
  );
}
