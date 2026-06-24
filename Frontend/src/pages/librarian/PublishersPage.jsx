/*
import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  Space,
  Typography,
  Popconfirm,
  message,
} from "antd";
import {
  getAllPublishers,
  createPublisher,
  updatePublisher,
  deletePublisher,
} from "../../api/publisherApi";

const { Title } = Typography;
const { Search } = Input;

function PublishersPage() {
  const [publishers, setPublishers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [form] = Form.useForm();

  const fetchPublishers = () => {
    setLoading(true);
    getAllPublishers()
      .then((res) => {
        setPublishers(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  const handleSearch = (value) => {
    const val = value.toLowerCase();
    setFiltered(
      publishers.filter(
        (p) =>
          p.name?.toLowerCase().includes(val) ||
          p.email?.toLowerCase().includes(val) ||
          p.city?.toLowerCase().includes(val),
      ),
    );
  };

  const openCreateModal = () => {
    setEditingPublisher(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (publisher) => {
    setEditingPublisher(publisher);
    form.setFieldsValue(publisher);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const action = editingPublisher
        ? updatePublisher(editingPublisher.id, values)
        : createPublisher(values);

      action
        .then(() => {
          message.success(
            editingPublisher ? "Editură actualizată!" : "Editură creată!",
          );
          setModalOpen(false);
          fetchPublishers();
        })
        .catch(() => message.error("A apărut o eroare!"));
    });
  };

  const handleDelete = (id) => {
    deletePublisher(id)
      .then(() => {
        message.success("Publisher șters!");
        fetchPublishers();
      })
      .catch(() => message.error("A apărut o eroare!"));
  };

  const columns = [
    {
      title: "Nume",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Țară", dataIndex: "country", key: "country" },
    { title: "Oraș", dataIndex: "city", key: "city" },
    {
      title: "Acțiuni",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            Editează
          </Button>
          <Popconfirm
            title="Ești sigur că vrei să ștergi?"
            onConfirm={() => handleDelete(record.id)}
            okText="Da"
            cancelText="Nu"
          >
            <Button type="link" danger>
              Șterge
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <Title level={3}>Edituri</Title>
          <Button type="primary" onClick={openCreateModal}>
            + Adaugă editură
          </Button>
        </Space>
        <Search
          placeholder="Caută după nume, email sau oraș..."
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
        title={editingPublisher ? "Editează editură" : "Adaugă editură"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Salvează"
        cancelText="Anulează"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nume"
            rules={[{ required: true, message: "Numele este obligatoriu" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Email-ul este obligatoriu" }]}
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

export default PublishersPage;
*/

import { useEffect, useState } from "react";
import { Table, Input, Button, Modal, Form, Popconfirm, message } from "antd";
import {
  getAllPublishers,
  createPublisher,
  updatePublisher,
  deletePublisher,
} from "../../api/publisherApi";
import "../../styles/management.css";

const { Search } = Input;

function PublishersPage() {
  const [publishers, setPublishers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [form] = Form.useForm();

  const fetchPublishers = () => {
    setLoading(true);
    getAllPublishers()
      .then((res) => {
        setPublishers(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  const handleSearch = (value) => {
    const val = value.toLowerCase();
    setFiltered(
      publishers.filter(
        (p) =>
          p.name?.toLowerCase().includes(val) ||
          p.email?.toLowerCase().includes(val) ||
          p.city?.toLowerCase().includes(val),
      ),
    );
  };

  const openCreateModal = () => {
    setEditingPublisher(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (publisher) => {
    setEditingPublisher(publisher);
    form.setFieldsValue(publisher);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const action = editingPublisher
        ? updatePublisher(editingPublisher.id, values)
        : createPublisher(values);

      action
        .then(() => {
          message.success(
            editingPublisher ? "Editură actualizată!" : "Editură creată!",
          );
          setModalOpen(false);
          fetchPublishers();
        })
        .catch(() => message.error("A apărut o eroare!"));
    });
  };

  const handleDelete = (id) => {
    deletePublisher(id)
      .then(() => {
        message.success("Editură ștearsă!");
        fetchPublishers();
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
      title: "Nume",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <span className="mgmt-email">{email}</span>,
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
        <h1 className="mgmt-title">Edituri</h1>
        <Button type="primary" className="mgmt-add" onClick={openCreateModal}>
          + Adaugă editură
        </Button>
      </div>
      <Search
        placeholder="Caută după nume, email sau oraș..."
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
        title={editingPublisher ? "Editează editură" : "Adaugă editură"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Salvează"
        cancelText="Anulează"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nume"
            rules={[{ required: true, message: "Numele este obligatoriu" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Email-ul este obligatoriu" }]}
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

export default PublishersPage;
