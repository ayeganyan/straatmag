import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { TeamOutlined, UserAddOutlined } from '@ant-design/icons';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import CreateVendor from '../components/CreateVendorForm';
import ViewVendors from '../components/ViewVendors';

const items: MenuProps['items'] = [
  {
    label:( <Link to={'view'}>View</Link>),
    key: 'view',
    icon: <TeamOutlined />,
  },
  {
    label: ( <Link to={'create'}>Create</Link>),
    key: 'create',
    icon: <UserAddOutlined />,
  }
];

export default function AppTest()  {
  const [current, setCurrent] = useState('view');
  const location = useLocation();
  console.log(location);
  const onClick: MenuProps['onClick'] = (e: any) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return <div>
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      <Routes>
            <Route path="/view" element={<ViewVendors/>} />
            <Route path="/create" element={<CreateVendor/>}  />
      </Routes>
    </div>
};