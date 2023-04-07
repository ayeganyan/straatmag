// @ts-ignore
import React, { useEffect, useState } from 'react';
import 'antd/dist/reset.css';
import { Button, Col, Input, Row, Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import vendors from '../db/vendors/vendors';
import { LoadingOutlined, UserAddOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Vendor } from '../db/vendors/types';

const { Search } = Input;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function ViewVendors() {
  const [loading, setLoading] = useState<boolean>(false);
  const [vendorList, setVendorList] = useState<Array<Vendor>>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const allVendors = await vendors.getAllVendors();
      setVendorList(allVendors);
      setLoading(false);
      console.log('load complete');
    })();
  }, []);

  // @ts-ignore
  const getAllVendor = async () => {
    const result = await vendors.getAllVendors();
    console.log(result);
  };

  // let searchForVendor = async (searchTerm: string) => {
  //     setLoading(true)
  //     let result = await getVendorDocByName(searchTerm)
  //     console.log(result)
  //     //@ts-ignore
  //     setVendorList(result)
  //     setLoading(false)
  // }

  return (
    <div className='viewVendor'>
      <Spin indicator={antIcon} spinning={loading}>
        <div>
          {/* <Title level={3}>View Vendors</Title> */}

          <ViewVendorsTable
            // @ts-ignore
            vendors={vendorList}
          />

          {/* <button onClick={() => getAllVendor()} >test</button> */}
        </div>
      </Spin>
    </div>
  );
}

interface DataType {
  uuid: any;
  key: string;
  name: string;
  lastName: string;
  rfid: string;
  email: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <Link to={`/vendors/${record.uuid}`}>
        {record.name} {record.lastName}
      </Link>
    ),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'rfid',
    dataIndex: 'rfid',
    key: 'rfid',
  },
  {
    title: 'uuid',
    dataIndex: 'uuid',
    key: 'uuid',
  },
];

function ViewVendorsTable(props: {
  vendors: readonly DataType[] | undefined;
  searchForVendor: (searchTerm: string) => void;
}) {
  const navigate = useNavigate();

  return (
    <div className='vendor-list-table-container'>
      <Row className='vendor-list-table-action-panel'>
        <Col span={8}>
          <Search
            placeholder='input search text'
            allowClear
            enterButton
            size='middle'
            onSearch={(value) => console.log(value)}
          />
        </Col>
        <Col span={8} />
        <Col span={8} className='vendor-btns-container'>
          <Button
            onClick={() => navigate('/vendors/create')}
            type='primary'
            className='create-vendor-btn'
            icon={<UserAddOutlined />}
          >
            Add Vendor
          </Button>
        </Col>
      </Row>

      <Table rowKey={'uuid'} columns={columns} pagination={{ position: ['bottomRight'] }} dataSource={props.vendors} />
    </div>
  );
}

export default ViewVendors;
