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
import { useTranslation } from 'react-i18next';

const { Option } = Select;

export default function Profile({ token, baseUrl }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [user, setUser] = useState({});
  const [avatarUrl, setAvatarUrl] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const getUser = () => {
    axios.post(baseUrl + "analyzejwt", { token }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      if (res.data?.data) {
        setUser(res.data.data);
        setAvatarUrl(res.data.data.avatar);
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
      messageApi.error(t("profile.fetchUserError"));
    });
  };

  const onFinish = (values) => {
    axios.post(baseUrl + "updateProfile", values, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      messageApi.success(t("profile.updateSuccess"));
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/login";
      }, 1500);
    })
    .catch(err => {
      messageApi.error(err.response?.data?.message || t("profile.updateFail"));
    });
  };

  return (
    <>
      <h3>{t("profile.accountSettings")}</h3>{contextHolder}
      <Button onClick={getUser}>{t("profile.loadUserInfo")}</Button>

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        style={{ maxWidth: 400, marginTop: 20 }}
      >

        <Form.Item label={t("profile.openid")} name="openid" rules={[{ max: 30 }]} required>
          <Input.Password maxLength={30} placeholder={t("profile.openidPlaceholder")} />
        </Form.Item>

        <Form.Item label={t("profile.name")} name="name" rules={[{ max: 30 }]} required>
          <Input maxLength={30} placeholder={t("profile.namePlaceholder")} />
        </Form.Item>

        <Form.Item name="gender" label={t("profile.gender")} required>
          <Select placeholder={t("profile.genderPlaceholder")}>
            <Option value="M">{t("profile.genderMale")}</Option>
            <Option value="F">{t("profile.genderFemale")}</Option>
            <Option value="-">{t("profile.genderOther")}</Option>
          </Select>
        </Form.Item>

        <Form.Item 
          label={t("profile.oldPassword")} 
          name="oldPassword" 
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!getFieldValue('newPassword') || value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t("profile.oldPasswordValidation")));
              },
            }),
            { max: 30 }
          ]}
        >
          <Input.Password maxLength={30} placeholder={t("profile.oldPasswordPlaceholder")} />
        </Form.Item>

        <Form.Item 
          label={t("profile.newPassword")} 
          name="newPassword" 
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('oldPassword')) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t("profile.newPasswordValidation")));
              },
            }),
            { max: 30 }
          ]}
        >
          <Input.Password maxLength={30} placeholder={t("profile.newPasswordPlaceholder")} />
        </Form.Item>

        <Form.Item label={t("profile.phone")} name="phone" rules={[{ max: 11 }]}>
          <Input.Password maxLength={11} placeholder={t("profile.phonePlaceholder")} />
        </Form.Item>

        <Form.Item label={t("profile.idNumber")} name="id_number" rules={[{ max: 18 }]}>
          <Input.Password maxLength={18} placeholder={t("profile.idNumberPlaceholder")} />
        </Form.Item>

        <Form.Item label={t("profile.avatar")} name="avatar" rules={[{ max: 500 }]}>
          <Input
            placeholder={t("profile.avatarPlaceholder")}
            maxLength={500}
            onChange={e => setAvatarUrl(e.target.value)}
          />
        </Form.Item>

        {avatarUrl && (
          <Form.Item label={t("profile.avatarPreview")}>
            <Image src={avatarUrl} width={100} height={100} alt="Avatar" />
          </Form.Item>
        )}

        <Button type="primary" htmlType="submit">{t("profile.updateProfile")}</Button>
      </Form>
    </>
  );
}
