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
import { useTranslation } from 'react-i18next';

export default function FoodMgmt({ token, baseUrl }) {
  const { t } = useTranslation();
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
      messageApi.success(t("foodMgmt.messages.deleteSuccess"));
      fetchFoodData();
    })
    .catch(err=>{
      messageApi.error(t("foodMgmt.messages.deleteError"));
      console.error('Error deleting food data:', err);
    });
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
        messageApi.error(t("foodMgmt.messages.categoryFetchError"));
        console.error('Error fetching categories:', error);
      });
  };

  const handleSubmit = (record) => {
    if (record.id) {
      axios.put(baseUrl+"updateDish", record, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        messageApi.success(t("foodMgmt.messages.updateSuccess"));
        setEditingRecord(null);
        setModalOpen(false);
        fetchFoodData(pagination.current, pagination.pageSize);
      })
      .catch(err => {
        messageApi.error(t("foodMgmt.messages.updateError"));
        console.error(err);
      });
    } else {
      axios.post(baseUrl+"addDish", record, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        messageApi.success(t("foodMgmt.messages.createSuccess"));
        setEditingRecord(null);
        setModalOpen(false);
        fetchFoodData(pagination.current, pagination.pageSize);
      })
      .catch(err => {
        messageApi.error(t("foodMgmt.messages.createError"));
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
      messageApi.error(t("foodMgmt.messages.fetchError"));
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
      title: t("foodMgmt.columns.id"),
      dataIndex: 'id',
      key: 'id',
      align: 'center'
    },
    {
      title: t("foodMgmt.columns.name"),
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: t("foodMgmt.columns.category"),
      dataIndex: 'category_id',
      key: 'category_id',
      render: (categoryId) => {
        const category = categories.find((e) => e.id === categoryId);
        return category ? category.name : t("foodMgmt.columns.unknownCategory");
      },
      align: 'center'
    },
    {
      title: t("foodMgmt.columns.price"),
      dataIndex: 'price',
      key: 'price',
      render: (price) => `￥${Number(price).toFixed(2)}`,
      align: 'center'
    },
    {
      title: t("foodMgmt.columns.image"),
      dataIndex: 'image',
      key: 'image',
      render: (image) => <div style={{textAlign: 'center'}}>{image ? (
        <img src={image} alt="food" style={{ width: 50, height: 50, objectFit: 'cover' }} />
      ) : t("foodMgmt.columns.noImage") }</div>,
      align: 'center'
    },
    {
      title: t("foodMgmt.columns.description"),
      dataIndex: 'description',
      key: 'description',
      align: 'center'
    },
    {
      title: t("foodMgmt.columns.status"),
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          style={{width: "65px"}}
          status={status === 1 ? 'success' : 'error'} 
          text={status === 1 ? t("foodMgmt.columns.active") : t("foodMgmt.columns.inactive")} 
        />
      ),
      align: 'center'
    },
    {
      title: t("foodMgmt.columns.actions"),
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={()=>handleEdit(record)} icon={<EditOutlined />} size="small">
            {t("foodMgmt.actions.edit")}
          </Button>
          <Popconfirm
            title={t("foodMgmt.deleteConfirm.title")}
            description={t("foodMgmt.deleteConfirm.description")}
            okText={t("foodMgmt.deleteConfirm.okText")}
            cancelText={t("foodMgmt.deleteConfirm.cancelText")}
            onConfirm={()=>handleDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              {t("foodMgmt.actions.delete")}
            </Button>
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
        title={t("foodMgmt.title")}
        extra={
          <Button type="primary" onClick={() => {
            setEditingRecord({});
            setModalOpen(true);
          }}>
            <PlusOutlined/> {t("foodMgmt.actions.addDish")}
          </Button>
        }
        style={{overflow: 'auto'}}
      >
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Tooltip title={t("foodMgmt.filters.clearNameTooltip")}>
            <Input
              placeholder={t("foodMgmt.filters.searchByName")}
              value={filters.name}
              onChange={e => setFilters({ ...filters, name: e.target.value })}
              onPressEnter={() => fetchFoodData(1, pagination.pageSize)}
              style={{ width: 200, minWidth: 125 }}
            />
          </Tooltip>
          <Tooltip title={t("foodMgmt.filters.clearCategoryTooltip")}>
            <Select
              placeholder={t("foodMgmt.filters.filterByCategory")}
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
            {t("foodMgmt.actions.search")}
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
        title={editingRecord?.name ? t('foodMgmt.modal.titleEdit')+" - "+editingRecord.name : t('foodMgmt.modal.titleAdd')}
        open={modalOpen}
        onOk={() => {
          setEditingRecord(null);
          setModalOpen(false);
        }}
        onCancel={() => {
          setEditingRecord(null);
          setModalOpen(false);
        }}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => {
            setEditingRecord(null);
            setModalOpen(false);
          }}>
            {t("foodMgmt.actions.cancel")}
          </Button>,
          <Button key="submit" type="primary" onClick={() => handleSubmit(editingRecord)}>
            {t("foodMgmt.actions.save")}
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
                addonBefore={t("foodMgmt.modal.form.imageUrl")}
                value={editingRecord.image}
                onChange={(e) => setEditingRecord({
                  ...editingRecord,
                  image: e.target.value
                })}
              />
            </div>

            <div style={{ flex: 1 }}>
              <Form layout="vertical">
                <Form.Item label={t("foodMgmt.modal.form.dishName")}>
                  <Input
                    value={editingRecord.name}
                    onChange={(e) => setEditingRecord({
                      ...editingRecord,
                      name: e.target.value
                    })}
                  />
                </Form.Item>

                <Form.Item label={t("foodMgmt.modal.form.price")}>
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

                <Form.Item label={t("foodMgmt.modal.form.category")}>
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

                <Form.Item label={t("foodMgmt.modal.form.status")}>
                  <Select
                    value={editingRecord.status}
                    onChange={(value) => setEditingRecord({
                      ...editingRecord,
                      status: value
                    })}
                  >
                    <Select.Option value={1}>{t("foodMgmt.modal.form.available")}</Select.Option>
                    <Select.Option value={0}>{t("foodMgmt.modal.form.unavailable")}</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label={t("foodMgmt.modal.form.description")}>
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