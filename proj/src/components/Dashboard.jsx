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
const { Title, Text } = Typography;
const { Countdown } = Statistic;

export default function Dashboard({ token, baseUrl }) {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [messageApi, contextHolder] = message.useMessage()

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
        setError(`Failed to fetch data. Details: ${err.message}`);
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
          messageApi.success('Order accepted successfully');
          fetchData(); 
        } else {
          messageApi.error(response.data.message || 'Failed to accept order');
        }
      })
      .catch(error => {
        console.error('Accept order error:', error);
        messageApi.error(error.response?.data?.message || 'Failed to accept order');
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
          messageApi.success('Order rejected successfully');
          fetchData(); // Refresh the data
        } else {
          messageApi.error(response.data.message || 'Failed to reject order');
        }
      })
      .catch(error => {
        console.error('Reject order error:', error);
        messageApi.error(error.response?.data?.message || 'Failed to reject order');
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
          messageApi.success('Order marked as completed');
          fetchData(); 
        } else {
          messageApi.error(response.data.message || 'Failed to complete order');
        }
      })
      .catch(error => {
        console.error('Complete order error:', error);
        messageApi.error(error.response?.data?.message || 'Failed to complete order');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Status',
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
      title: 'Total',
      dataIndex: 'total_price',
      key: 'total_price',
      render: price => `$${Number(price).toFixed(2)}`
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: items => (
        <Text>
          {items.reduce((sum, item) => sum + item.quantity, 0)} items
        </Text>
      )
    },
    {
      title: 'Time',
      dataIndex: 'create_time',
      key: 'create_time',
      render: time => moment(time).format('YYYY-MM-DD HH:mm')
    },
    {
      title: 'Action',
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
                Accept
              </Button>
              <Button 
                size="small" 
                danger 
                onClick={() => handleRejectOrder(record.id)}
                loading={loading}
              >
                Reject
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
              Mark as Completed
            </Button>
          )}
          {(record.status === 'completed' || record.status === 'cancelled') && (
            <Text type="secondary">No actions available</Text>
          )}
        </Space>
      )
    }
  ];

  return (
    <>
    {contextHolder}
      <div style={{ marginBottom: '24px' }}>
        <Space size="large">
          <Card style={{ width: 300 }}>
            <Space size="middle">
              <Avatar 
                size={48} 
                style={{ backgroundColor: '#1890ff' }} 
                icon={<UserOutlined />} 
              />
              <div>
                <Text type="secondary">Today's Orders</Text>
                <Title level={3} style={{ margin: 0 }}>
                  {stats?.todayOrders || '--'}
                </Title>
              </div>
            </Space>
          </Card>
          <Card style={{ width: 300 }}>
            <Space size="middle">
              <Avatar 
                size={48} 
                style={{ backgroundColor: '#52c41a' }} 
                icon={<ShoppingCartOutlined />} 
              />
              <div>
                <Text type="secondary">Today's Revenue</Text>
                <Title level={3} style={{ margin: 0 }}>
                  ${Number(stats?.todayRevenue).toFixed(2) || '--'}
                </Title>
              </div>
            </Space>
          </Card>
          <Card style={{ width: 300 }}>
            <Space size="middle">
              <Badge count={stats?.pendingOrders || 0}>
                <Avatar 
                  size={48} 
                  style={{ backgroundColor: '#faad14' }} 
                  icon={<DashboardOutlined />} 
                />
              </Badge>
              <div>
                <Text type="secondary">Pending Orders</Text>
                <Title level={3} style={{ margin: 0 }}>
                  {stats?.pendingOrders || '--'}
                </Title>
              </div>
            </Space>
          </Card>
        </Space>
      </div>

      <Card 
        title="Recent Orders" 
        extra={
          <Button 
            icon={<SyncOutlined />} 
            loading={loading}
            onClick={fetchData}
          >
            Refresh
          </Button>
        }
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
          pagination={{ pageSize: 5 }}
          expandable={{
            expandedRowRender: record => (
              <div style={{ margin: 0 }}>
                <Title level={5}>Order Items</Title>
                <ul>
                  {record.items.map((item, index) => (
                    <li key={index}>{`#${item.dish_id}`} {item.name} × {item.quantity} @ ￥{Number(item.price).toFixed(2)}</li>
                  ))}
                </ul>
                <Text strong>Total: ￥{Number(record.total_price).toFixed(2)}</Text>
                {record.status === 'pending' && (
                  <div style={{ marginTop: 16 }}>
                    <Countdown 
                      title="Time to accept" 
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