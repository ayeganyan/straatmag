// @ts-ignore
import React, { useState } from 'react';
import 'antd/dist/reset.css';
import { Button, Form, Input, notification, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

import vendors from '../db/vendors/vendors';
import { Vendor } from '../db/vendors/types';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function VendorFormContainer(props: any) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const onFormClose = () => {
    console.log('onFormClose called');
    navigate('/vendors');
  };

  const onFormSubmit = async () => {
    setLoading(true);
    console.log(form.getFieldsValue(true));
    const formValues = form.getFieldsValue(true);
    const result = await vendors.addVendor(formValues as Vendor);
    console.log(result);
    setLoading(false);
    api.info({
      message: 'Notification',
      description: `Vendor ${formValues.name} updated succesfully`,
      placement: 'topRight',
    });
    // navigate('/vendors')
  };

  return (
    <div className='createVendor'>
      {contextHolder}
      <div>
        <Spin indicator={antIcon} spinning={loading}>
          <CreateVendorsBlock
            form={form}
            vendorDetails={props.vendor}
            onFormClose={onFormClose}
            onFormSubmit={onFormSubmit}
          />
        </Spin>
      </div>
    </div>
  );
}

function CreateVendorsBlock(props: any) {
  const isNewVendor = !props?.vendorDetails?.uuid;

  const validateMessages = {
    required: '"${label}" is required!',
    // ...
  };
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  return (
    <div>
      <Form.Provider onFormFinish={(name, info) => console.log(name, info)}>
        <br />
        <Form
          className='vendor-form'
          {...layout}
          initialValues={props.vendorDetails}
          name='control-ref'
          validateMessages={validateMessages}
          onFinish={props.onFormSubmit}
          form={props.form}
          onAbort={props.onFormClose}
        >
          {/* <Form.Item name="title">
                        <Title level={4}>New Vendor</Title>
                    </Form.Item> */}
          <Form.Item name='name' label='Name' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='rfid' label='Rfid' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='email' label='Email' rules={[{ required: true }]}>
            <Input type='email' />
          </Form.Item>
          <Form.Item {...tailLayout}>
            {isNewVendor && (
              <>
                <Button type='default' htmlType='button' onClick={props.onFormClose}>
                  Cancel
                </Button>
                &nbsp; &nbsp;
              </>
            )}
            <Button type='primary' htmlType='submit'>
              {isNewVendor ? 'Create vendor' : 'Update vendor'}
            </Button>
          </Form.Item>
        </Form>
      </Form.Provider>
    </div>
  );
}

const VendorForm = VendorFormContainer;
export default VendorForm;
