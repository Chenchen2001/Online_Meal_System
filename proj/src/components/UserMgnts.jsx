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
  PlusOutlined,  
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    .catch(err => {
      messageApi.error("Failed to fetch user data, try RELOGIN");
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
    axios.delete(baseUrl+"deleteUser", {
      headers: { Authorization: `Bearer ${token}` },
      params: { id }
    })
    .then(res=>{
      messageApi.success("Deleted successfully", res);
      fetchUserData(pagination.current, pagination.pageSize);
    })
    .catch(err=>{
      messageApi.error("Failed to delete.");
      console.log("Failed to delete user", err)
    })
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
        messageApi.success(editingUser ? "Updated" : "Added");
        setModalVisible(false);
        fetchUserData(pagination.current, pagination.pageSize);
      })
      .catch(err => {
        console.error(err);
        messageApi.error("Failed to operate");
      });
  };

  const columns = [
    { title: 'ID', dataIndex: 'openid', key: 'openid', align: 'center' },
    { title: 'Nickname', dataIndex: 'name', key: 'name', align: 'center' },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (url) => (url ?
        <div style={{textAlign: 'center'}}>
        <Image width={40} height={40} src={url} alt="avatar" style={{ borderRadius: '50%', objectFit: 'cover' }} />
        </div>
        : "No Avatar"
      ), 
      align: 'center'
    },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', align: 'center' },
    { title: 'Gender', dataIndex: 'sex', key: 'sex', align: 'center' },
    { title: 'Auth', dataIndex: 'auth_flag', key: 'auth_flag', align: 'center' },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <Space>
          <Tooltip 
            title={record.id === userid ? (
              <span>
                Please go to 
                <a 
                  style={{ marginLeft: 4, cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/main/profile');
                  }}
                >
                  profile 
                </a> 
                &nbsp;to edit
              </span>
            ) : ""}
          >
            <Button
              icon={<EditOutlined />}
              onClick={() => openModal(record)}
              size="small"
              disabled={record.id === userid}
              danger={false}
            >Edit</Button>
          </Tooltip>
          <Popconfirm
            title="Delete the user"
            description="Are you sure to delete this user?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title={record.id === userid ? "You can't delete yourself" : ""}>
            <Button 
              icon={<DeleteOutlined />} 
              danger 
              size="small" 
              disabled={record.id === userid}
            >
              Delete
            </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ), align: 'center'
    }
  ];

  return (
    <>
    {contextHolder}
    <Card title="User Management" extra={
      <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Add User</Button>
    }>
    <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
      <Tooltip title="Clear the input holder to remove condition">
      <Input
        placeholder="Search by name"
        value={searchName}
        onChange={e => setSearchName(e.target.value)}
        style={{ width: 200 }}
      />
      </Tooltip>
      <Tooltip title="Click the cross to remove condition">
      <Select
        placeholder="Filter by auth"
        value={searchAuth || undefined}
        onChange={value => setSearchAuth(value)}
        allowClear
        style={{ width: 180 }}
      >
        <Option value="admin">Admin</Option>
        <Option value="user">User</Option>
        <Option value="customer">Customer</Option>
      </Select>
      </Tooltip>
      <Button type="primary" onClick={() => fetchUserData(1, pagination.pageSize)}>Search</Button>
      <Button onClick={() => {
        setSearchName('');
        setSearchAuth('');
        fetchUserData(1, pagination.pageSize, '', '');
      }}>Reset</Button>
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
        title={editingUser ? "Edit User" : "Add User"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        okText="Submit"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="openid" label="OpenID" required>
            <Input  disabled={editingUser}/>
          </Form.Item>
          <Form.Item name="name" label="Nickname" rules={[{ required: true, message: 'Please input nickname' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="sex" label="Gender">
            <Select>
              <Option value="M">Male</Option>
              <Option value="F">Female</Option>
              <Option value="-">Not want to provide</Option>
            </Select>
          </Form.Item>
          <Form.Item name="id_number" label="ID Number">
            <Input />
          </Form.Item>
          <Form.Item name="auth_flag" label="Authority">
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
              <Option value="customer">Customer</Option>
            </Select>
          </Form.Item>
          <Form.Item name="avatar" label="Avatar">
            <Input />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => {
              const avatar = form.getFieldValue('avatar');
              return avatar ? (
                <Image width={100} height={100} src={avatar} alt="avatar" style={{ borderRadius: '10px' }} />
              ) : 'No Avatar Type in URL Above';
            }}
          </Form.Item>
        </Form>
      </Modal>
    </Card>
    </>
  );
}
