/*
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  Rate,
  Form,
  Input,
  Button,
  List,
  Avatar,
  Popconfirm,
  message,
  Empty,
  Spin,
} from "antd";
import { getLibraryById } from "../../api/libraryApi";
import {
  getReviewsByLibrary,
  createReview,
  deleteReview,
} from "../../api/reviewApi";
import { useKeycloak } from "@react-keycloak/web";

const { Title, Text } = Typography;
const { TextArea } = Input;

function LibraryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();
  const [library, setLibrary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const userFirstName = keycloak.tokenParsed?.given_name;

  const fetchReviews = () => {
    getReviewsByLibrary(id)
      .then((res) => setReviews(res.data.content || []))
      .catch(() => setReviews([]));
  };

  useEffect(() => {
    getLibraryById(id)
      .then((res) => setLibrary(res.data))
      .finally(() => setLoading(false));
    fetchReviews();
  }, [id]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      createReview(id, {
        description: values.description,
        rating: values.rating,
      })
        .then(() => {
          message.success("Recenzie adăugată!");
          form.resetFields();
          fetchReviews();
        })
        .catch(() =>
          message.error(
            "Nu poți adăuga o recenzie fără o rezervare finalizată la această bibliotecă!",
          ),
        );
    });
  };

  const handleDelete = (reviewId) => {
    deleteReview(reviewId)
      .then(() => {
        message.success("Recenzie ștearsă!");
        fetchReviews();
      })
      .catch(() => message.error("A apărut o eroare!"));
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        <Spin size="large" />
      </div>
    );
  if (!library) return <div>Biblioteca nu a fost găsită!</div>;

  return (
    <div style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
      <Button
        onClick={() => navigate("/user/libraries")}
        style={{ marginBottom: "24px" }}
      >
        ← Înapoi la biblioteci
      </Button>

      <Card style={{ borderRadius: "12px", marginBottom: "32px" }}>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <div style={{ fontSize: "60px" }}>🏛️</div>
          <Title level={2} style={{ marginBottom: "8px" }}>
            {library.name}
          </Title>
          {library.medieRating > 0 && (
            <div style={{ marginBottom: "8px" }}>
              <Rate disabled value={library.medieRating} allowHalf />
              <Text type="secondary" style={{ marginLeft: "8px" }}>
                ({library.medieRating?.toFixed(1)}/5)
              </Text>
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <Text>📍 {library.city}</Text>
          <Text>📧 {library.email}</Text>
          <Text>📞 {library.phoneNumber}</Text>
        </div>
      </Card>

      <Card style={{ borderRadius: "12px", marginBottom: "32px" }}>
        <Title level={4}>Adaugă o recenzie</Title>
        <Form form={form} layout="vertical">
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: "Selectează un rating" }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descriere"
            rules={[{ required: true, message: "Descrierea este obligatorie" }]}
          >
            <TextArea
              rows={3}
              placeholder="Scrie părerea ta despre această bibliotecă..."
            />
          </Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            Trimite recenzie
          </Button>
        </Form>
      </Card>

      <Title level={4}>Recenzii ({reviews.length})</Title>
      {reviews.length === 0 ? (
        <Empty description="Nu există recenzii pentru această bibliotecă" />
      ) : (
        <List
          dataSource={reviews}
          renderItem={(review) => (
            <List.Item
              actions={[
                review.userFirstName === userFirstName && (
                  <Popconfirm
                    title="Ștergi această recenzie?"
                    onConfirm={() => handleDelete(review.id)}
                    okText="Da"
                    cancelText="Nu"
                  >
                    <Button type="link" danger>
                      Șterge
                    </Button>
                  </Popconfirm>
                ),
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar>{review.userFirstName?.[0]}</Avatar>}
                title={
                  <>
                    <Text strong>{review.userFirstName}</Text>
                    <Rate
                      disabled
                      value={review.rating}
                      style={{ fontSize: "14px", marginLeft: "8px" }}
                    />
                  </>
                }
                description={review.description}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
}

export default LibraryDetailPage;
*/

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Rate,
  Form,
  Input,
  Button,
  Popconfirm,
  message,
  Empty,
  Spin,
} from "antd";
import { getLibraryById } from "../../api/libraryApi";
import {
  getReviewsByLibrary,
  createReview,
  deleteReview,
} from "../../api/reviewApi";
import { useKeycloak } from "@react-keycloak/web";
import "./LibraryDetailPage.css";

