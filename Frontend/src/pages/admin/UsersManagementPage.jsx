import { useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, Space, Typography, Popconfirm, message } from 'antd';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../api/userApi';

const { Title } = Typography;
const { Search } = Input;

function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers()
      .then((res) => {
        setUsers(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = (value) => {
    const val = value.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.firstName?.toLowerCase().includes(val) ||
          u.lastName?.toLowerCase().includes(val) ||
          u.email?.toLowerCase().includes(val)
      )
    );
  };

  const openCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      country: user.address?.country,
      city: user.address?.city,
      street: user.address?.street,
      number: user.address?.number,
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const payload = editingUser ? {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        address: {
          country: values.country,
          city: values.city,
          street: values.street,
          number: values.number,
        },
      } : {
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

      const action = editingUser
        ? updateUser(editingUser.id, payload)
        : createUser(payload);

      action
        .then(() => {
          message.success(editingUser ? 'User actualizat!' : 'User creat!');
          setModalOpen(false);
          fetchUsers();
        })
        .catch(() => message.error('A apărut o eroare!'));
    });
  };

  const handleDelete = (id) => {
    deleteUser(id)
      .then(() => {
        message.success('User șters!');
        fetchUsers();
      })
      .catch(() => message.error('A apărut o eroare!'));
  };

  const columns = [
    { title: 'Prenume', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Nume', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Oraș', dataIndex: ['address', 'city'], key: 'city' },
    {
      title: 'Acțiuni',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>Editează</Button>
          <Popconfirm
            title="Ești sigur că vrei să ștergi?"
            onConfirm={() => handleDelete(record.id)}
            okText="Da"
            cancelText="Nu"
          >
            <Button type="link" danger>Șterge</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Title level={3}>Gestionare useri</Title>
          <Button type="primary" onClick={openCreateModal}>+ Adaugă user</Button>
        </Space>
        <Search
          placeholder="Caută după nume sau email..."
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 400 }}
          allowClear
        />
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Space>

      <Modal
        title={editingUser ? 'Editează user' : 'Adaugă user'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Salvează"
        cancelText="Anulează"
      >
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
          {!editingUser && (
            <Form.Item name="password" label="Parolă" rules={[{ required: true, message: 'Parola este obligatorie' }]}>
              <Input.Password />
            </Form.Item>
          )}
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
        </Form>
      </Modal>
    </div>
  );
}

export default UsersManagementPage;