/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Form, 
  Input, 
  Switch, 
  Button, 
  message, 
  Spin 
} from "antd";

export default function Settings({ token, baseUrl }){
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage()

  const fetchSettings = () => {
    setLoading(true);
    axios.get(baseUrl + "getSettings", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      const initialValues = {};
      res.data.data.forEach(({ key_name, value }) => {
        if (value === "true") {
          initialValues[key_name] = true;
        } else if (value === "false") {
          initialValues[key_name] = false;
        } else {
          initialValues[key_name] = value;
        }
      });
      form.setFieldsValue(initialValues);
    })
    .catch(error => {
      console.error(error);
      messageApi.error("Failed to fetch settings, try RELOGIN");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const onFinish = (values) => {
    axios.post(baseUrl + "updateSettings", values, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      messageApi.success("Settings updated successfully.");
      fetchSettings(); // refresh
    })
    .catch(error => {
      console.error(error);
      messageApi.error("Failed to update settings.");
    });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div>
      {contextHolder}
      <h2>System Settings</h2>
      {loading ? (
        <Spin />
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Shop Name" name="shop_name">
            <Input />
          </Form.Item>

          <Form.Item label="Default Category ID" name="default_category">
            <Input disabled/>
          </Form.Item>

          <Form.Item
            label="Auto Accept Orders"
            name="auto_accept_order"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item label="Customer Service Phone" name="customer_service_phone">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};