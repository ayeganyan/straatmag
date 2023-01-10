import Layout, { Content, Header } from 'antd/es/layout/layout';
import React from 'react';
import 'antd/dist/reset.css';
import { Form, Input, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Typography } from 'antd';

const { Title } = Typography;


function CreateVendor() {
    return (
        <div className="createVendor">
                    <div>
                        {/* <Title level={3}>Create New Vendor</Title> */}

                        <CreateVendorsBlock />
                    </div>

        </div>
    )
}

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

function CreateVendorsBlock() {
    return (
        <Form {...layout} name="control-ref">
            <Form.Item name="firs" label="First Name" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="note1" label="Last Name" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="note2" label="Rfid" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="note3" label="Email" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
        </Form>
    )
}

export default CreateVendor;