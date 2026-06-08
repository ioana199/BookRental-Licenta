import { useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, Space, Typography, Popconfirm, message } from 'antd';
import { getAllLibraries, createLibrary, updateLibrary, deleteLibrary } from '../../api/libraryApi';

const { Title } = Typography;
const { Search } = Input;

function LibrariesManagementPage() {
  const [libraries, setLibraries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLibrary, setEditingLibrary] = useState(null);
  const [form] = Form.useForm();

  const fetchLibraries = () => {
    setLoading(true);
    getAllLibraries()
      .then((res) => {
        setLibraries(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLibraries(); }, []);

  const handleSearch = (value) => {
    const val = value.toLowerCase();
    setFiltered(
      libraries.filter(
        (l) =>
          l.name?.toLowerCase().includes(val) ||
          l.city?.toLowerCase().includes(val) ||
          l.email?.toLowerCase().includes(val)
      )
    );
  };

  const openCreateModal = () => {
    setEditingLibrary(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (library) => {
    setEditingLibrary(library);
    form.setFieldsValue({
      name: library.name,
      city: library.city,
      email: library.email,
      phoneNumber: library.phoneNumber,
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const action = editingLibrary
        ? updateLibrary(editingLibrary.id, values)
        : createLibrary(values);

      action
        .then(() => {
          message.success(editingLibrary ? 'Bibliotecă actualizată!' : 'Bibliotecă creată!');
          setModalOpen(false);
          fetchLibraries();
        })
        .catch(() => message.error('A apărut o eroare!'));
    });
  };

  const handleDelete = (id) => {
    deleteLibrary(id)
      .then(() => {
        message.success('Bibliotecă ștearsă!');
        fetchLibraries();
      })
      .catch(() => message.error('A apărut o eroare!'));
  };

  const columns = [
    { title: 'Nume', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name?.localeCompare(b.name) },
    { title: 'Oraș', dataIndex: 'city', key: 'city' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Telefon', dataIndex: 'phoneNumber', key: 'phoneNumber' },
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
          <Title level={3}>Gestionare biblioteci</Title>
          <Button type="primary" onClick={openCreateModal}>+ Adaugă bibliotecă</Button>
        </Space>
        <Search
          placeholder="Caută după nume, oraș sau email..."
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
        title={editingLibrary ? 'Editează bibliotecă' : 'Adaugă bibliotecă'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Salvează"
        cancelText="Anulează"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Nume" rules={[{ required: true, message: 'Numele este obligatoriu' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="city" label="Oraș" rules={[{ required: true, message: 'Orașul este obligatoriu' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email-ul este obligatoriu' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Telefon" rules={[{ required: true, message: 'Telefonul este obligatoriu' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default LibrariesManagementPage;