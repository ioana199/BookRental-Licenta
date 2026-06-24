/*
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
*/

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin, Empty, message, Select, DatePicker, Modal } from "antd";
import { getBookById, getLibrariesForBook } from "../../api/bookApi";
import { addToWishlist, getMyWishlists } from "../../api/wishlistApi";
import { createReservation } from "../../api/reservationApi";
import { getAllUsers } from "../../api/userApi";
import { useKeycloak } from "@react-keycloak/web";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import "./BookDetailPage.css";

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
      <div className="detail-loading">
        <Spin size="large" />
      </div>
    );
  if (!book)
    return <div className="detail-missing">Cartea nu a fost găsită!</div>;

  return (
    <div className="detail br-page">
      <button className="detail-back" onClick={() => navigate("/user/books")}>
        ← Înapoi la cărți
      </button>

      <div className="detail-grid">
        {/* Coloana stângă: copertă + acțiuni */}
        <aside className="detail-aside">
          <div className="detail-cover">
            {book.imageUrl ? (
              <img src={book.imageUrl} alt={book.title} />
            ) : (
              <div className="detail-cover__fallback">📚</div>
            )}
          </div>

          {libraries.length > 0 && (
            <div className="detail-availability">
              <span className="dot"></span>
              Disponibilă în {libraries.length}{" "}
              {libraries.length === 1 ? "bibliotecă" : "biblioteci"}
            </div>
          )}

          <div className="detail-actions">
            <Button
              type="primary"
              className="btn-reserve"
              onClick={() => setReserveModalOpen(true)}
            >
              Rezervă acum
            </Button>
            <Button className="btn-fav" onClick={handleAddToFavorites}>
              {isFavorite ? (
                <HeartFilled style={{ color: "#C45C3A" }} />
              ) : (
                <HeartOutlined />
              )}
            </Button>
          </div>
        </aside>

        {/* Coloana dreaptă: informații */}
        <div className="detail-main">
          <h1 className="detail-title">{book.title}</h1>
          <div className="detail-author">
            de {book.authorFirstName} {book.authorLastName}
          </div>

          {book.genres && book.genres.length > 0 && (
            <div className="detail-genres">
              {book.genres.map((genre) => (
                <span className="genre-chip" key={genre}>
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Grid metadate */}
          <div className="detail-meta">
            <div className="detail-meta__cell">
              <div className="detail-meta__label">Editură</div>
              <div className="detail-meta__value">
                {book.publisherName || "-"}
              </div>
            </div>
            <div className="detail-meta__cell">
              <div className="detail-meta__label">Data publicării</div>
              <div className="detail-meta__value">
                {book.publicationDate || "-"}
              </div>
            </div>
            <div className="detail-meta__cell">
              <div className="detail-meta__label">ISBN</div>
              <div className="detail-meta__value detail-meta__value--mono">
                {book.ISBN || "-"}
              </div>
            </div>
            <div className="detail-meta__cell">
              <div className="detail-meta__label">Autor</div>
              <div className="detail-meta__value">
                {book.authorFirstName} {book.authorLastName}
              </div>
            </div>
          </div>

          {/* Rezumat */}
          <div className="detail-summary-head">
            <h2 className="detail-h2">Rezumat</h2>
            <span className="ai-badge">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#C45C3A">
                <path d="M12 2 L13.6 8.4 L20 10 L13.6 11.6 L12 18 L10.4 11.6 L4 10 L10.4 8.4 Z" />
              </svg>
              Generat de AI
            </span>
          </div>
          {book.summary ? (
            <p className="detail-summary">{book.summary}</p>
          ) : (
            <p className="detail-summary detail-summary--pending">
              ⏳ Se generează rezumatul...
            </p>
          )}

          {/* Biblioteci */}
          <h2 className="detail-h2 detail-h2--spaced">
            Disponibil în bibliotecile
          </h2>
          {libraries.length === 0 ? (
            <Empty description="Nu există exemplare disponibile" />
          ) : (
            <div className="detail-libs">
              {libraries.map((lib) => (
                <div className="detail-lib" key={lib.id}>
                  <div className="detail-lib__icon">
                    <svg
                      width="20"
                      height="20"
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
                  <div>
                    <div className="detail-lib__name">{lib.name}</div>
                    <div className="detail-lib__city">
                      <span className="dot"></span>
                      {lib.city}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal rezervare */}
      <Modal
        title={`Rezervă: ${book.title}`}
        open={reserveModalOpen}
        onOk={handleReserveSubmit}
        onCancel={() => setReserveModalOpen(false)}
        okText="Rezervă"
        cancelText="Anulează"
        className="br-modal"
      >
        <div className="reserve-form">
          <div className="reserve-field">
            <label>Bibliotecă</label>
            <Select
              placeholder="Selectează biblioteca"
              options={libraries.map((l) => ({
                value: l.id,
                label: `${l.name} - ${l.city}`,
              }))}
              onChange={(val) =>
                setReserveForm({ ...reserveForm, libraryId: val })
              }
            />
          </div>
          <div className="reserve-field">
            <label>Data început</label>
            <DatePicker
              onChange={(date) =>
                setReserveForm({ ...reserveForm, startDate: date })
              }
            />
          </div>
          <div className="reserve-field">
            <label>Data sfârșit</label>
            <DatePicker
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
