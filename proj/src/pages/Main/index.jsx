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
  Select,
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
import { useTranslation } from 'react-i18next';
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
  const [collapsed, setCollapsed] = useState(true);
  const [selectedKey, setSelectedKey] = useState('order');
  const [user, setUser] = useState({})
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userid, setUserid] = useState('')
  const { t, i18n } = useTranslation();
  const [menuItems, setMenuItems] = useState([
    {
      key: 'order',
      icon: <OrderedListOutlined />,
      label: t('main.menu.order'),
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
      messageApi.error(t('main.failFetchData'));
    });
  };

  const setMenu = (auth) =>{
    if(auth==="user"){
      setMenuItems([
        ...menuItems,
        {
          key: 'dashboard',
          icon: <DashboardOutlined />,
          label: t('main.menu.dashboard'),
          onClick: () => navigate('/main/dashboard')
        },
        {
          key: 'foods',
          icon: <LikeOutlined />,
          label: t('main.menu.foodMgmt'),
          onClick: () => navigate('/main/foods'),
        }
      ])
    }else if(auth==="admin"){
      setMenuItems([
        ...menuItems,
        {
          key: 'dashboard',
          icon: <DashboardOutlined />,
          label: t('main.menu.dashboard'),
          onClick: () => navigate('/main/dashboard')
        },
        {
          key: 'users',
          icon: <UserOutlined />,
          label: t('main.menu.userMgmt'),
          onClick: () => navigate('/main/users'),
        },
        {
          key: 'category',
          icon: <UnorderedListOutlined />,
          label: t('main.menu.catMgmt'),
          onClick: () => navigate('/main/category'),
        },
        {
          key: 'foods',
          icon: <LikeOutlined />,
          label: t('main.menu.foodMgmt'),
          onClick: () => navigate('/main/foods'),
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: t('main.menu.settings'),
          onClick: () => navigate('/main/settings'),
        },
      ])
    }
  }

  useEffect(() => {
    const newMenu = [
      {
        key: 'order',
        icon: <OrderedListOutlined />,
        label: t('main.menu.order'),
        onClick: () => navigate('/main/order')
      }
    ];
    setMenuItems(newMenu);
  }, [i18n.language]);

  useEffect(() => {
    if (menuItems.length <= 1) {
      getUser();
    }
  }, [menuItems]);

  const userMenu = {
    items: [
      {
        key: 'profile',
        label: t('main.profile'),
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        label: t('main.logout'),
      },
    ],
    onClick: ({ key }) => {
      if (key === 'profile') {
        navigate('/main/profile');
      } else if (key === 'logout') {
        handleLogout();
      }
    },
  };


  const notificationMenu = {
    items: [
      {
        key: '1',
        label: (
          <Space>
            <BellOutlined />
            <span>{t('main.newMsg')}</span>
          </Space>
        ),
      },
      {
        key: '2',
        label: (
          <Space>
            <MailOutlined />
            <span>{t('main.sysUpdate')}</span>
          </Space>
        ),
      },
    ],
    onClick: ({ key }) => {
      if (key === '1') {
        messageApi.warning(t('main.newMsgPop'));
      } else if (key === '2') {
        messageApi.warning(t('main.sysUpdatePop'));
      }
    },
  };

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
              {selectedKey === 'order' && t('main.headline.order')}
              {selectedKey === 'dashboard' && t('main.headline.dashboard')}
              {selectedKey === 'category' && t('main.headline.category')}
              {selectedKey === 'users' && t('main.headline.users')}
              {selectedKey === 'foods' && t('main.headline.foods')}
              {selectedKey === 'settings' && t('main.headline.settings')}
            </Title>
          </div>
          <Space size="large">
            <Select defaultValue={i18n.language} options={[
              { value: 'zh-CN', label: <span>🇨🇳 简体中文</span> },
              { value: 'zh-HK', label: <span>🇭🇰 繁體中文</span> },
              { value: 'en', label: <span>🇬🇧 English</span> }
              ]} 
              onChange={(e) => {
                i18n.changeLanguage(e);
                messageApi.info(t('main.whenChangeLanguage'))
              }}
              style={{marginLeft: 10, width: '9em'}}
            />

            <Dropdown menu={notificationMenu} placement="bottomRight">
                <Button 
                  type="text" 
                  icon={<BellOutlined style={{ fontSize: '16px' }} />} 
                  size="large"
                />
            </Dropdown>
            
            <Dropdown menu={userMenu} placement="bottomRight">
              <Space>
                <Avatar src={avatarUrl} />
                <Text
                  strong
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'inline-block'
                  }}
                >
                  {user.name}
                </Text>
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