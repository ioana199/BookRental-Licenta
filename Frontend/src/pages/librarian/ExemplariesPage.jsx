/*
import { useState, useEffect } from 'react';
import { Form, Select, InputNumber, Button, Typography, message, Card } from 'antd';
import { createExemplaries } from '../../api/exemplaryApi';
import { getAllBooks } from '../../api/bookApi';
import { getAllLibrarians } from '../../api/librarianApi';
import { useKeycloak } from '@react-keycloak/web';

const { Title } = Typography;

function ExemplariesPage() {
  const [books, setBooks] = useState([]);
  const [libraryId, setLibraryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { keycloak } = useKeycloak();

  useEffect(() => {
    getAllBooks().then((res) => setBooks(res.data));

    const email = keycloak.tokenParsed?.email;
    console.log('email din token:', email);

    if (email) {
      getAllLibrarians().then((res) => {
        const librarian = res.data.find((l) => l.email === email);
        console.log('librarian gasit:', librarian);
        if (librarian) {
          setLibraryId(librarian.libraryId);
        }
      });
    }
  }, []);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (!libraryId) {
        message.error('Nu s-a putut determina librăria ta!');
        return;
      }
      setLoading(true);
      createExemplaries(values.bookId, libraryId, values.nrToCreate)
        .then(() => {
          message.success(`${values.nrToCreate} exemplare adăugate cu succes!`);
          form.resetFields();
        })
        .catch(() => message.error('A apărut o eroare!'))
        .finally(() => setLoading(false));
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>Adaugă exemplare</Title>
      <Card style={{ maxWidth: 500 }}>
        <Form form={form} layout="vertical">
          <Form.Item name="bookId" label="Carte" rules={[{ required: true, message: 'Selectează o carte' }]}>
            <Select
              placeholder="Selectează carte"
              showSearch
              optionFilterProp="label"
              options={books.map((b) => ({ value: b.id, label: b.title }))}
            />
          </Form.Item>
          <Form.Item name="nrToCreate" label="Număr de exemplare" rules={[{ required: true, message: 'Introdu numărul' }]}>
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Button type="primary" onClick={handleSubmit} loading={loading} block>
            Adaugă exemplare
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default ExemplariesPage;
*/

import { useState, useEffect } from "react";
import { Form, Select, InputNumber, Button, message } from "antd";
import { createExemplaries } from "../../api/exemplaryApi";
import { getAllBooks } from "../../api/bookApi";
import { getAllLibrarians } from "../../api/librarianApi";
import { useKeycloak } from "@react-keycloak/web";
import "../../styles/management.css";

function ExemplariesPage() {
  const [books, setBooks] = useState([]);
  const [libraryId, setLibraryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { keycloak } = useKeycloak();

  useEffect(() => {
    getAllBooks().then((res) => setBooks(res.data));

    const email = keycloak.tokenParsed?.email;
    if (email) {
      getAllLibrarians().then((res) => {
        const librarian = res.data.find((l) => l.email === email);
        if (librarian) {
          setLibraryId(librarian.libraryId);
        }
      });
    }
  }, []);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (!libraryId) {
        message.error("Nu s-a putut determina librăria ta!");
        return;
      }
      setLoading(true);
      createExemplaries(values.bookId, libraryId, values.nrToCreate)
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
          <div className="br-eyebrow">Stoc · bibliotecă</div>
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

export default ExemplariesPage;
