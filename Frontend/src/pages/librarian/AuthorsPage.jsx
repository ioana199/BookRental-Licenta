/*
import { useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, Space, Typography, Popconfirm, message } from 'antd';
import { getAllAuthors, createAuthor, updateAuthor, deleteAuthor } from '../../api/authorApi';

const { Title } = Typography;
const { Search } = Input;

function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [form] = Form.useForm();

  const fetchAuthors = () => {
    setLoading(true);
    getAllAuthors()
      .then((res) => {
        setAuthors(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAuthors(); }, []);

  const handleSearch = (value) => {
    const val = value.toLowerCase();
    setFiltered(
      authors.filter(
        (a) =>
          a.firstName?.toLowerCase().includes(val) ||
          a.lastName?.toLowerCase().includes(val) ||
          a.city?.toLowerCase().includes(val)
      )
    );
  };

  const openCreateModal = () => {
    setEditingAuthor(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (author) => {
    setEditingAuthor(author);
    form.setFieldsValue(author);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const action = editingAuthor
        ? updateAuthor(editingAuthor.id, values)
        : createAuthor(values);

      action
        .then(() => {
          message.success(editingAuthor ? 'Autor actualizat!' : 'Autor creat!');
          setModalOpen(false);
          fetchAuthors();
        })
        .catch(() => message.error('A apărut o eroare!'));
    });
  };

  const handleDelete = (id) => {
    deleteAuthor(id)
      .then(() => {
        message.success('Autor șters!');
        fetchAuthors();
      })
      .catch(() => message.error('A apărut o eroare!'));
  };

  const columns = [
    { title: 'Prenume', dataIndex: 'firstName', key: 'firstName', sorter: (a, b) => a.firstName?.localeCompare(b.firstName) },
    { title: 'Nume', dataIndex: 'lastName', key: 'lastName', sorter: (a, b) => a.lastName?.localeCompare(b.lastName) },
    { title: 'Țară', dataIndex: 'country', key: 'country' },
    { title: 'Oraș', dataIndex: 'city', key: 'city' },
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
          <Title level={3}>Autori</Title>
          <Button type="primary" onClick={openCreateModal}>+ Adaugă autor</Button>
        </Space>
        <Search
          placeholder="Caută după nume sau oraș..."
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
        title={editingAuthor ? 'Editează autor' : 'Adaugă autor'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Salvează"
        cancelText="Anulează"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="firstName" label="Prenume" rules={[{ required: true, message: 'Prenumele este obligatoriu' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Nume" rules={[{ required: true, message: 'Numele este obligatoriu' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Țară">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="Oraș">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AuthorsPage;
*/

import { useEffect, useState } from "react";
import { Table, Input, Button, Modal, Form, Popconfirm, message } from "antd";
import {
  getAllAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../../api/authorApi";
import "../../styles/management.css";

const { Search } = Input;

function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [form] = Form.useForm();

  const fetchAuthors = () => {
    setLoading(true);
    getAllAuthors()
      .then((res) => {
        setAuthors(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleSearch = (value) => {
    const val = value.toLowerCase();
    setFiltered(
      authors.filter(
        (a) =>
          a.firstName?.toLowerCase().includes(val) ||
          a.lastName?.toLowerCase().includes(val) ||
          a.city?.toLowerCase().includes(val),
      ),
    );
  };

  const openCreateModal = () => {
    setEditingAuthor(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (author) => {
    setEditingAuthor(author);
    form.setFieldsValue(author);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const action = editingAuthor
        ? updateAuthor(editingAuthor.id, values)
        : createAuthor(values);

      action
        .then(() => {
          message.success(editingAuthor ? "Autor actualizat!" : "Autor creat!");
          setModalOpen(false);
          fetchAuthors();
        })
        .catch(() => message.error("A apărut o eroare!"));
    });
  };

  const handleDelete = (id) => {
    deleteAuthor(id)
      .then(() => {
        message.success("Autor șters!");
        fetchAuthors();
      })
      .catch(() => message.error("A apărut o eroare!"));
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      render: (id) => <span className="mgmt-mono">{id}</span>,
    },
    {
      title: "Prenume",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a, b) => a.firstName?.localeCompare(b.firstName),
    },
    {
      title: "Nume",
      dataIndex: "lastName",
      key: "lastName",
      sorter: (a, b) => a.lastName?.localeCompare(b.lastName),
    },
    { title: "Țară", dataIndex: "country", key: "country" },
    { title: "Oraș", dataIndex: "city", key: "city" },
    {
      title: "Acțiuni",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            className="mgmt-edit"
            onClick={() => openEditModal(record)}
          >
            Editează
          </Button>
          <Popconfirm
            title="Ești sigur că vrei să ștergi?"
            onConfirm={() => handleDelete(record.id)}
            okText="Da"
            cancelText="Nu"
          >
            <Button type="link" danger style={{ marginLeft: 16 }}>
              Șterge
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="mgmt-page">
      <div className="mgmt-head">
        <h1 className="mgmt-title">Autori</h1>
        <Button type="primary" className="mgmt-add" onClick={openCreateModal}>
          + Adaugă autor
        </Button>
      </div>
      <Search
        placeholder="Caută după nume sau oraș..."
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        className="mgmt-search"
        allowClear
      />
      <div className="mgmt-card">
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title={editingAuthor ? "Editează autor" : "Adaugă autor"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Salvează"
        cancelText="Anulează"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="firstName"
            label="Prenume"
            rules={[{ required: true, message: "Prenumele este obligatoriu" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Nume"
            rules={[{ required: true, message: "Numele este obligatoriu" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Țară">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="Oraș">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AuthorsPage;
