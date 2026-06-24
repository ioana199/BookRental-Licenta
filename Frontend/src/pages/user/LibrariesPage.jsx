/*
import { useEffect, useState } from "react";
import { Input, Typography, Row, Col, Card, Empty, Spin } from "antd";
import { getAllLibraries } from "../../api/libraryApi";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Search } = Input;

function LibrariesPage() {
  const [libraries, setLibraries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllLibraries()
      .then((res) => {
        setLibraries(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (value) => {
    const val = value.toLowerCase();
    setFiltered(
      libraries.filter(
        (l) =>
          l.name?.toLowerCase().includes(val) ||
          l.city?.toLowerCase().includes(val) ||
          l.email?.toLowerCase().includes(val),
      ),
    );
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        <Spin size="large" />
      </div>
    );

  return (
    <div style={{ padding: "32px" }}>
      <Title level={2}>Biblioteci</Title>
      <Search
        placeholder="Caută după nume, oraș sau email..."
        onChange={(e) => handleSearch(e.target.value)}
        style={{ maxWidth: 400, marginBottom: "32px" }}
        allowClear
      />
      {filtered.length === 0 ? (
        <Empty description="Nu s-au găsit biblioteci" />
      ) : (
        <Row gutter={[24, 24]}>
          {filtered.map((library) => (
            <Col key={library.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{ borderRadius: "12px", cursor: "pointer" }}
                onClick={() => navigate(`/user/libraries/${library.id}`)}
              >
                <div
                  style={{
                    fontSize: "40px",
                    textAlign: "center",
                    marginBottom: "12px",
                  }}
                >
                  🏛️
                </div>
                <Title
                  level={5}
                  style={{ textAlign: "center", marginBottom: "8px" }}
                >
                  {library.name}
                </Title>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <Text type="secondary">📍 {library.city}</Text>
                  <Text type="secondary">📧 {library.email}</Text>
                  <Text type="secondary">📞 {library.phoneNumber}</Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default LibrariesPage;
*/

import { useEffect, useState } from "react";
import { Input, Empty, Spin } from "antd";
import { getAllLibraries } from "../../api/libraryApi";
import { useNavigate } from "react-router-dom";
import "./LibrariesPage.css";

const { Search } = Input;

function LibrariesPage() {
  const [libraries, setLibraries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllLibraries()
      .then((res) => {
        setLibraries(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (value) => {
    const val = value.toLowerCase();
    setFiltered(
      libraries.filter(
        (l) =>
          l.name?.toLowerCase().includes(val) ||
          l.city?.toLowerCase().includes(val) ||
          l.email?.toLowerCase().includes(val),
      ),
    );
  };

  if (loading)
    return (
      <div className="lib-loading">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="lib-page br-page">
      <div className="lib-head">
        <div className="br-eyebrow">
          Rețeaua noastră · {filtered.length} locații
        </div>
        <h1 className="br-title">Biblioteci</h1>
      </div>

      <Search
        placeholder="Caută după nume, oraș sau email..."
        onChange={(e) => handleSearch(e.target.value)}
        className="lib-search"
        allowClear
      />

      {filtered.length === 0 ? (
        <Empty description="Nu s-au găsit biblioteci" />
      ) : (
        <div className="lib-grid">
          {filtered.map((library) => (
            <div
              className="lib-card"
              key={library.id}
              onClick={() => navigate(`/user/libraries/${library.id}`)}
            >
              <div className="lib-card__top">
                <div className="lib-card__icon">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C45C3A"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6" />
                  </svg>
                </div>
                <div className="lib-card__city-tag">{library.city}</div>
              </div>

              <div className="lib-card__name">{library.name}</div>

              <div className="lib-card__meta">
                <div className="lib-meta-row">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{library.city}</span>
                </div>
                <div className="lib-meta-row">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  <span>{library.email}</span>
                </div>
                <div className="lib-meta-row">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
                  </svg>
                  <span>{library.phoneNumber}</span>
                </div>
              </div>

              <div className="lib-card__cta">Vezi detalii →</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LibrariesPage;
