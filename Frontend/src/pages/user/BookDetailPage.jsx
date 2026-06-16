import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Tag,
  Rate,
  Spin,
  Empty,
  Row,
  Col,
  Card,
  message,
} from "antd";
import { getBookById, getLibrariesForBook } from "../../api/bookApi";
import { addToWishlist, getMyWishlists } from "../../api/wishlistApi";
import { createReservation } from "../../api/reservationApi";
import { getAllUsers } from "../../api/userApi";
import { useKeycloak } from "@react-keycloak/web";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Select, DatePicker, Modal } from "antd";

const { Title, Text, Paragraph } = Typography;

function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();
  const [book, setBook] = useState(null);
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [reserveForm, setReserveForm] = useState({
    libraryId: null,
    startDate: null,
    endDate: null,
  });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getBookById(id)
      .then((res) => setBook(res.data))
      .finally(() => setLoading(false));

    getLibrariesForBook(id).then((res) => setLibraries(res.data));

    const email = keycloak.tokenParsed?.email;
    if (email) {
      getAllUsers().then((res) => {
        const user = res.data.find((u) => u.email === email);
        if (user) {
          setUserId(user.id);
          getMyWishlists().then((wishlistRes) => {
            const isFav = wishlistRes.data.content.some(
              (w) => String(w.bookId) === String(id),
            );
            setIsFavorite(isFav);
          });
        }
      });
    }
  }, [id]);

  const handleAddToFavorites = () => {
    addToWishlist(id, { date: new Date().toISOString().split("T")[0] })
      .then(() => {
        message.success("Carte adăugată la favorite!");
        setIsFavorite(true);
      })
      .catch(() => message.info("Cartea este deja la favorite!"));
  };

  const handleReserveSubmit = () => {
    if (
      !reserveForm.libraryId ||
      !reserveForm.startDate ||
      !reserveForm.endDate
    ) {
      message.warning("Te rugăm să completezi toate câmpurile!");
      return;
    }
    createReservation(id, reserveForm.libraryId, {
      startDate: reserveForm.startDate.format("YYYY-MM-DD"),
      endDate: reserveForm.endDate.format("YYYY-MM-DD"),
    })
      .then(() => {
        message.success("Rezervare efectuată cu succes!");
        setReserveModalOpen(false);
        setReserveForm({ libraryId: null, startDate: null, endDate: null });
      })
      .catch(() => message.error("Nu s-a putut efectua rezervarea!"));
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        <Spin size="large" />
      </div>
    );
  if (!book) return <div>Cartea nu a fost găsită!</div>;

  return (
    <div style={{ padding: "32px", maxWidth: "1000px", margin: "0 auto" }}>
      <Button
        onClick={() => navigate("/user/books")}
        style={{ marginBottom: "24px" }}
      >
        ← Înapoi la cărți
      </Button>

      <Row gutter={[48, 32]}>
        {/* Coperta */}
        <Col xs={24} sm={8}>
          <div
            style={{
              borderRadius: "4px 8px 8px 4px",
              overflow: "hidden",
              boxShadow: "4px 4px 12px rgba(0,0,0,0.25)",
            }}
          >
            {book.imageUrl ? (
              <img
                src={book.imageUrl}
                alt={book.title}
                style={{ width: "100%", display: "block" }}
              />
            ) : (
              <div
                style={{
                  height: "350px",
                  background: "linear-gradient(135deg, #e8896a, #f5c6a0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "64px",
                }}
              >
                📚
              </div>
            )}
          </div>

          {/* Butoane */}
          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            <Button
              type="primary"
              block
              style={{ background: "#E8896A", borderColor: "#E8896A" }}
              onClick={() => setReserveModalOpen(true)}
            >
              Rezervă
            </Button>
            <Button
              style={{
                width: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={handleAddToFavorites}
            >
              {isFavorite ? (
                <HeartFilled style={{ color: "#ff4d4f" }} />
              ) : (
                <HeartOutlined />
              )}
            </Button>
          </div>
        </Col>

        {/* Informații */}
        <Col xs={24} sm={16}>
          <Title level={2}>{book.title}</Title>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div>
              <Text type="secondary">Autor: </Text>
              <Text strong>
                {book.authorFirstName} {book.authorLastName}
              </Text>
            </div>
            <div>
              <Text type="secondary">Editură: </Text>
              <Text strong>{book.publisherName}</Text>
            </div>
            <div>
              <Text type="secondary">ISBN: </Text>
              <Text strong>{book.ISBN || "-"}</Text>
            </div>
            <div>
              <Text type="secondary">Data publicării: </Text>
              <Text strong>{book.publicationDate || "-"}</Text>
            </div>
            {book.genres && book.genres.length > 0 && (
              <div>
                <Text type="secondary">Genuri: </Text>
                {book.genres.map((genre) => (
                  <Tag key={genre} color="#F5C6A0" style={{ color: "#C45C3A" }}>
                    {genre}
                  </Tag>
                ))}
              </div>
            )}
          </div>

          {book.summary && (
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <Title level={5} style={{ margin: 0 }}>
                  Rezumat
                </Title>
                <span
                  style={{
                    fontSize: "11px",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    background: "#F5C6A0",
                    color: "#C45C3A",
                    fontStyle: "italic",
                  }}
                >
                  Generat automat de AI
                </span>
              </div>
              <Paragraph style={{ color: "#5C3D2E" }}>{book.summary}</Paragraph>
            </div>
          )}
          {!book.summary && (
            <div style={{ marginBottom: "24px" }}>
              <Text type="secondary">⏳ Se generează rezumatul...</Text>
            </div>
          )}

          {/* Biblioteci disponibile */}
          <Title level={5}>Disponibil în bibliotecile:</Title>
          {libraries.length === 0 ? (
            <Empty description="Nu există exemplare disponibile" />
          ) : (
            <Row gutter={[12, 12]}>
              {libraries.map((lib) => (
                <Col key={lib.id} xs={24} sm={12}>
                  <Card size="small" style={{ borderRadius: "8px" }}>
                    <Text strong>🏛️ {lib.name}</Text>
                    <br />
                    <Text type="secondary">📍 {lib.city}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      {/* Modal rezervare */}
      <Modal
        title={`Rezervă: ${book.title}`}
        open={reserveModalOpen}
        onOk={handleReserveSubmit}
        onCancel={() => setReserveModalOpen(false)}
        okText="Rezervă"
        cancelText="Anulează"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <div>
            <Text>Bibliotecă</Text>
            <Select
              placeholder="Selectează biblioteca"
              style={{ width: "100%", marginTop: "4px" }}
              options={libraries.map((l) => ({
                value: l.id,
                label: `${l.name} - ${l.city}`,
              }))}
              onChange={(val) =>
                setReserveForm({ ...reserveForm, libraryId: val })
              }
            />
          </div>
          <div>
            <Text>Data început</Text>
            <DatePicker
              style={{ width: "100%", marginTop: "4px" }}
              onChange={(date) =>
                setReserveForm({ ...reserveForm, startDate: date })
              }
            />
          </div>
          <div>
            <Text>Data sfârșit</Text>
            <DatePicker
              style={{ width: "100%", marginTop: "4px" }}
              onChange={(date) =>
                setReserveForm({ ...reserveForm, endDate: date })
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BookDetailPage;
