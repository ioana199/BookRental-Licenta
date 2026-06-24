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
  Select,
  DatePicker,
} from "antd";
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../../api/bookApi";
import { getAllAuthors } from "../../api/authorApi";
import { getAllPublishers } from "../../api/publisherApi";
import dayjs from "dayjs";

const { Title } = Typography;
const { Search } = Input;

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [form] = Form.useForm();

  const fetchBooks = () => {
    setLoading(true);
    getAllBooks()
      .then((res) => {
        setBooks(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
    getAllAuthors().then((res) => setAuthors(res.data));
    getAllPublishers().then((res) => setPublishers(res.data));
  }, []);

  const handleSearch = (value) => {
    const val = value.toLowerCase();
    setFiltered(
      books.filter(
        (b) =>
          b.title?.toLowerCase().includes(val) ||
          b.isbn?.toLowerCase().includes(val) ||
          b.author?.firstName?.toLowerCase().includes(val) ||
          b.author?.lastName?.toLowerCase().includes(val),
      ),
    );
  };

  const openCreateModal = () => {
    setEditingBook(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    form.setFieldsValue({
      title: book.title,
      isbn: book.ISBN,
      imageUrl: book.imageUrl,
      genres: book.genres || [],
      publicationDate: book.publicationDate
        ? dayjs(book.publicationDate)
        : null,
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const payload = {
        title: values.title,
        ISBN: values.isbn,
        imageUrl: values.imageUrl,
        genres: values.genres || [],
        publicationDate: values.publicationDate
          ? values.publicationDate.format("YYYY-MM-DD")
          : null,
      };

      const action = editingBook
        ? updateBook(editingBook.id, payload)
        : createBook(values.authorId, values.publisherId, payload);

      action
        .then(() => {
          message.success(editingBook ? "Carte actualizată!" : "Carte creată!");
          setModalOpen(false);
          fetchBooks();
        })
        .catch(() => message.error("A apărut o eroare!"));
    });
  };

  const handleDelete = (id) => {
    deleteBook(id)
      .then(() => {
        message.success("Carte ștearsă!");
        fetchBooks();
      })
      .catch(() => message.error("A apărut o eroare!"));
  };

  const columns = [
    {
      title: "Titlu",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title?.localeCompare(b.title),
    },
    { title: "ISBN", dataIndex: "ISBN", key: "ISBN" },
    {
      title: "Data publicării",
      dataIndex: "publicationDate",
      key: "publicationDate",
    },
    {
      title: "Autor",
      key: "author",
      render: (_, record) =>
        `${record.authorFirstName || ""} ${record.authorLastName || ""}`,
    },
    { title: "Editură", dataIndex: "publisherName", key: "publisherName" },
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
          <Title level={3}>Cărți</Title>
          <Button type="primary" onClick={openCreateModal}>
            + Adaugă carte
          </Button>
        </Space>
        <Search
          placeholder="Caută după titlu, ISBN sau autor..."
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
        title={editingBook ? "Editează carte" : "Adaugă carte"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Salvează"
        cancelText="Anulează"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Titlu"
            rules={[{ required: true, message: "Titlul este obligatoriu" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="isbn" label="ISBN">
            <Input />
          </Form.Item>
          <Form.Item name="imageUrl" label="URL Copertă">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="genres" label="Genuri">
            <Select
              mode="multiple"
              placeholder="Selectează genuri"
              options={[
                { value: "ROMAN", label: "Roman" },
                { value: "SF", label: "SF" },
                { value: "THRILLER", label: "Thriller" },
                { value: "MISTER", label: "Mister" },
                { value: "FANTASY", label: "Fantasy" },
                { value: "BIOGRAFIE", label: "Biografie" },
                { value: "ISTORIE", label: "Istorie" },
                { value: "POEZIE", label: "Poezie" },
                { value: "DRAMA", label: "Dramă" },
                { value: "COMEDIE", label: "Comedie" },
                { value: "HORROR", label: "Horror" },
                { value: "ROMANCE", label: "Romance" },
                { value: "COPII", label: "Copii" },
                { value: "EDUCATIE", label: "Educație" },
                { value: "STIINTA", label: "Știință" },
              ]}
            />
          </Form.Item>

          <Form.Item name="publicationDate" label="Data publicării">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          {!editingBook && (
            <>
              <Form.Item
                name="authorId"
                label="Autor"
                rules={[
                  { required: true, message: "Autorul este obligatoriu" },
                ]}
              >
                <Select
                  placeholder="Selectează autor"
                  options={authors.map((a) => ({
                    value: a.id,
                    label: `${a.firstName} ${a.lastName}`,
                  }))}
                />
              </Form.Item>
              <Form.Item
                name="publisherId"
                label="Editura"
                rules={[
                  { required: true, message: "Editura este obligatorie" },
                ]}
              >
                <Select
                  placeholder="Selectează editura"
                  options={publishers.map((p) => ({
                    value: p.id,
                    label: p.name,
                  }))}
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default BooksPage;
*/
import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  Popconfirm,
  message,
  Select,
  DatePicker,
} from "antd";
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../../api/bookApi";
import { getAllAuthors } from "../../api/authorApi";
import { getAllPublishers } from "../../api/publisherApi";
import dayjs from "dayjs";
import "../../styles/management.css";

const { Search } = Input;

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [form] = Form.useForm();

  const fetchBooks = () => {
    setLoading(true);
    getAllBooks()
      .then((res) => {
        setBooks(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
    getAllAuthors().then((res) => setAuthors(res.data));
    getAllPublishers().then((res) => setPublishers(res.data));
  }, []);

  const handleSearch = (value) => {
    const val = value.toLowerCase();
    setFiltered(
      books.filter(
        (b) =>
          b.title?.toLowerCase().includes(val) ||
          b.ISBN?.toLowerCase().includes(val) ||
          b.authorFirstName?.toLowerCase().includes(val) ||
          b.authorLastName?.toLowerCase().includes(val),
      ),
    );
  };

  const openCreateModal = () => {
    setEditingBook(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    form.setFieldsValue({
      title: book.title,
      isbn: book.ISBN,
      imageUrl: book.imageUrl,
      genres: book.genres || [],
      publicationDate: book.publicationDate
        ? dayjs(book.publicationDate)
        : null,
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const payload = {
        title: values.title,
        ISBN: values.isbn,
        imageUrl: values.imageUrl,
        genres: values.genres || [],
        publicationDate: values.publicationDate
          ? values.publicationDate.format("YYYY-MM-DD")
          : null,
      };

      const action = editingBook
        ? updateBook(editingBook.id, payload)
        : createBook(values.authorId, values.publisherId, payload);

      action
        .then(() => {
          message.success(editingBook ? "Carte actualizată!" : "Carte creată!");
          setModalOpen(false);
          fetchBooks();
        })
        .catch(() => message.error("A apărut o eroare!"));
    });
  };

  const handleDelete = (id) => {
    deleteBook(id)
      .then(() => {
        message.success("Carte ștearsă!");
        fetchBooks();
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
      title: "Titlu",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title?.localeCompare(b.title),
      render: (title) => <span style={{ fontWeight: 500 }}>{title}</span>,
    },
    {
      title: "ISBN",
      dataIndex: "ISBN",
      key: "ISBN",
      render: (v) => <span className="mgmt-mono">{v}</span>,
    },
    {
      title: "Data publicării",
      dataIndex: "publicationDate",
      key: "publicationDate",
      render: (v) => <span className="mgmt-mono">{v}</span>,
    },
    {
      title: "Autor",
      key: "author",
      render: (_, record) =>
        `${record.authorFirstName || ""} ${record.authorLastName || ""}`,
    },
    { title: "Editură", dataIndex: "publisherName", key: "publisherName" },
    {
      title: "Acțiuni",
      key: "actions",
      render: (_, record) => (
        <div className="mgmt-actions">
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
            <Button type="link" danger>
              Șterge
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="mgmt-page">
      <div className="mgmt-head">
        <h1 className="mgmt-title">Cărți</h1>
        <Button type="primary" className="mgmt-add" onClick={openCreateModal}>
          + Adaugă carte
        </Button>
      </div>
      <Search
        placeholder="Caută după titlu, ISBN sau autor..."
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
        title={editingBook ? "Editează carte" : "Adaugă carte"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Salvează"
        cancelText="Anulează"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Titlu"
            rules={[{ required: true, message: "Titlul este obligatoriu" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="isbn" label="ISBN">
            <Input />
          </Form.Item>
          <Form.Item name="imageUrl" label="URL Copertă">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="genres" label="Genuri">
            <Select
              mode="multiple"
              placeholder="Selectează genuri"
              options={[
                { value: "ROMAN", label: "Roman" },
                { value: "SF", label: "SF" },
                { value: "THRILLER", label: "Thriller" },
                { value: "MISTER", label: "Mister" },
                { value: "FANTASY", label: "Fantasy" },
                { value: "BIOGRAFIE", label: "Biografie" },
                { value: "ISTORIE", label: "Istorie" },
                { value: "POEZIE", label: "Poezie" },
                { value: "DRAMA", label: "Dramă" },
                { value: "COMEDIE", label: "Comedie" },
                { value: "HORROR", label: "Horror" },
                { value: "ROMANCE", label: "Romance" },
                { value: "COPII", label: "Copii" },
                { value: "EDUCATIE", label: "Educație" },
                { value: "STIINTA", label: "Știință" },
              ]}
            />
          </Form.Item>
          <Form.Item name="publicationDate" label="Data publicării">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          {!editingBook && (
            <>
              <Form.Item
                name="authorId"
                label="Autor"
                rules={[
                  { required: true, message: "Autorul este obligatoriu" },
                ]}
              >
                <Select
                  placeholder="Selectează autor"
                  options={authors.map((a) => ({
                    value: a.id,
                    label: `${a.firstName} ${a.lastName}`,
                  }))}
                />
              </Form.Item>
              <Form.Item
                name="publisherId"
                label="Editura"
                rules={[
                  { required: true, message: "Editura este obligatorie" },
                ]}
              >
                <Select
                  placeholder="Selectează editura"
                  options={publishers.map((p) => ({
                    value: p.id,
                    label: p.name,
                  }))}
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default BooksPage;
