/* eslint-disable react-hooks/exhaustive-deps */
import {
  Card, Collapse, InputNumber, Button, message, Image,
  Modal, List, Typography
} from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const { Panel } = Collapse;
const { Text } = Typography;

export default function OrderPage({ token, baseUrl }) {
  const { t } = useTranslation();
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [myOrders, setMyOrders] = useState([]);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = () => {
    setLoading(true);
    
    Promise.all([
      axios.get(`${baseUrl}getFoodLst`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageSize: 100 }
      }),
      axios.get(`${baseUrl}getAvailableCategories`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])
    .then(([dishRes, catRes]) => {
      setDishes(dishRes.data.data || []);
      setCategories(catRes.data.data || []);
    })
    .catch(() => {
      messageApi.error(t("order.message.loadFail"));
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const fetchMyOrders = () => {
    axios.get(`${baseUrl}getMyOrders`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setMyOrders(res.data.orders || []);
    })
    .catch(() => {
      messageApi.error(t("order.message.loadMyOrdersFail"));
    });
  };

  const handleQuantityChange = (dishId, value) => {
    setQuantities({ ...quantities, [dishId]: value });
  };

  const handleOrder = () => {
    const items = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const dish = dishes.find(d => d.id === parseInt(id));
        return {
          dish_id: parseInt(id),
          quantity: qty,
          price: dish.price
        };
      });

    if (items.length === 0) {
      return messageApi.warning(t("order.message.noDishesSelected"));
    }

    axios.post(`${baseUrl}createOrder`, { items }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      messageApi.success(t("order.message.orderSuccess"));
      setQuantities({});
      fetchMyOrders(); 
    })
    .catch(() => {
      messageApi.error(t("order.message.orderFail"));
    });
  };

  useEffect(() => {
    fetchData();
    fetchMyOrders();
  }, []);

  const renderDishGroup = (categoryId) => {
    const dishList = dishes.filter(d => d.category_id === categoryId && d.status === 1);
    if (dishList.length === 0) return <div style={{ paddingLeft: 16 }}>{t("order.collapse.noDishes")}</div>;

    return dishList.map(dish => (
      <div
        key={dish.id}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderBottom: '1px solid #f0f0f0'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flex: '1 1 70%'
        }}>
          {dish.image ? (
            <Image
              width={70}
              src={dish.image}
              alt={dish.name}
              fallback="https://via.placeholder.com/300x200?text=Failed_to_load_picture"
              style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, backgroundColor: '#f6f6f6' }}
            />
          ) : (
            <span>{t("order.collapse.noDishes")}</span>
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontWeight: 500,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              maxWidth: '200px'
            }}>
              {dish.name}
            </div>
            <div style={{ color: '#999' }}>￥{Number(dish.price).toFixed(2)}</div>
          </div>
        </div>

        <div style={{
          marginTop: 8,
          flex: '1 1 30%',
          display: 'flex',
          justifyContent: 'flex-end',
          minWidth: 100
        }}>
          <InputNumber
            min={0}
            value={quantities[dish.id] || 0}
            onChange={(value) => handleQuantityChange(dish.id, value)}
          />
        </div>
      </div>
    ));
  };

  return (
    <>
      {contextHolder}

      <Card
        title={t("order.title")}
        loading={loading}
        extra={
          <div style={{ display: 'flex', gap: 12 }}>
            <Button onClick={() => {
              fetchMyOrders();
              setOrderModalVisible(true);
            }}>
              {t("order.button.myOrders")}
            </Button>
            <Button type="primary" onClick={handleOrder}>
              {t("order.button.submit")}
            </Button>
          </div>
        }
      >
        <Collapse accordion>
          {categories.map(cat => (
            <Panel header={`${cat.name}`} key={cat.id}>
              {renderDishGroup(cat.id)}
            </Panel>
          ))}
        </Collapse>
      </Card>

      <Modal
        open={orderModalVisible}
        title={t("order.modal.title")}
        onCancel={() => setOrderModalVisible(false)}
        footer={null}
        width={600}
        styles={{
          body: {
            maxHeight: '75vh',
            overflowY: 'auto',
            padding: '0 24px'
          }
        }}
      >
        <List
          itemLayout="vertical"
          dataSource={myOrders}
          renderItem={order => (
            <List.Item key={order.id}>
              <Text strong>{t("order.orderItem.orderId")}{order.id}</Text> - {order.status.toUpperCase()} - ￥{Number(order.total_price).toFixed(2)} <br />
              <Text type="secondary">{t("order.modal.created")}: {moment(order.create_time).format("YYYY-MM-DD HH:mm:ss")}</Text>
              <ul style={{ marginTop: 8 }}>
                {order.items.map((item, idx) => (
                  <li key={idx}>{`#${item.dish_id}`} {item.name} × {item.quantity} @ ￥{Number(item.price).toFixed(2)}</li>
                ))}
              </ul>
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
}