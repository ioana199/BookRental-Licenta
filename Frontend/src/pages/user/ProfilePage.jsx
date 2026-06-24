/*
import { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, message, Card, Space, Popconfirm } from 'antd';
import { useKeycloak } from '@react-keycloak/web';
import { getUserById, updateUser, deleteUser, getAllUsers } from '../../api/userApi';

const { Title } = Typography;

function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [form] = Form.useForm();
  const { keycloak } = useKeycloak();

  //const userId = keycloak.tokenParsed?.user_id;
  const [userId, setUserId] = useState(null);

 useEffect(() => {
  const email = keycloak.tokenParsed?.email;
  if (email) {
    getAllUsers().then((res) => {
      const user = res.data.find((u) => u.email === email);
      if (user) {
        setUser(user);
        setUserId(user.id);
        form.setFieldsValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          country: user.address?.country,
          city: user.address?.city,
          street: user.address?.street,
          number: user.address?.number,
        });
      }
    });
  }
}, []);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        address: {
          country: values.country,
          city: values.city,
          street: values.street,
          number: values.number,
        },
      };
      updateUser(userId, payload)
        .then(() => message.success('Profil actualizat!'))
        .catch(() => message.error('A apărut o eroare!'))
        .finally(() => setLoading(false));
    });
  };

  const handleDelete = () => {
    deleteUser(userId)
      .then(() => {
        message.success('Cont șters!');
        keycloak.logout();
      })
      .catch(() => message.error('A apărut o eroare!'));
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>Profilul meu</Title>
      <Card style={{ maxWidth: 600 }}>
        <Form form={form} layout="vertical">
          <Form.Item name="firstName" label="Prenume">
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Nume">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email-ul este obligatoriu' }]}>
            <Input />
          </Form.Item>
          <Title level={5}>Adresă</Title>
          <Form.Item name="country" label="Țară">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="Oraș">
            <Input />
          </Form.Item>
          <Form.Item name="street" label="Stradă">
            <Input />
          </Form.Item>
          <Form.Item name="number" label="Număr">
            <Input />
          </Form.Item>
          <Space>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Salvează modificările
            </Button>
            <Popconfirm
              title="Ești sigur că vrei să ștergi contul?"
              onConfirm={handleDelete}
              okText="Da"
              cancelText="Nu"
            >
              <Button danger>Șterge cont</Button>
            </Popconfirm>
          </Space>
        </Form>
      </Card>
    </div>
  );
}

export default ProfilePage;
*/

import { useEffect, useState } from "react";
import { Form, Input, Button, message, Popconfirm } from "antd";
import { useKeycloak } from "@react-keycloak/web";
import { updateUser, deleteUser, getAllUsers } from "../../api/userApi";
import "./ProfilePage.css";

function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [form] = Form.useForm();
  const { keycloak } = useKeycloak();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const email = keycloak.tokenParsed?.email;
    if (email) {
      getAllUsers().then((res) => {
        const found = res.data.find((u) => u.email === email);
        if (found) {
          setUser(found);
          setUserId(found.id);
          form.setFieldsValue({
            firstName: found.firstName,
            lastName: found.lastName,
            email: found.email,
            country: found.address?.country,
            city: found.address?.city,
            street: found.address?.street,
            number: found.address?.number,
          });
        }
      });
    }
  }, []);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        address: {
          country: values.country,
          city: values.city,
          street: values.street,
          number: values.number,
        },
      };
      updateUser(userId, payload)
        .then(() => message.success("Profil actualizat!"))
        .catch(() => message.error("A apărut o eroare!"))
        .finally(() => setLoading(false));
    });
  };

  const handleDelete = () => {
    deleteUser(userId)
      .then(() => {
        message.success("Cont șters!");
        keycloak.logout();
      })
      .catch(() => message.error("A apărut o eroare!"));
  };

  const initials =
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() ||
    "··";
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  return (
    <div className="profile-page br-page">
      <div className="profile-head">
        <div className="br-eyebrow">Contul tău</div>
        <h1 className="br-title">Profilul meu</h1>
      </div>

      <div className="profile-grid">
        {/* Card identitate */}
        <aside className="profile-identity">
          <div className="profile-identity__avatar">{initials}</div>
          <div className="profile-identity__name">
            {fullName || "Utilizator"}
          </div>
          <div className="profile-identity__email">{user?.email}</div>

          <div className="profile-identity__divider"></div>

          <div className="profile-identity__rows">
            {user?.address?.city && (
              <div className="profile-identity__row">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>
                  {user.address.city}
                  {user.address.country ? `, ${user.address.country}` : ""}
                </span>
              </div>
            )}
            <div className="profile-identity__row">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <span>{user?.email}</span>
            </div>
          </div>
        </aside>

        {/* Formular */}
        <div className="profile-form-card">
          <Form form={form} layout="vertical" className="profile-form">
            <h2 className="profile-section-title">Date personale</h2>
            <div className="profile-row">
              <Form.Item name="firstName" label="Prenume">
                <Input />
              </Form.Item>
              <Form.Item name="lastName" label="Nume">
                <Input />
              </Form.Item>
            </div>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Email-ul este obligatoriu" }]}
            >
              <Input />
            </Form.Item>

            <h2 className="profile-section-title profile-section-title--spaced">
              Adresă
            </h2>
            <div className="profile-row">
              <Form.Item name="country" label="Țară">
                <Input />
              </Form.Item>
              <Form.Item name="city" label="Oraș">
                <Input />
              </Form.Item>
              <Form.Item name="street" label="Stradă">
                <Input />
              </Form.Item>
              <Form.Item name="number" label="Număr">
                <Input />
              </Form.Item>
            </div>

            <div className="profile-actions">
              <Button
                type="primary"
                className="btn-primary"
                onClick={handleSubmit}
                loading={loading}
              >
                Salvează modificările
              </Button>
              <Popconfirm
                title="Ești sigur că vrei să ștergi contul?"
                onConfirm={handleDelete}
                okText="Da"
                cancelText="Nu"
              >
                <Button className="btn-danger" danger>
                  Șterge cont
                </Button>
              </Popconfirm>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
