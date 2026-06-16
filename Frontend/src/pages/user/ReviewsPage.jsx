import { useEffect, useState } from "react";
import {
  Typography,
  Select,
  Form,
  Input,
  Button,
  Rate,
  List,
  Avatar,
  Popconfirm,
  message,
  Empty,
  Card,
} from "antd";
import {
  getReviewsByLibrary,
  createReview,
  deleteReview,
} from "../../api/reviewApi";
import { getAllLibraries } from "../../api/libraryApi";
import { useKeycloak } from "@react-keycloak/web";

const { Title, Text } = Typography;
const { TextArea } = Input;

function ReviewsPage() {
  const [libraries, setLibraries] = useState([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { keycloak } = useKeycloak();

  const userFirstName = keycloak.tokenParsed?.given_name;

  useEffect(() => {
    getAllLibraries().then((res) => setLibraries(res.data));
  }, []);

  const fetchReviews = (libraryId) => {
    setLoading(true);
    getReviewsByLibrary(libraryId)
      .then((res) => setReviews(res.data.content || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };

  const handleLibraryChange = (val) => {
    setSelectedLibraryId(val);
    fetchReviews(val);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      createReview(selectedLibraryId, {
        description: values.description,
        rating: values.rating,
      })
        .then(() => {
          message.success("Review adăugat!");
          form.resetFields();
          fetchReviews(selectedLibraryId);
        })
        .catch(() => message.error("A apărut o eroare!"));
    });
  };

  const handleDelete = (reviewId) => {
    deleteReview(reviewId)
      .then(() => {
        message.success("Review șters!");
        fetchReviews(selectedLibraryId);
      })
      .catch(() => message.error("A apărut o eroare!"));
  };

  return (
    <div style={{ padding: "32px" }}>
      <Title level={2}>Recenzii biblioteci</Title>

      <Select
        placeholder="Selectează o bibliotecă"
        style={{ width: 300, marginBottom: "24px" }}
        options={libraries.map((l) => ({
          value: l.id,
          label: `${l.name} - ${l.city}`,
        }))}
        onChange={handleLibraryChange}
      />

      {selectedLibraryId && (
        <>
          {/* Formular adaugă review */}
          <Card style={{ marginBottom: "24px", maxWidth: 600 }}>
            <Title level={5}>Adaugă o recenzie</Title>
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
                rules={[
                  { required: true, message: "Descrierea este obligatorie" },
                ]}
              >
                <TextArea rows={3} placeholder="Scrie părerea ta..." />
              </Form.Item>
              <Button type="primary" onClick={handleSubmit}>
                Trimite recenzie
              </Button>
            </Form>
          </Card>

          {/* Lista review-uri */}
          {reviews.length === 0 ? (
            <Empty description="Nu există recenzii pentru această bibliotecă" />
          ) : (
            <List
              loading={loading}
              dataSource={reviews}
              renderItem={(review) => (
                <List.Item
                  actions={[
                    review.userFirstName === userFirstName && (
                      <Popconfirm
                        title="Ștergi acest review?"
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
                        <Text strong>{review.userFirstName}</Text>{" "}
                        <Rate
                          disabled
                          value={review.rating}
                          style={{ fontSize: "14px" }}
                        />
                      </>
                    }
                    description={review.description}
                  />
                </List.Item>
              )}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ReviewsPage;
