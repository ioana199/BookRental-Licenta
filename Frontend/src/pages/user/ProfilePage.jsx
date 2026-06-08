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