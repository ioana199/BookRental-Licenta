import { useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, Space, Typography, Popconfirm, message, Select } from 'antd';
import { getAllLibrarians, createLibrarian, updateLibrarian, deleteLibrarian } from '../../api/librarianApi';
import { getAllLibraries } from '../../api/libraryApi';

const { Title } = Typography;
const { Search } = Input;

function LibrariansManagementPage() {
  const [librarians, setLibrarians] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLibrarian, setEditingLibrarian] = useState(null);
  const [form] = Form.useForm();

  const fetchLibrarians = () => {
    setLoading(true);
    getAllLibrarians()
      .then((res) => {
        setLibrarians(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLibrarians();
    getAllLibraries().then((res) => setLibraries(res.data));
  }, []);

  const handleSearch = (value) => {
    const val = value.toLowerCase();
    setFiltered(
      librarians.filter(
        (l) =>
          l.firstName?.toLowerCase().includes(val) ||
          l.lastName?.toLowerCase().includes(val) ||
          l.email?.toLowerCase().includes(val)
      )
    );
  };

  const openCreateModal = () => {
    setEditingLibrarian(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (librarian) => {
    setEditingLibrarian(librarian);
    form.setFieldsValue({
      firstName: librarian.firstName,
      lastName: librarian.lastName,
      email: librarian.email,
      libraryId: librarian.libraryId,
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const action = editingLibrarian
        ? updateLibrarian(editingLibrarian.id, {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            libraryId: values.libraryId,
          })
        : createLibrarian(values.libraryId, {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
          });

      action
        .then(() => {
          message.success(editingLibrarian ? 'Librarian actualizat!' : 'Librarian creat!');
          setModalOpen(false);
          fetchLibrarians();
        })
        .catch(() => message.error('A apărut o eroare!'));
    });
  };

  const handleDelete = (id) => {
    deleteLibrarian(id)
      .then(() => {
        message.success('Librarian șters!');
        fetchLibrarians();
      })
      .catch(() => message.error('A apărut o eroare!'));
  };

  const columns = [
    { title: 'Prenume', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Nume', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Bibliotecă',
      dataIndex: 'libraryId',
      key: 'libraryId',
      render: (libraryId) => libraries.find((l) => l.id === libraryId)?.name || libraryId,
    },
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
          <Title level={3}>Gestionare librarians</Title>
          <Button type="primary" onClick={openCreateModal}>+ Adaugă librarian</Button>
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
        title={editingLibrarian ? 'Editează librarian' : 'Adaugă librarian'}
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
          {!editingLibrarian && (
            <Form.Item name="password" label="Parolă" rules={[{ required: true, message: 'Parola este obligatorie' }]}>
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item name="libraryId" label="Bibliotecă" rules={[{ required: true, message: 'Selectează o bibliotecă' }]}>
            <Select
              placeholder="Selectează biblioteca"
              options={libraries.map((l) => ({ value: l.id, label: `${l.name} - ${l.city}` }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default LibrariansManagementPage;