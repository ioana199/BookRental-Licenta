/*
import { useState, useEffect } from "react";
import {
  Form,
  Select,
  InputNumber,
  Button,
  Typography,
  message,
  Card,
} from "antd";
import { createExemplaries } from "../../api/exemplaryApi";
import { getAllBooks } from "../../api/bookApi";
import { getAllLibraries } from "../../api/libraryApi";

const { Title } = Typography;

function ExemplariesManagementPage() {
  const [books, setBooks] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    getAllBooks().then((res) => setBooks(res.data));
    getAllLibraries().then((res) => setLibraries(res.data));
  }, []);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      createExemplaries(values.bookId, values.libraryId, values.nrToCreate)
        .then(() => {
          message.success(`${values.nrToCreate} exemplare adăugate cu succes!`);
          form.resetFields();
        })
        .catch(() => message.error("A apărut o eroare!"))
        .finally(() => setLoading(false));
    });
  };

  return (
    <div style={{ padding: "24px" }}>
      <Title level={3}>Adaugă exemplare</Title>
      <Card style={{ maxWidth: 500 }}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="bookId"
            label="Carte"
            rules={[{ required: true, message: "Selectează o carte" }]}
          >
            <Select
              placeholder="Selectează carte"
              showSearch
              optionFilterProp="label"
              options={books.map((b) => ({ value: b.id, label: b.title }))}
            />
          </Form.Item>
          <Form.Item
            name="libraryId"
            label="Bibliotecă"
            rules={[{ required: true, message: "Selectează o bibliotecă" }]}
          >
            <Select
              placeholder="Selectează biblioteca"
              options={libraries.map((l) => ({
                value: l.id,
                label: `${l.name} - ${l.city}`,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="nrToCreate"
            label="Număr de exemplare"
            rules={[{ required: true, message: "Introdu numărul" }]}
          >
            <InputNumber min={1} max={100} style={{ width: "100%" }} />
          </Form.Item>
          <Button type="primary" onClick={handleSubmit} loading={loading} block>
            Adaugă exemplare
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default ExemplariesManagementPage;
*/

import { useState, useEffect } from "react";
import { Form, Select, InputNumber, Button, message } from "antd";
import { createExemplaries } from "../../api/exemplaryApi";
import { getAllBooks } from "../../api/bookApi";
import { getAllLibraries } from "../../api/libraryApi";
import "../../styles/management.css";

function ExemplariesManagementPage() {
  const [books, setBooks] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    getAllBooks().then((res) => setBooks(res.data));
    getAllLibraries().then((res) => setLibraries(res.data));
  }, []);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      createExemplaries(values.bookId, values.libraryId, values.nrToCreate)
        .then(() => {
          message.success(`${values.nrToCreate} exemplare adăugate cu succes!`);
          form.resetFields();
        })
        .catch(() => message.error("A apărut o eroare!"))
        .finally(() => setLoading(false));
    });
  };

  return (
    <div className="mgmt-page">
      <div className="mgmt-head">
        <div>
          <div className="br-eyebrow">Stoc · administrare</div>
          <h1 className="mgmt-title">Adaugă exemplare</h1>
        </div>
      </div>

      <div className="mgmt-form-card">
        <Form form={form} layout="vertical">
          <Form.Item
            name="bookId"
            label="Carte"
            rules={[{ required: true, message: "Selectează o carte" }]}
          >
            <Select
              placeholder="Selectează carte"
              showSearch
              optionFilterProp="label"
              options={books.map((b) => ({ value: b.id, label: b.title }))}
            />
          </Form.Item>
          <Form.Item
            name="libraryId"
            label="Bibliotecă"
            rules={[{ required: true, message: "Selectează o bibliotecă" }]}
          >
            <Select
              placeholder="Selectează biblioteca"
              options={libraries.map((l) => ({
                value: l.id,
                label: `${l.name} - ${l.city}`,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="nrToCreate"
            label="Număr de exemplare"
            rules={[{ required: true, message: "Introdu numărul" }]}
          >
            <InputNumber min={1} max={100} style={{ width: "100%" }} />
          </Form.Item>
          <Button
            type="primary"
            className="btn-primary"
            onClick={handleSubmit}
            loading={loading}
            block
          >
            Adaugă exemplare
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default ExemplariesManagementPage;
