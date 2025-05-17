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
  Image, 
  InputNumber, 
  Input,
  Form,
  Select,
  Tooltip 
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function FoodMgmt({ token, baseUrl }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: 0,
  });
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ name: '', category_id: '' });

  const handleEdit = (record) => {
    setEditingRecord(record);
    setModalOpen(true);
  };


  const handleDelete = (record) => {
    axios.delete(baseUrl+"deleteDish", {
      headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          id: record.id
        }
    })
    .then(res=>{
      messageApi.success(res.data.data.message)
      fetchFoodData()
    })
    .catch(err=>{
      messageApi.error('Failed to delete food data');
      console.error('Error deleting food data:', err);
    })
  };

  const fetchCategories = () => {
    axios.get(baseUrl + "getAvailableCategories", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setCategories(response.data.data || []);
      })
      .catch(error => {
        messageApi.error('Failed to fetch category data, try RELOGIN');
        console.error('Error fetching categories:', error);
      });
  };

  const handleSubmit = (record) => {
    if (record.id) {
      axios.put(baseUrl+"updateDish", record, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        messageApi.success(res.data.data.message);
        setEditingRecord(null);
        setModalOpen(false)
        fetchFoodData(pagination.current, pagination.pageSize);
      })
      .catch(err => {
        messageApi.error('Failed to edit the dish');
        console.error(err);
      });
    } else {
      axios.post(baseUrl+"addDish", record, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        messageApi.success(res.data.data.message);
        setEditingRecord(null);
        setModalOpen(false)
        fetchFoodData(pagination.current, pagination.pageSize);
      })
      .catch(err => {
        messageApi.error('Failed to add new dish');
        console.error(err);
      });
    }
  };


  const fetchFoodData = (page = 1, pageSize = 10) => {
    setLoading(true);
    axios.get(baseUrl + "getFoodLst", {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        page,
        pageSize,
        name: filters.name,
        category_id: filters.category_id
      }
    })
    .then(result => {
      setFoodData(result.data.data || []);
      setPagination({
        ...pagination,
        current: page,
        pageSize: pageSize,
        total: result.data.pagination?.total || 0
      });
    })
    .catch(err => {
      messageApi.error('Failed to fetch food data, try RELOGIN');
      console.error('Error fetching food data:', err);
    })
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFoodData(pagination.current, pagination.pageSize);
    fetchCategories();
  }, []);

  const handleTableChange = (pagination) => {
    fetchFoodData(pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: 'id',
      key: 'id',
      align: 'center'
    },
    {
      title: 'Food name',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: 'Category',
      dataIndex: 'category_id',
      key: 'category_id',
      render: (categoryId) => {
        const category = categories.find((e) => e.id === categoryId);
        return category ? category.name : 'Unknown';
      },
      align: 'center'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `￥${Number(price).toFixed(2)}`,
      align: 'center'
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <div style={{textAlign: 'center'}}>{image ? (
        <img src={image} alt="food" style={{ width: 50, height: 50, objectFit: 'cover' }} />
      ) : 'No image' }</div>,
      align: 'center'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      align: 'center'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          style={{width: "65px"}}
          status={status === 1 ? 'success' : 'error'} 
          text={status === 1 ? 'Active' : 'Inactive'} 
        />
      ),
      align: 'center'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={()=>handleEdit(record)} icon={<EditOutlined />} size="small">
          Edit
          </Button>
          <Popconfirm
            title="Delete the item"
            description="Are you sure to delete this item?"
            okText="Yes"
            cancelText="No"
            onConfirm={()=>handleDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} size="small">Delete</Button>
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
      title="Food Management"
      extra={
        <Button type="primary" onClick={() => {
          setEditingRecord({});
          setModalOpen(true);
        }}>
          <PlusOutlined/> Add Dish
        </Button>
      }
    >
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Tooltip title="Clear the input holder to remove condition">
        <Input
          placeholder="Search by name"
          value={filters.name}
          onChange={e => setFilters({ ...filters, name: e.target.value })}
          onPressEnter={() => fetchFoodData(1, pagination.pageSize)}
          style={{ width: 200 }}
        />
        </Tooltip>
        <Tooltip title="Click the cross to remove condition">
        <Select
          placeholder="Filter by category"
          allowClear
          value={filters.category_id || undefined}
          onChange={value => setFilters({ ...filters, category_id: value })}
          style={{ width: 200 }}
        >
          {categories.map(cat => (
            <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
          ))}
        </Select>
        </Tooltip>
        <Button type="primary" onClick={() => fetchFoodData(1, pagination.pageSize)}>
          Search
        </Button>
      </div>
      <Spin spinning={loading}>
        <Table 
          columns={columns} 
          dataSource={foodData} 
          pagination={pagination}
          onChange={handleTableChange}
          bordered
          rowKey="id"
        />
      </Spin>
    </Card>
    <Modal
      title={`Edit Meal - ${editingRecord?.name || ''}`}
      open={modalOpen}
      onOk={() => {
        setEditingRecord(null)
        setModalOpen(false)
      }}
      onCancel={() => {
        setEditingRecord(null)
        setModalOpen(false)
      }}
      width={800}
      footer={[
        <Button key="cancel" onClick={() => {
          setEditingRecord(null)
          setModalOpen(false)
        }}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => handleSubmit(editingRecord)}>
          Save
        </Button>
      ]}
    >
      {editingRecord && (
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ width: 300 }}>
            <Image
              width="100%"
              src={editingRecord.image}
              alt={editingRecord.name}
              fallback="https://via.placeholder.com/300x200?text=Failed_to_load_picture"
              style={{ 
                borderRadius: 8,
                objectFit: 'cover',
                marginBottom: 16
              }}
            />
            <Input
              addonBefore="URL"
              value={editingRecord.image}
              onChange={(e) => setEditingRecord({
                ...editingRecord,
                image: e.target.value
              })}
            />
          </div>

          <div style={{ flex: 1 }}>
            <Form layout="vertical">
              <Form.Item label="Dish Name">
                <Input
                  value={editingRecord.name}
                  onChange={(e) => setEditingRecord({
                    ...editingRecord,
                    name: e.target.value
                  })}
                />
              </Form.Item>

              <Form.Item label="Price">
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  addonAfter="CNY"
                  value={editingRecord.price}
                  onChange={(value) => setEditingRecord({
                    ...editingRecord,
                    price: value
                  })}
                />
              </Form.Item>

              <Form.Item label="Category">
                <Select
                  value={editingRecord.category_id}
                  onChange={(value) =>
                    setEditingRecord({ ...editingRecord, category_id: value })
                  }
                >
                  {categories.map((cat) => (
                    <Select.Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Status">
                <Select
                  value={editingRecord.status}
                  onChange={(value) => setEditingRecord({
                    ...editingRecord,
                    status: value
                  })}
                >
                  <Select.Option value={1}>Available</Select.Option>
                  <Select.Option value={0}>Unavailable</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="description">
                <Input.TextArea
                  rows={4}
                  value={editingRecord.description}
                  onChange={(e) => setEditingRecord({
                    ...editingRecord,
                    description: e.target.value
                  })}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    </Modal>
    </>
  );
}