const { TextArea } = Input;

function LibraryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();
  const [library, setLibrary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const userFirstName = keycloak.tokenParsed?.given_name;

  const fetchReviews = () => {
    getReviewsByLibrary(id)
      .then((res) => setReviews(res.data.content || []))
      .catch(() => setReviews([]));
  };

  useEffect(() => {
    getLibraryById(id)
      .then((res) => setLibrary(res.data))
      .finally(() => setLoading(false));
    fetchReviews();
  }, [id]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      createReview(id, {
        description: values.description,
        rating: values.rating,
      })
        .then(() => {
          message.success("Recenzie adăugată!");
          form.resetFields();
          fetchReviews();
        })
        .catch(() =>
          message.error(
            "Nu poți adăuga o recenzie fără o rezervare finalizată la această bibliotecă!",
          ),
        );
    });
  };

  const handleDelete = (reviewId) => {
    deleteReview(reviewId)
      .then(() => {
        message.success("Recenzie ștearsă!");
        fetchReviews();
      })
      .catch(() => message.error("A apărut o eroare!"));
  };

  if (loading)
    return (
      <div className="libd-loading">
        <Spin size="large" />
      </div>
    );
  if (!library)
    return <div className="libd-missing">Biblioteca nu a fost găsită!</div>;

  return (
    <div className="libd-page">
      <button className="libd-back" onClick={() => navigate("/user/libraries")}>
        ← Înapoi la biblioteci
      </button>

      {/* Header bibliotecă */}
      <div className="libd-hero">
        <div className="libd-hero__icon">
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C45C3A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6" />
          </svg>
        </div>
        <h1 className="libd-hero__name">{library.name}</h1>

        {library.medieRating > 0 && (
          <div className="libd-hero__rating">
            <Rate disabled value={library.medieRating} allowHalf />
            <span className="libd-hero__rating-num">
              {library.medieRating?.toFixed(1)}/5
            </span>
          </div>
        )}

        <div className="libd-hero__meta">
          <span className="libd-meta-row">
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
            {library.city}
          </span>
          <span className="libd-meta-row">
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
            {library.email}
          </span>
          <span className="libd-meta-row">
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
            {library.phoneNumber}
          </span>
        </div>
      </div>

      {/* Formular recenzie */}
      <div className="libd-card">
        <h2 className="libd-h2">Adaugă o recenzie</h2>
        <Form form={form} layout="vertical" className="libd-form">
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: "Selectează un rating" }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descriere"
            rules={[{ required: true, message: "Descrierea este obligatorie" }]}
          >
            <TextArea
              rows={3}
              placeholder="Scrie părerea ta despre această bibliotecă..."
            />
          </Form.Item>
          <Button type="primary" className="btn-primary" onClick={handleSubmit}>
            Trimite recenzie
          </Button>
        </Form>
      </div>

      {/* Lista recenzii */}
      <h2 className="libd-h2 libd-h2--section">
        Recenzii <span className="libd-count">({reviews.length})</span>
      </h2>
      {reviews.length === 0 ? (
        <Empty description="Nu există recenzii pentru această bibliotecă" />
      ) : (
        <div className="libd-reviews">
          {reviews.map((review) => (
            <div className="review-card" key={review.id}>
              <div className="review-card__avatar">
                {review.userFirstName?.[0]?.toUpperCase()}
              </div>
              <div className="review-card__body">
                <div className="review-card__head">
                  <span className="review-card__name">
                    {review.userFirstName}
                  </span>
                  <Rate
                    disabled
                    value={review.rating}
                    style={{ fontSize: "14px" }}
                  />
                  {review.userFirstName === userFirstName && (
                    <Popconfirm
                      title="Ștergi această recenzie?"
                      onConfirm={() => handleDelete(review.id)}
                      okText="Da"
                      cancelText="Nu"
                    >
                      <button className="review-card__delete">Șterge</button>
                    </Popconfirm>
                  )}
                </div>
                <div className="review-card__text">{review.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LibraryDetailPage;
