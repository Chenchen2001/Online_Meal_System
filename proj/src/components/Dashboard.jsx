import { 
  Typography,
  Card, 
  Button, 
  Alert, 
  Space,
  Avatar,
  Table,
  Tag,
  Badge,
  Statistic,
  message
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;
const { Countdown } = Statistic;

export default function Dashboard({ token, baseUrl }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = () => {
    setLoading(true);
    setError('');

    axios.get(baseUrl + 'getAllOrders', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(ordersRes => {
        setOrders(ordersRes.data.orders);
        return axios.get(baseUrl + 'getDashboardStats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      })
      .then(statsRes => {
        if (statsRes.data.status === 1) {
          setStats(statsRes.data.data);
        } else {
          setStats(null);
        }
      })
      .catch(err => {
        setError(t("dashboard.messages.fetchError", { error: err.message }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAcceptOrder = (orderId) => {
    setLoading(true);
    
    axios.post(
      `${baseUrl}acceptOrder`,
      { order_id: orderId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(response => {
        if (response.data.status === 1) {
          messageApi.success(t("dashboard.messages.acceptSuccess"));
          fetchData(); 
        } else {
          messageApi.error(response.data.message || t("dashboard.messages.acceptError"));
        }
      })
      .catch(error => {
        console.error('Accept order error:', error);
        messageApi.error(error.response?.data?.message || t("dashboard.messages.acceptError"));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRejectOrder = (orderId) => {
    setLoading(true);
    
    axios.post(
      `${baseUrl}rejectOrder`,
      { order_id: orderId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(response => {
        if (response.data.status === 1) {
          messageApi.success(t("dashboard.messages.rejectSuccess"));
          fetchData();
        } else {
          messageApi.error(response.data.message || t("dashboard.messages.rejectError"));
        }
      })
      .catch(error => {
        console.error('Reject order error:', error);
        messageApi.error(error.response?.data?.message || t("dashboard.messages.rejectError"));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCompleteOrder = (orderId) => {
    setLoading(true);
    
    axios.post(
      `${baseUrl}completeOrder`,
      { order_id: orderId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(response => {
        if (response.data.status === 1) {
          messageApi.success(t("dashboard.messages.completeSuccess"));
          fetchData(); 
        } else {
          messageApi.error(response.data.message || t("dashboard.messages.completeError"));
        }
      })
      .catch(error => {
        console.error('Complete order error:', error);
        messageApi.error(error.response?.data?.message || t("dashboard.messages.completeError"));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = [
    {
      title: t("dashboard.orders.columns.orderId"),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t("dashboard.orders.columns.status"),
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = '';
        switch(status) {
          case 'pending': color = 'orange'; break;
          case 'paid': color = 'blue'; break;
          case 'completed': color = 'green'; break;
          case 'cancelled': color = 'red'; break;
          default: color = 'gray';
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: t("dashboard.orders.columns.total"),
      dataIndex: 'total_price',
      key: 'total_price',
      render: price => `$${Number(price).toFixed(2)}`
    },
    {
      title: t("dashboard.orders.columns.items"),
      dataIndex: 'items',
      key: 'items',
      render: items => (
        <Text>
          {items.reduce((sum, item) => sum + item.quantity, 0)} {t("dashboard.orders.columns.items")}
        </Text>
      )
    },
    {
      title: t("dashboard.orders.columns.time"),
      dataIndex: 'create_time',
      key: 'create_time',
      render: time => moment(time).format('YYYY-MM-DD HH:mm')
    },
    {
      title: t("dashboard.orders.columns.action"),
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <>
              <Button 
                size="small" 
                type="primary" 
                onClick={() => handleAcceptOrder(record.id)}
                loading={loading}
              >
                {t("dashboard.actions.accept")}
              </Button>
              <Button 
                size="small" 
                danger 
                onClick={() => handleRejectOrder(record.id)}
                loading={loading}
              >
                {t("dashboard.actions.reject")}
              </Button>
            </>
          )}
          {record.status === 'paid' && (
            <Button 
              size="small" 
              type="primary"
              onClick={() => handleCompleteOrder(record.id)}
              loading={loading}
            >
              {t("dashboard.actions.complete")}
            </Button>
          )}
          {(record.status === 'completed' || record.status === 'cancelled') && (
            <Text type="secondary">{t("dashboard.orders.columns.noActions")}</Text>
          )}
        </Space>
      )
    }
  ];

  return (
    <>
      {contextHolder}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          <Card style={{ width: "25%", minWidth: 200, maxWidth: 500,flexShrink: 0 }}>
            <Space size="middle">
              <Avatar 
                size={48} 
                style={{ backgroundColor: '#1890ff' }} 
                icon={<UserOutlined />} 
              />
              <div>
                <Text type="secondary">{t("dashboard.stats.todayOrders")}</Text>
                <Title level={3} style={{ margin: 0 }}>
                  {stats?.todayOrders || '--'}
                </Title>
              </div>
            </Space>
          </Card>

          <Card style={{ width: "25%", minWidth: 200, maxWidth: 500,flexShrink: 0 }}>
            <Space size="middle">
              <Avatar 
                size={48} 
                style={{ backgroundColor: '#52c41a' }} 
                icon={<ShoppingCartOutlined />} 
              />
              <div>
                <Text type="secondary">{t("dashboard.stats.todayRevenue")}</Text>
                <Title level={3} style={{ margin: 0 }}>
                  ${Number(stats?.todayRevenue).toFixed(2) || '--'}
                </Title>
              </div>
            </Space>
          </Card>

          <Card style={{ width: "25%", minWidth: 200, maxWidth: 500, flexShrink: 0 }}>
            <Space size="middle">
              <Badge count={stats?.pendingOrders || 0}>
                <Avatar 
                  size={48} 
                  style={{ backgroundColor: '#faad14' }} 
                  icon={<DashboardOutlined />} 
                />
              </Badge>
              <div>
                <Text type="secondary">{t("dashboard.stats.pendingOrders")}</Text>
                <Title level={3} style={{ margin: 0 }}>
                  {stats?.pendingOrders || '--'}
                </Title>
              </div>
            </Space>
          </Card>
        </div>
      </div>

      <Card 
        title={t("dashboard.orders.title")} 
        extra={
          <Button 
            icon={<SyncOutlined />} 
            loading={loading}
            onClick={fetchData}
          >
            {t("dashboard.orders.refresh")}
          </Button>
        }
        style={{overflow: 'auto'}}
      >
        {error && (
          <Alert 
            message="Error" 
            description={error} 
            type="error" 
            showIcon 
            style={{ marginBottom: '16px' }}
          />
        )}
        
        <Table 
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: record => (
              <div style={{ margin: 0 }}>
                <Title level={5}>{t("dashboard.orders.expanded.itemsTitle")}</Title>
                <ul>
                  {record.items.map((item, index) => (
                    <li key={index}>{`#${item.dish_id}`} {item.name} × {item.quantity} @ ￥{Number(item.price).toFixed(2)}</li>
                  ))}
                </ul>
                <Text strong>{t("dashboard.orders.expanded.total")}: ￥{Number(record.total_price).toFixed(2)}</Text>
                {record.status === 'pending' && (
                  <div style={{ marginTop: 16 }}>
                    <Countdown 
                      title={t("dashboard.orders.expanded.acceptTime")} 
                      value={moment(record.create_time).add(15, 'minutes')} 
                      format="mm:ss"
                    />
                  </div>
                )}
              </div>
            )
          }}
        />
      </Card>
    </>
  );
}