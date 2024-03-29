import { useEffect, useState } from 'react';
import 'antd/dist/reset.css';
import { Skeleton, Tabs, TabsProps } from 'antd';
import { redirect, useParams } from 'react-router-dom';

import vendors from '../db/vendors/vendors';
import VendorForm from './CreateVendorForm';
import Transactions from './Transactions';
import { Vendor } from '../db/vendors/types';

function ViewVendorContainer() {
  const { uuid } = useParams();
  const [loading, setLoading] = useState(true);
  const [vendorDetails, setVendorDetails] = useState<Vendor>();

  useEffect(() => {
    (async () => {
      const vendor = await vendors.getVendorById(uuid || '');
      if (!vendor) {
        // redirect to /vendor
        redirect('/vendors');
      } else {
        setVendorDetails(vendor);
        setLoading(false);
      }
    })();
  }, []);

  const onTabChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Transactions',
      children: <Transactions vendor={vendorDetails} />,
    },
    {
      key: '2',
      label: 'Details',
      children: <VendorForm vendor={vendorDetails} />,
    },
  ];

  return (
    <div className='vendor-view-container'>
      {loading && <Skeleton active />}
      {!loading && (
        <div>
          <h2>{vendorDetails?.name}</h2>
          <h4>RFID: {vendorDetails?.rfid}</h4>
          <Tabs defaultActiveKey='1' items={items} onChange={onTabChange} />
        </div>
      )}
    </div>
  );
}

export default ViewVendorContainer;
