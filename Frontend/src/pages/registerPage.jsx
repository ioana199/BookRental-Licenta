import { useState } from 'react';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import { createUser } from '../api/userApi';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        address: {
          country: values.country,
          city: values.city,
          street: values.street,
          number: values.number,
        },
      };
      createUser(payload)
        .then(() => {
          message.success('Cont creat cu succes! Te poți autentifica acum.');
          setTimeout(() => navigate('/'), 2000);
        })
        .catch(() => message.error('A apărut o eroare! Email-ul poate fi deja folosit.'))
        .finally(() => setLoading(false));
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f0eb',
      padding: '24px',
    }}>
      <Card style={{ width: '100%', maxWidth: 500, borderRadius: '12px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '40px' }}>📚</div>
          <Title level={3} style={{ marginBottom: 0 }}>BookRental</Title>
          <Text type="secondary">Creează un cont nou</Text>
        </div>

        <Form form={form} layout="vertical">
          <Form.Item name="firstName" label="Prenume">
            <Input placeholder="ex: Ioan" />
          </Form.Item>
          <Form.Item name="lastName" label="Nume">
            <Input placeholder="ex: Popescu" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email-ul este obligatoriu' }, { type: 'email', message: 'Email invalid' }]}>
            <Input placeholder="ex: ioan@gmail.com" />
          </Form.Item>
          <Form.Item name="password" label="Parolă" rules={[{ required: true, message: 'Parola este obligatorie' }, { min: 6, message: 'Minimum 6 caractere' }]}>
            <Input.Password placeholder="Minimum 6 caractere" />
          </Form.Item>
          <Form.Item name="country" label="Țară" rules={[{ required: true, message: 'Țara este obligatorie' }]}>
            <Input placeholder="ex: Romania" />
          </Form.Item>
          <Form.Item name="city" label="Oraș" rules={[{ required: true, message: 'Orașul este obligatoriu' }]}>
            <Input placeholder="ex: Cluj-Napoca" />
          </Form.Item>
          <Form.Item name="street" label="Stradă">
            <Input placeholder="ex: Strada Florilor" />
          </Form.Item>
          <Form.Item name="number" label="Număr">
            <Input placeholder="ex: 10" />
          </Form.Item>

          <Button type="primary" block onClick={handleSubmit} loading={loading} style={{ marginBottom: '12px' }}>
            Creează cont
          </Button>
          <Button block onClick={() => navigate('/')}>
            Înapoi la login
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default RegisterPage;