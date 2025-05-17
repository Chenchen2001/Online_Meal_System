/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Menu, 
  Button, 
  Typography, 
  Space,
  Avatar,
  Dropdown,
  message
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  MailOutlined,
  LikeOutlined,
  UnorderedListOutlined,
  OrderedListOutlined
} from '@ant-design/icons';
import Dashboard from '../../components/Dashboard';
import UserMgnts from '../../components/UserMgnts';
import Setting from '../../components/Setting';
import FoodMgmt from '../../components/FoodMgmt';
import Profile from '../../components/Profile';
import axios from 'axios'
import Category from '../../components/Category';
import Order from '../../components/Order';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function Main({ token, setToken, baseUrl }){
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('order');
  const [user, setUser] = useState({})
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userid, setUserid] = useState('')
  const [menuItems, setMenuItems] = useState([
    {
      key: 'order',
      icon: <OrderedListOutlined />,
      label: 'Order',
      onClick: () => navigate('/main/order')
    }
  ])
  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    navigate('/login');
  };

  const getUser = () => {
    axios.post(baseUrl+"analyzejwt", { token }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      if (res.data?.data) {
        setUser(res.data.data);
        setAvatarUrl(res.data.data.avatar)
        setMenu(res.data.data.auth_flag)
        setUserid(res.data.data.id)
      }
    })
    .catch(() => {
      messageApi.error("Failed to fetch user data");
    });
  };

  const setMenu = (auth) =>{
    if(auth==="user"){
      setMenuItems([
        ...menuItems,
        {
          key: 'dashboard',
          icon: <DashboardOutlined />,
          label: 'Dashboard',
          onClick: () => navigate('/main/dashboard')
        },
        {
          key: 'foods',
          icon: <LikeOutlined />,
          label: 'Food Management',
          onClick: () => navigate('/main/foods'),
        }
      ])
    }else if(auth==="admin"){
      setMenuItems([
        ...menuItems,
        {
          key: 'dashboard',
          icon: <DashboardOutlined />,
          label: 'Dashboard',
          onClick: () => navigate('/main/dashboard')
        },
        {
          key: 'users',
          icon: <UserOutlined />,
          label: 'User Management',
          onClick: () => navigate('/main/users'),
        },
        {
          key: 'category',
          icon: <UnorderedListOutlined />,
          label: 'Category Management',
          onClick: () => navigate('/main/category'),
        },
        {
          key: 'foods',
          icon: <LikeOutlined />,
          label: 'Food Management',
          onClick: () => navigate('/main/foods'),
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: 'Settings',
          onClick: () => navigate('/main/settings'),
        },
      ])
    }
  }

  useEffect(()=>{
    getUser()
  },[])


  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={()=>navigate('/main/profile')}>Profile</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>Logout</Menu.Item>
    </Menu>
  );

  const notificationMenu = (
    <Menu>
      <Menu.Item key="1" onClick={()=>messageApi.warning("No message function")}>
        <Space>
          <BellOutlined />
          <span>New message received</span>
        </Space>
      </Menu.Item>
      <Menu.Item key="2" onClick={()=>messageApi.warning("No system update")}>
        <Space>
          <MailOutlined />
          <span>System update available</span>
        </Space>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {contextHolder}
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        width={250}
        theme="light"
      >
        <div className="logo" style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '0 16px'
        }}>
          <Title level={4} style={{ margin: 0, display: collapsed ? "none" : null }}>Panel</Title>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onSelect={({ key }) => setSelectedKey(key)}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          padding: 0, 
          background: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingRight: '24px',
          boxShadow: '0 1px 4px rgba(0,21,41,0.08)'
        }}>
          <div style={{ paddingLeft: '24px' }}>
            <Title level={4} style={{ margin: 0 }}>
              {selectedKey === 'order' && 'Menu'}
              {selectedKey === 'dashboard' && 'Today\'s sales'}
              {selectedKey === 'category' && 'Category List'}
              {selectedKey === 'users' && 'User List'}
              {selectedKey === 'foods' && 'Food List'}
              {selectedKey === 'settings' && 'Settings'}
            </Title>
          </div>
          <Space size="large">
            <Dropdown overlay={notificationMenu} placement="bottomRight">
                <Button 
                  type="text" 
                  icon={<BellOutlined style={{ fontSize: '16px' }} />} 
                  size="large"
                />
            </Dropdown>
            
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Space>
                <Avatar src={avatarUrl} />
                <Text strong>{user.name}</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: '#fff',
          minHeight: '280px'
        }}>
          <Routes>
            <Route path="order" element={<Order token={token} baseUrl={baseUrl}/>} />
            <Route path="dashboard" element={<Dashboard token={token} baseUrl={baseUrl}/>} />
            <Route path="users" element={<UserMgnts token={token} userid={userid}  baseUrl={baseUrl}/>}/>
            <Route path="category" element={<Category token={token} baseUrl={baseUrl}/>} />
            <Route path="foods" element={<FoodMgmt token={token} baseUrl={baseUrl}/>}/>
            <Route path="profile" element={<Profile token={token} baseUrl={baseUrl}/>}/>
            <Route path="settings" element={<Setting token={token} baseUrl={baseUrl}/>}/>
            <Route index element={<Order token={token} baseUrl={baseUrl}/>}/>
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};