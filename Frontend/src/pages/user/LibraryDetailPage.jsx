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
      {/* Buton înapoi */}
      <Button
        onClick={() => navigate("/user/libraries")}
        style={{ marginBottom: "24px" }}
      >
        ← Înapoi la biblioteci
      </Button>

      {/* Informații bibliotecă */}
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

      {/* Formular recenzie */}
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

      {/* Lista recenzii */}
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
