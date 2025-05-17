/* eslint-disable react-hooks/exhaustive-deps */
import { 
  Card, 
  Button, 
  Table, 
  Space,
  Badge,
  Spin,
  message,
  Modal,
  Popconfirm,
  InputNumber, 
  Input,
  Form,
  Select
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import axios from 'axios'
import { useEffect, useState } from 'react';


export default function Category({ token, baseUrl }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [catdata, setCatdata] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const getCatData = () => {
    setLoading(true);
    axios.get(baseUrl+"getCategories", {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(result => {
      setCatdata(result.data.data);
    })
    .catch(err => {
      messageApi.error('Failed to fetch category data, try RELOGIN');
      console.log("Failed to get category data", err)
    })
    .finally(() => setLoading(false));
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,
      sort: record.sort,
      status: record.status
    });
    setModalOpen(true);
  };

  const handleDelete = (record) => {
    axios.delete(baseUrl+"deleteCategory", {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { id: record.id }
    })
    .then(res => {
      messageApi.success(res.data.data.message);
      getCatData();
    })
    .catch(err => {
      messageApi.error('Failed to delete category');
    });
  };

  const handleAdd = () => {
  setEditingRecord(null);
  form.setFieldsValue({
    name: "",
    sort: 0,
    status: 1
  });
  setModalOpen(true);
};


  const handleModalOk = () => {
    form.validateFields().then(values => {
      const url = editingRecord ? "updateCategory" : "addCategory";
      const method = editingRecord ? "put" : "post";
      const data = editingRecord ? { ...values, id: editingRecord.id } : values;

      axios[method](baseUrl+url, data, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        messageApi.success(res.data.data.message);
        setModalOpen(false);
        getCatData();
      })
      .catch(err => {
        messageApi.error('Failed to save category');
        console.log("Failed to save modification", err)
      });
    });
  };

  useEffect(() => {
    getCatData();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: 'Category',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: 'Sort',
      dataIndex: 'sort',
      align: 'center'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <Badge
          style={{ width: "65px" }}
          status={status === 1 ? 'success' : 'error'}
          text={status === 1 ? 'Active' : 'Inactive'}
        />
      ),
      align: 'center'
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)} icon={<EditOutlined />} size="small">
            Edit
          </Button>
          <Popconfirm
            title="Delete the item"
            description="Are you sure to inactive this item?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} size="small">Inactive</Button>
          </Popconfirm>
        </Space>
      ),
      align: 'center'
    },
  ];

  return (
    <>
      {contextHolder}
      <Card
        title="Category Management"
        extra={
          <Button type="primary" onClick={handleAdd}>
            <PlusOutlined /> Add Category
          </Button>
        }
      >
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={catdata}
            bordered
            rowKey="id"
          />
        </Spin>
      </Card>

      <Modal
        title={editingRecord ? "Edit Category" : "Add Category"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleModalOk}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select>
              <Select.Option value={1}>Available</Select.Option>
              <Select.Option value={0}>Unavailable</Select.Option>
            </Select>
              </Form.Item>
          <Form.Item
            label="Sort Order"
            name="sort"
            rules={[{ required: true, message: 'Please enter sort order' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
