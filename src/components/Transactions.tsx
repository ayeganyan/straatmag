import React from "react";
import { Button, Col, Drawer, Form, Input, notification, Radio, Row, Spin, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { RecordType, TransactionRecord, TransactionRecordFormValue } from "../db/records/types";
import { EuroCircleOutlined, LoadingOutlined, ReloadOutlined } from "@ant-design/icons";
import { timeStamp } from "console";
import records from "../db/records/records";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const columns: ColumnsType<TransactionRecord> = [
    {
        title: 'Time',
        dataIndex: 'timestamp',
        key: 'timestamp',
        render: (text: string | number | Date) => { var date = new Date(text); return date.toLocaleString() },
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        render: (text: RecordType, record: TransactionRecord) => {
            switch (text) {
                case 'BUY':
                    return `Buy ${record.details?.count} newspaper${!record.details?.count ? 's' : ''}`;
                    break;
                case 'CASH_IN':
                    return 'Pay for newspaper';
                    break;
                case 'CASH_OUT':
                    return 'Cash out';
                    break;
                case 'BANK_TRANSFER':
                    return 'Newspaper sale via QR code';
                    break;
                default:
                    break;
            }
        }
    },
    {
        title: 'Amount (€)',
        dataIndex: 'amount',
        key: 'amount',
        // round off to 2 decimal places
        render: (amount: number) => { return Math.round(amount * 100) / 100 }
    },
    {
        title: 'Comment',
        dataIndex: 'comment',
        key: 'comment',
        render: (text: string) => { return text ? text : '-' }
    }
];

function Transactions(props: any) {
    const [showDrawer, setShowDrawer] = React.useState(false);
    const [transactions, setTransactions] = React.useState<TransactionRecord[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false)

    // get the vendor's transactions
    React.useEffect(() => {
        loadVendorTransactions()
    }, [showDrawer])

    const loadVendorTransactions = () => {
        setLoading(true)
        records.getRecordsByVendor(props.vendor.uuid).then((transactions) => {
            setTransactions(transactions)
            setLoading(false)
        })
    }

    const submitTransaction = async (transaction: TransactionRecord) => {
        await records.processTransactionEntry(transaction)
        showNotification('Transaction recorded', `Transaction of type ${transaction.type} was recorded.`)
        setShowDrawer(false)
    }


    let showNotification = (message: string, description: string) => {
        notification.info({
            message: message,
            description: description,
            placement: 'topRight'
        });
    }


    return (
        <div>
            <Spin indicator={antIcon} spinning={loading}>
                <Row className="transaction-list-table-action-panel">
                    <Col span={8} className='transactions-btn-col' >
                        <Button type='default' className='' >
                            <b>Total Due: €{props.vendor.totalDue ? props.vendor.totalDue : 0}</b>
                        </Button>
                    </Col>
                    <Col span={8} />
                    <Col span={8}  >
                        <Button type='primary' onClick={() => setShowDrawer(true)} className='record-transaction-btn' icon={<EuroCircleOutlined />}>
                            Record Transaction
                        </Button>
                    </Col>
                </Row>

                <Table rowKey={'uuid'} columns={columns} pagination={{ position: ['bottomRight'] }} dataSource={transactions} />
                <NewTransaction vendorUUID={props.vendor.uuid} showDrawer={showDrawer} closeDrawer={() => setShowDrawer(false)} submitTransaction={submitTransaction} showNotification={showNotification} />
            </Spin>
        </div>
    )
}




function NewTransaction(props: any) {
    const [form] = Form.useForm();
    const [transactionType, setTransactionType] = React.useState('BUY');

    const validateMessages = {
        required: '${label} is required!',
    };

    // reset form fields when transaction type changes
    const hadnleTransactionTypeChange = (e: any) => {
        setTransactionType(e.target.value)
        form.resetFields(['amount', 'amountSecondary', 'comment', 'count'])
    }

    // submit transaction
    const onFormFinish = () => {
        var transaction: TransactionRecordFormValue = {
            ...form.getFieldsValue(true),
            timestamp: new Date().getTime(),
            vendorUUID: props.vendorUUID,
        }
        props.submitTransaction(transaction)
        form.resetFields()
    }

    return (
        <Drawer
            open={props.showDrawer}
            title="New Transaction"
            placement="left"
            width={500}
            onClose={props.closeDrawer}
        >
            <Form.Provider onFormFinish={onFormFinish}>
                <Form
                    layout="vertical"
                    form={form}
                    validateMessages={validateMessages}
                    initialValues={{ type: 'BUY' }}
                >
                    <Form.Item label="Type" rules={[{ required: true }]} name="type">
                        <Radio.Group optionType="button" onChange={hadnleTransactionTypeChange}>
                            <Radio value="BUY">Buy newspaper</Radio>
                            <Radio value="CASH_OUT">Cash out</Radio>
                            {/* <Radio value="CASH_IN">Pay for newspaper</Radio> */}
                            {/* <Radio value="BANK_TRANSFER">Bank transfer</Radio> */}
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
                        <Input
                            type="number"
                            addonBefore="€"
                        />
                    </Form.Item>
                    {
                        transactionType === 'BUY' &&
                        <div>
                            <Form.Item label="Product count" name="count" rules={[{ required: true }]}>
                                <Input
                                    type="number"
                                />
                            </Form.Item>
                            <Form.Item label="Amount paid by vendor" name="amountSecondary" rules={[{ required: true }]}>
                                <Input
                                    type="number"
                                    addonBefore="€"
                                />
                            </Form.Item>
                        </div>

                    }
                    <Form.Item label="Comment">
                        <Form.Item name="comment" noStyle>
                            <Input />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" htmlType="submit">
                            Record Transaction
                        </Button>
                    </Form.Item>
                </Form>
            </Form.Provider>

        </Drawer>
    )
}


export default Transactions;
