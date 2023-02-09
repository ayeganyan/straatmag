import Layout, { Content, Header } from 'antd/es/layout/layout';
import React, { useState } from 'react';
import 'antd/dist/reset.css';
import { Button, Form, Input, Modal, notification, Space, Spin, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserAddOutlined, LoadingOutlined } from '@ant-design/icons';

import { addVendor } from '../db/vendor';

const { Title } = Typography;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


function CreateVendor(props: any) {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [api, contextHolder] = notification.useNotification();



    let onFormClose = () => {
        console.log('onFormClose called')
        navigate('/vendors')
    }

    let onFormSubmit = async () => {
        setLoading(true);
        console.log(form.getFieldsValue(true))
        const formValues = form.getFieldsValue(true)
        let result = await addVendor(formValues)
        console.log(result)
        setLoading(false);
        api.info({
            message: `Notification`,
            description: `Vendor ${formValues.name} created succesfully`,
            placement: 'topRight'
        });
        navigate('/vendors')
    }

    return (
        <div className="createVendor">
            <div>

                <Spin indicator={antIcon} spinning={loading}>
                    <CreateVendorsBlock form={form} onFormClose={onFormClose} onFormSubmit={onFormSubmit} />
                </Spin>
            </div>

        </div>
    )
}

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

function CreateVendorsBlock(props: any) {
    const validateMessages = {
        required: "'${label}' is required!",
        // ...
    }
    return (
        <div>
            <Form.Provider onFormFinish={(name, info) => console.log(name, info)}>
                <br/>
                <Form className='vendor-form' {...layout} name="control-ref" validateMessages={validateMessages} onFinish={props.onFormSubmit} form={props.form} onAbort={props.onFormClose}>
                    <Form.Item name="title">
                        <Title level={4}>New Vendor</Title>
                    </Form.Item>
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="rfid" label="Rfid" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                        <Input type='email' />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type='default' htmlType="button" onClick={props.onFormClose}>
                            Cancel
                        </Button>
                        &nbsp; &nbsp;
                        <Button type="primary" htmlType="submit">
                            Create vendor
                        </Button>
                    </Form.Item>
                </Form>
            </Form.Provider>
        </div >

    )
}

export default CreateVendor;