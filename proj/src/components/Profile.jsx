import { 
  Button,
  Input, 
  Form, 
  message, 
  Image, 
  Select
} from 'antd';
import axios from 'axios';
import { useState } from 'react';

const { Option } = Select;

export default function Profile({ token, baseUrl }) {
  const [form] = Form.useForm();
  const [user, setUser] = useState({});
  const [avatarUrl, setAvatarUrl] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const getUser = () => {
    axios.post(baseUrl+"analyzejwt", { token }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      if (res.data?.data) {
        setUser(res.data.data);
        setAvatarUrl(user.avatar);
        form.setFieldsValue({
          avatar: user.avatar,
          phone: user.phone || "",
          id_number: user.id_number || "",
          oldPassword: "",
          newPassword: "",
          gender: user.gender || "",
          openid: user.openid || "",
          name: user.name || ""
        });
      }
    })
    .catch(() => {
      messageApi.error("Failed to fetch user");
    });
  };

  const onFinish = (values) => {
    axios.post(baseUrl + "updateProfile", values, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      messageApi.success("Profile updated. Please re-login.");
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/login";
      }, 1500);
    })
    .catch(err => {
      messageApi.error(err.response?.data?.message || "Update failed");
    });
  };

  return (
    <>
      <h3>Account Settings</h3>{contextHolder}
      <Button onClick={getUser}>Load User Info (Click 2 times for privacy)</Button>

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        style={{ maxWidth: 400, marginTop: 20 }}
      >

        <Form.Item
          label="OpenID"
          name="openid"
          rules={[{ max: 30 }]}
          required
        >
          <Input.Password maxLength={30} placeholder="OpenID" />
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ max: 30 }]}
          required
        >
          <Input maxLength={30} placeholder="Name" />
        </Form.Item>

        <Form.Item 
          name="gender" 
          label="Gender"
          required
        >
            <Select placeholder="Please choose your prederred gender">
              <Option value="M">Male</Option>
              <Option value="F">Female</Option>
              <Option value="-">Don't want to provide</Option>
            </Select>
          </Form.Item>


        <Form.Item 
          label="Old Password" 
          name="oldPassword" 
          rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!getFieldValue('newPassword') || value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Please input your old password if changing new password'));
            },
          }),
          { max: 30 }
          ]}
        >
          <Input.Password maxLength={30} placeholder="Enter old password if changing" />
        </Form.Item>

        <Form.Item label="New Password" name="newPassword" rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('oldPassword')) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Please input old password first'));
            },
          }),
          { max: 30 }
        ]}>
          <Input.Password maxLength={30} placeholder="Enter new password" />
        </Form.Item>

        <Form.Item
          label="Phone Number(you can choose to keep here empty)"
          name="phone"
          rules={[{ max: 11 }]}
        >
          <Input.Password maxLength={11} placeholder="Phone number" />
        </Form.Item>

        <Form.Item
          label="ID Number(you can choose to keep here empty)"
          name="id_number"
          rules={[{ max: 18 }]}
        >
          <Input.Password maxLength={18} placeholder="ID Number" />
        </Form.Item>

        <Form.Item label="Avatar URL(you can choose to keep here empty)" name="avatar" rules={[{ max: 500 }]}>
          <Input
            placeholder="Enter avatar image URL"
            maxLength={500}
            onChange={e => setAvatarUrl(e.target.value)}
          />
        </Form.Item>

        {avatarUrl && (
          <Form.Item label="Avatar Preview">
            <Image src={avatarUrl} width={100} height={100} alt="Avatar" />
          </Form.Item>
        )}

        <Button type="primary" htmlType="submit">Update Profile</Button>
      </Form>
    </>
  );
}
