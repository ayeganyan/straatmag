import Layout, { Content, Header } from 'antd/es/layout/layout';
import React from 'react';
import 'antd/dist/reset.css';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Typography } from 'antd';
import { addVendor, getVendor } from '../db/vendor'

const { Title } = Typography;

function ViewVendors() {
    let handleClick = async () => {
        let result = await addVendor({
            name: 'string',
            lastName: 'string',
            rfid: 'string',
            email: 'test@gmail.com'
        })
        console.log(result)
        let r2 = await getVendor("")
        console.log(r2)
    }
    return (
        <div className="viewVendor">

            <div >
                {/* <Title level={3}>View Vendors</Title> */}
                <ViewVendorsTable />
                <button onClick={() => handleClick()} >test</button>
            </div>
        </div>
    )
}

interface DataType {
    key: string
    name: string
    lastName: string
    rfid: string
    email: string,
    tags: string[]
}

const columns: ColumnsType<DataType> = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
    },
    {
        title: 'email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: (_, { tags }) => (
            <>
                {tags.map((tag) => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (tag === 'Inactive') {
                        color = 'volcano';
                    }
                    return (
                        <Tag color={color} key={tag}>

                            {
                                tag.toUpperCase()
                            }
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (_: any, record: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) => (
            <Space size="middle">
                <a>Edit</a>
                <a>Delete</a>
            </Space>
        ),
    },
];

const data: DataType[] = [
    {
        key: '1',
        name: 'John',
        lastName: 'Brown',
        rfid: '21',
        email: 'john.brown@gmail.com',
        tags: ['Active'],
    },
    {
        key: '2',
        name: 'Jim',
        lastName: 'Green',
        rfid: '42',
        email: 'jim.green@gmail.com',
        tags: ['Active'],
    },
    {
        key: '3',
        name: 'Joe',
        lastName: 'Black',
        rfid: '32',
        email: 'jow.black@gmail.com',
        tags: ['Inactive'],
    },
];

function ViewVendorsTable() {
    return (
        <Table columns={columns} dataSource={data} />
    )
}

export default ViewVendors