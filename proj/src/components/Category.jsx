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
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';


export default function Category({ token, baseUrl }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [catdata, setCatdata] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const getCatData = () => {
    setLoading(true);
    axios.get(baseUrl+"getCategories", {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(result => {
      setCatdata(result.data.data);
    })
    .catch(err => {
      messageApi.error(t('cat.failFetchData'));
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
      messageApi.error(t('cat.failDeleteData'));
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
      title: t('cat.col.id'),
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: t('cat.col.cat'),
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: t('cat.col.sort'),
      dataIndex: 'sort',
      align: 'center'
    },
    {
      title: t('cat.col.status'),
      dataIndex: 'status',
      render: (status) => (
        <Badge
          style={{ width: "65px" }}
          status={status === 1 ? 'success' : 'error'}
          text={status === 1 ? t('cat.col.active') : t('cat.col.inactive')}
        />
      ),
      align: 'center'
    },
    {
      title: t('cat.col.action'),
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)} icon={<EditOutlined />} size="small">
            {t('cat.col.edit')}
          </Button>
          <Popconfirm
            title={t('cat.col.delTitle')}
            description={t('cat.col.delDesc')}
            okText={t('cat.col.delOK')}
            cancelText={t('cat.col.delCancel')}
            onConfirm={() => handleDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} size="small">{t('cat.col.delInactive')}</Button>
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
        title={t('cat.title')}
        extra={
          <Button type="primary" onClick={handleAdd}>
            <PlusOutlined /> {t('cat.add')}
          </Button>
        }
        style={{overflow: 'auto'}}
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
        title={editingRecord ? t('cat.edit') : t('cat.add')}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleModalOk}
        okText={t('cat.modal.ok')}
        cancelText={t('cat.modal.cancel')}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={t("cat.modal.name")}
            name="name"
            rules={[{ required: true, message: t("cat.modal.nameMsg") }]}
          >
            <Input placeholder={t('cat.modal.namePlaceholder')} />
          </Form.Item>
          <Form.Item label={t("cat.modal.status")} name="status">
            <Select>
              <Select.Option value={1}>{t("cat.modal.avail")}</Select.Option>
              <Select.Option value={0}>{t("cat.modal.unsvail")}</Select.Option>
            </Select>
              </Form.Item>
          <Form.Item
            label={t('cat.modal.sort')}
            name="sort"
            rules={[{ required: true, message: t("cat.modal.sortMsg") }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
