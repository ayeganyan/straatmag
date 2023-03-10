// @ts-ignore
import React, { useEffect, useState } from 'react';
import 'antd/dist/reset.css';
import { Button, Col, Row, Spin, Table, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getAllVendors, Vendor } from '../db/vendor';
import { UserAddOutlined, LoadingOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Search } = Input;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function ViewVendors() {
  const [loading, setLoading] = useState<boolean>(false);
  const [vendorList, setVendorList] = useState<Array<Vendor>>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const allVendors = await getAllVendors();
      setVendorList(allVendors);
      setLoading(false);
      console.log('load complete');
    })();
  }, []);
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
      <Link to={`/vendors/edit/${record.uuid}`}>
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

function ViewVendorsTable(props: { vendors: readonly DataType[] | undefined }) {
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
            onSearch={() => {
              console.log('test');
            }}
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
