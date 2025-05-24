/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Image,
  Tooltip,
  Popconfirm
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const { Option } = Select;

export default function UserMgnts({ token, userid, baseUrl }) {
  const [userData, setUserData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 8, total: 0 });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchAuth, setSearchAuth] = useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchUserData = (page = 1, pageSize = 8, name = searchName, auth_flag = searchAuth) => {
    setLoading(true);
    axios.get(baseUrl + "getUsers", {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, pageSize, name, auth_flag }
    })
    .then(res => {
      setUserData(res.data.data || []);
      setPagination({
        current: page,
        pageSize,
        total: res.data.pagination?.total || 0
      });
    })
    .catch(() => {
      messageApi.error(t('user.messages.fetchError'));
    })
    .finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const openModal = (record = null) => {
    setEditingUser(record);
    setModalVisible(true);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  };

  const handleDelete = (id) => {
    axios.delete(baseUrl + "deleteUser", {
      headers: { Authorization: `Bearer ${token}` },
      params: { id }
    })
    .then(() => {
      messageApi.success(t('user.messages.deleteSuccess'));
      fetchUserData(pagination.current, pagination.pageSize);
    })
    .catch(() => {
      messageApi.error(t('user.messages.deleteError'));
    });
  };

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        const url = editingUser ? "updateUser" : "addUser";
        const method = editingUser ? "put" : "post";
        if (editingUser) values.id = editingUser.id;

        return axios({
          method,
          url: baseUrl + url,
          headers: { Authorization: `Bearer ${token}` },
          data: values
        });
      })
      .then(() => {
        messageApi.success(t(editingUser ? 'messages.operateSuccess.edit' : 'messages.operateSuccess.add'));
        setModalVisible(false);
        fetchUserData(pagination.current, pagination.pageSize);
      })
      .catch(() => {
        messageApi.error(t('user.messages.operateError'));
      });
  };

  const columns = [
    { title: t('user.table.columns.id'), dataIndex: 'openid', key: 'openid', align: 'center' },
    { title: t('user.table.columns.nickname'), dataIndex: 'name', key: 'name', align: 'center' },
    {
      title: t('user.table.columns.avatar'),
      dataIndex: 'avatar',
      key: 'avatar',
      render: (url) =>
        url ? (
          <div style={{ textAlign: 'center' }}>
            <Image width={40} height={40} src={url} alt="avatar" style={{ borderRadius: '50%', objectFit: 'cover' }} />
          </div>
        ) : t('user.table.noAvatar'),
      align: 'center'
    },
    { title: t('user.table.columns.phone'), dataIndex: 'phone', key: 'phone', align: 'center' },
    { title: t('user.table.columns.gender'), dataIndex: 'sex', key: 'sex', align: 'center' },
    { title: t('user.table.columns.authority'), dataIndex: 'auth_flag', key: 'auth_flag', align: 'center' },
    {
      title: t('user.table.columns.actions'),
      key: 'actions',
      render: (record) => (
        <Space>
          <Tooltip
            title={
              record.id === userid ? (
                <span>
                  {t('user.tooltips.editYourself')}{" "}
                  <a
                    style={{ marginLeft: 4, cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/main/profile');
                    }}
                  >
                    {t('main.profile')}
                  </a>
                </span>
              ) : ""
            }
          >
            <Button
              icon={<EditOutlined />}
              onClick={() => openModal(record)}
              size="small"
              disabled={record.id === userid}
            >
              {t('user.buttons.edit')}
            </Button>
          </Tooltip>
          <Popconfirm
            title={t('user.popconfirm.deleteTitle')}
            description={t('user.popconfirm.deleteDesc')}
            okText={t('user.popconfirm.okText')}
            cancelText={t('user.popconfirm.cancelText')}
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title={record.id === userid ? t('user.tooltips.deleteYourself') : ""}>
              <Button
                icon={<DeleteOutlined />}
                danger
                size="small"
                disabled={record.id === userid}
              >
                {t('user.buttons.delete')}
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
      align: 'center'
    }
  ];

  return (
    <>
      {contextHolder}
      <Card
        title={t('user.title')}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            {t('user.addUser')}
          </Button>
        }
        style={{ overflow: 'auto' }}
      >
        <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
          <Tooltip title={t('user.tooltips.inputHint')}>
            <Input
              placeholder={t('user.buttons.search') + " " + t('user.form.nickname')}
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              style={{ width: 200, minWidth: 125 }}
            />
          </Tooltip>
          <Tooltip title={t('user.tooltips.selectHint')}>
            <Select
              placeholder={t('user.form.authority')}
              value={searchAuth || undefined}
              onChange={value => setSearchAuth(value)}
              allowClear
              style={{ width: 180 }}
            >
              <Option value="admin">{t('user.form.authorityOptions.admin')}</Option>
              <Option value="user">{t('user.form.authorityOptions.user')}</Option>
              <Option value="customer">{t('user.form.authorityOptions.customer')}</Option>
            </Select>
          </Tooltip>
          <Button type="primary" onClick={() => fetchUserData(1, pagination.pageSize)}>
            {t('user.buttons.search')}
          </Button>
          <Button onClick={() => {
            setSearchName('');
            setSearchAuth('');
            fetchUserData(1, pagination.pageSize, '', '');
          }}>
            {t('user.buttons.reset')}
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={userData}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => fetchUserData(page, pageSize)
          }}
          bordered
        />

        <Modal
          title={editingUser ? t('user.editUser') : t('user.addUser')}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleSubmit}
          okText={t('user.modalSubmit')}
          cancelText={t('user.modalCancel')}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="openid" label={t('user.form.openid')} required>
              <Input disabled={editingUser} />
            </Form.Item>
            <Form.Item
              name="name"
              label={t('user.form.nickname')}
              rules={[{ required: true, message: t('user.form.nicknameRequired') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="phone" label={t('user.form.phone')}>
              <Input />
            </Form.Item>
            <Form.Item name="sex" label={t('user.form.gender')}>
              <Select>
                <Option value="M">{t('user.form.genderOptions.M')}</Option>
                <Option value="F">{t('user.form.genderOptions.F')}</Option>
                <Option value="-">{t('user.form.genderOptions.-')}</Option>
              </Select>
            </Form.Item>
            <Form.Item name="id_number" label={t('user.form.idNumber')}>
              <Input />
            </Form.Item>
            <Form.Item name="auth_flag" label={t('user.form.authority')}>
              <Select>
                <Option value="admin">{t('user.form.authorityOptions.admin')}</Option>
                <Option value="user">{t('user.form.authorityOptions.user')}</Option>
                <Option value="customer">{t('user.form.authorityOptions.customer')}</Option>
              </Select>
            </Form.Item>
            <Form.Item name="avatar" label={t('user.form.avatar')}>
              <Input />
            </Form.Item>
            <Form.Item shouldUpdate>
              {() => {
                const avatar = form.getFieldValue('avatar');
                return avatar ? (
                  <Image width={100} height={100} src={avatar} alt="avatar" style={{ borderRadius: '10px' }} />
                ) : t('user.form.avatarPlaceholder');
              }}
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </>
  );
}