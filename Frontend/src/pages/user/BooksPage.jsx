/*
import { useEffect, useState } from "react";
import {
  Input,
  Typography,
  Row,
  Col,
  Empty,
  Spin,
  Modal,
  Button,
  DatePicker,
  Select,
  message,
} from "antd";
import { getAllBooks } from "../../api/bookApi";
import { getAllLibraries } from "../../api/libraryApi";
import { createReservation } from "../../api/reservationApi";
import { useKeycloak } from "@react-keycloak/web";
import { getAllUsers } from "../../api/userApi";
import { addToWishlist, getMyWishlists } from "../../api/wishlistApi";
import dayjs from "dayjs";
import { getRecommendations } from "../../api/recommendationApi";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Search } = Input;

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [libraries, setLibraries] = useState([]);
  const [userId, setUserId] = useState(null);
  const [reserveForm, setReserveForm] = useState({
    libraryId: null,
    startDate: null,
    endDate: null,
  });
  const { keycloak } = useKeycloak();
  const [recommendationsModalOpen, setRecommendationsModalOpen] =
    useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [favoriteBookIds, setFavoriteBookIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllBooks()
      .then((res) => {
        setBooks(res.data);
        setFiltered(res.data);
      })
      .finally(() => setLoading(false));

    getAllLibraries().then((res) => setLibraries(res.data));

    const email = keycloak.tokenParsed?.email;
    if (email) {
      getAllUsers().then((res) => {
        const user = res.data.find((u) => u.email === email);
        if (user) {
          setUserId(user.id);
          // Încarcă favoriteBookIds din DB
          getMyWishlists().then((wishlistRes) => {
            const savedBookIds = wishlistRes.data.content.map((item) =>
              String(item.bookId),
            );
            setFavoriteBookIds(savedBookIds);
          });
        }
      });
    }
  }, []);

  const handleSearch = (value) => {
    const val = value.toLowerCase();
    setFiltered(
      books.filter(
        (b) =>
          b.title?.toLowerCase().includes(val) ||
          b.authorFirstName?.toLowerCase().includes(val) ||
          b.authorLastName?.toLowerCase().includes(val),
      ),
    );
  };

  const handleReserve = (book) => {
    setSelectedBook(book);
    setReserveModalOpen(true);
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
    createReservation(selectedBook.id, reserveForm.libraryId, {
      startDate: reserveForm.startDate.format("YYYY-MM-DD"),
      endDate: reserveForm.endDate.format("YYYY-MM-DD"),
    })
      .then(() => {
        message.success(
          "Rezervare efectuată cu succes! Vei primi un email de confirmare.",
        );
        setReserveModalOpen(false);
        setReserveForm({ libraryId: null, startDate: null, endDate: null });
      })
      .catch(() => {
        message.error(
          "Nu s-a putut efectua rezervarea. Verifică disponibilitatea!",
        );
      });
  };

  const handleGetRecommendations = () => {
    setRecommendationsModalOpen(true);
    setRecommendationsLoading(true);
    getRecommendations()
      .then((res) => setRecommendations(res.data))
      .catch(() => message.error("Nu am putut genera recomandări!"))
      .finally(() => setRecommendationsLoading(false));
  };

  const handleAddToFavorites = (bookId) => {
    // Convertim ID-urile la String pentru a ne asigura că 1 === "1"
    const isAlreadyFavorite = favoriteBookIds.some(
      (id) => String(id) === String(bookId),
    );

    if (isAlreadyFavorite) {
      message.info("Cartea este deja la favorite!");
      return;
    }

    addToWishlist(bookId, { date: new Date().toISOString().split("T")[0] })
      .then(() => {
        message.success("Carte adăugată la favorite!");
        // Salvăm ID-ul ca string în state pentru afișarea imediată a inimii roșii
        setFavoriteBookIds((prev) => [...prev, String(bookId)]);
      })
      .catch(() => message.error("A apărut o eroare!"));
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        <Spin size="large" />
      </div>
    );

  return (
    <div style={{ padding: "32px" }}>
      <Title level={2}>Cărți disponibile</Title>
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "32px",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Search
          placeholder="Caută după titlu sau autor..."
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 400, width: "100%" }}
          allowClear
        />
        <Button
          type="primary"
          onClick={handleGetRecommendations}
          style={{
            background: "#E88A73",
            borderColor: "#E88A73",
          }}
        >
          Recomandări AI
        </Button>
      </div>
      {filtered.length === 0 ? (
        <Empty description="Nu s-au găsit cărți" />
      ) : (
        <Row gutter={[32, 40]}>
          {filtered.map((book) => (
            <Col key={book.id} xs={12} sm={8} md={6} lg={4}>
              <div
                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-8px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div
                  style={{
                    cursor: "pointer",
                    width: "100%",
                    paddingBottom: "150%",
                    position: "relative",
                    borderRadius: "4px 8px 8px 4px",
                    overflow: "hidden",
                    boxShadow:
                      "4px 4px 12px rgba(0,0,0,0.25), -2px 0 6px rgba(0,0,0,0.1)",
                  }}
                  onClick={() => navigate(`/user/books/${book.id}`)}
                >
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(135deg, #e8896a, #f5c6a0)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "12px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                        📚
                      </div>
                      <Text strong style={{ color: "white", fontSize: "12px" }}>
                        {book.title}
                      </Text>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: "10px" }}>
                  <Text strong style={{ fontSize: "13px", display: "block" }}>
                    {book.title}
                  </Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {book.authorFirstName} {book.authorLastName}
                  </Text>
                  {book.genres && book.genres.length > 0 && (
                    <div
                      style={{
                        marginTop: "4px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "4px",
                      }}
                    >
                      {book.genres.map((genre) => (
                        <span
                          key={genre}
                          style={{
                            fontSize: "10px",
                            padding: "2px 6px",
                            borderRadius: "10px",
                            background: "#F5C6A0",
                            color: "#C45C3A",
                          }}
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    width: "100%",
                    marginTop: "12px",
                  }}
                >
                  <Button
                    type="primary"
                    style={{
                      flex: 1,
                      background: "#E88A73",
                      borderColor: "#E88A73",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleReserve(book)}
                  >
                    Rezervă
                  </Button>
                  <Button
                    style={{
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 0,
                    }}
                    onClick={() => handleAddToFavorites(book.id)}
                    title="Adaugă la favorite"
                  >
                    {favoriteBookIds.some(
                      (id) => String(id) === String(book.id),
                    ) ? (
                      <HeartFilled style={{ color: "#ff4d4f" }} />
                    ) : (
                      <HeartOutlined style={{ color: "#595959" }} />
                    )}
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title="Recomandări personalizate pentru tine"
        open={recommendationsModalOpen}
        onCancel={() => setRecommendationsModalOpen(false)}
        footer={null}
        width={700}
      >
        {recommendationsLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
            <div style={{ marginTop: "16px" }}>Se generează recomandări...</div>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {recommendations.map((rec, index) => {
              const foundBook = books.find(
                (b) =>
                  rec.title?.toLowerCase().includes(b.title?.toLowerCase()) ||
                  b.title?.toLowerCase().includes(rec.title?.toLowerCase()),
              );
              return (
                <div
                  key={index}
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    background: "#FDF8F5",
                    border: "1px solid #E8C9B5",
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                  }}
                >
                  {foundBook && (
                    <div
                      style={{
                        width: "80px",
                        minWidth: "80px",
                        height: "120px",
                        borderRadius: "4px 8px 8px 4px",
                        overflow: "hidden",
                        boxShadow: "4px 4px 8px rgba(0,0,0,0.2)",
                      }}
                    >
                      {foundBook.imageUrl ? (
                        <img
                          src={foundBook.imageUrl}
                          alt={foundBook.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(135deg, #e8896a, #f5c6a0)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "24px",
                          }}
                        >
                          📚
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <Text strong style={{ fontSize: "16px", color: "#3D2314" }}>
                      📚 {rec.title}
                    </Text>
                    {foundBook && (
                      <Text
                        type="secondary"
                        style={{ display: "block", fontSize: "13px" }}
                      >
                        {foundBook.authorFirstName} {foundBook.authorLastName}
                      </Text>
                    )}
                    <Text
                      type="secondary"
                      style={{
                        fontSize: "13px",
                        marginTop: "8px",
                        display: "block",
                      }}
                    >
                      {rec.reason}
                    </Text>

                    {foundBook && (
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          width: "100%",
                          marginTop: "12px",
                        }}
                      >
                        <Button
                          type="primary"
                          style={{
                            flex: 1,
                            background: "#E88A73",
                            borderColor: "#E88A73",
                            fontWeight: "bold",
                            maxWidth: "150px",
                          }}
                          onClick={() => {
                            setRecommendationsModalOpen(false);
                            handleReserve(foundBook);
                          }}
                        >
                          Rezervă
                        </Button>
                        <Button
                          style={{
                            width: "32px",
                            height: "32px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 0,
                          }}
                          onClick={() => handleAddToFavorites(foundBook.id)}
                          title="Adaugă la favorite"
                        >
                          {favoriteBookIds.some(
                            (id) => String(id) === String(foundBook.id),
                          ) ? (
                            <HeartFilled style={{ color: "#ff4d4f" }} />
                          ) : (
                            <HeartOutlined style={{ color: "#595959" }} />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      <Modal
        title={`Rezervă: ${selectedBook?.title}`}
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

export default BooksPage;
*/

import { useEffect, useState } from "react";
import {
  Input,
  Empty,
  Spin,
  Modal,
  Button,
  DatePicker,
  Select,
  message,
} from "antd";
import { getAllBooks, getLibrariesForBook } from "../../api/bookApi";
import { getAllLibraries } from "../../api/libraryApi";
import { createReservation } from "../../api/reservationApi";
import { useKeycloak } from "@react-keycloak/web";
import { getAllUsers } from "../../api/userApi";
import { addToWishlist, getMyWishlists } from "../../api/wishlistApi";
import { getRecommendations } from "../../api/recommendationApi";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./BooksPage.css";

const { Search } = Input;

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [libraries, setLibraries] = useState([]);
  const [userId, setUserId] = useState(null);
  const [reserveForm, setReserveForm] = useState({
    libraryId: null,
    startDate: null,
    endDate: null,
  });
  const { keycloak } = useKeycloak();
  const [recommendationsModalOpen, setRecommendationsModalOpen] =
    useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [favoriteBookIds, setFavoriteBookIds] = useState([]);
  const [availability, setAvailability] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getAllBooks()
      .then((res) => {
        setBooks(res.data);
        setFiltered(res.data);
        // Disponibilitate per carte = are cel puțin o bibliotecă cu exemplar
        Promise.all(
          res.data.map((b) =>
            getLibrariesForBook(b.id)
              .then((r) => [b.id, (r.data?.length || 0) > 0])
              .catch(() => [b.id, false]),
          ),
        ).then((entries) => setAvailability(Object.fromEntries(entries)));
      })
      .finally(() => setLoading(false));

    getAllLibraries().then((res) => setLibraries(res.data));

    const email = keycloak.tokenParsed?.email;
    if (email) {
      getAllUsers().then((res) => {
        const user = res.data.find((u) => u.email === email);
        if (user) {
          setUserId(user.id);
          getMyWishlists().then((wishlistRes) => {
            const savedBookIds = wishlistRes.data.content.map((item) =>
              String(item.bookId),
            );
            setFavoriteBookIds(savedBookIds);
          });
        }
      });
    }
  }, []);

  const handleSearch = (value) => {
    const val = value.toLowerCase();
    setFiltered(
      books.filter(
        (b) =>
          b.title?.toLowerCase().includes(val) ||
          b.authorFirstName?.toLowerCase().includes(val) ||
          b.authorLastName?.toLowerCase().includes(val),
      ),
    );
  };

  const handleReserve = (book) => {
    setSelectedBook(book);
    setReserveModalOpen(true);
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
    createReservation(selectedBook.id, reserveForm.libraryId, {
      startDate: reserveForm.startDate.format("YYYY-MM-DD"),
      endDate: reserveForm.endDate.format("YYYY-MM-DD"),
    })
      .then(() => {
        message.success(
          "Rezervare efectuată cu succes! Vei primi un email de confirmare.",
        );
        setReserveModalOpen(false);
        setReserveForm({ libraryId: null, startDate: null, endDate: null });
      })
      .catch(() => {
        message.error(
          "Nu s-a putut efectua rezervarea. Verifică disponibilitatea!",
        );
      });
  };

  const handleGetRecommendations = () => {
    setRecommendationsModalOpen(true);
    setRecommendationsLoading(true);
    getRecommendations()
      .then((res) => setRecommendations(res.data))
      .catch(() => message.error("Nu am putut genera recomandări!"))
      .finally(() => setRecommendationsLoading(false));
  };

  const handleAddToFavorites = (bookId) => {
    const isAlreadyFavorite = favoriteBookIds.some(
      (id) => String(id) === String(bookId),
    );
    if (isAlreadyFavorite) {
      message.info("Cartea este deja la favorite!");
      return;
    }
    addToWishlist(bookId, { date: new Date().toISOString().split("T")[0] })
      .then(() => {
        message.success("Carte adăugată la favorite!");
        setFavoriteBookIds((prev) => [...prev, String(bookId)]);
      })
      .catch(() => message.error("A apărut o eroare!"));
  };

  const isFavorite = (id) =>
    favoriteBookIds.some((x) => String(x) === String(id));

  if (loading)
    return (
      <div className="books-loading">
        <Spin size="large" />
      </div>
    );

  const renderCover = (book, variant) => (
    <div className={`book-cover book-cover--${variant}`}>
      {book.imageUrl ? (
        <img src={book.imageUrl} alt={book.title} />
      ) : (
        <div className="book-cover__fallback">
          <span className="book-cover__icon">📚</span>
          <span className="book-cover__fallback-title">{book.title}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="books-page br-page">
      {/* Header */}
      <div className="books-head">
        <div>
          <div className="br-eyebrow">Catalog · {filtered.length} titluri</div>
          <h1 className="br-title">Cărți disponibile</h1>
        </div>
      </div>

      {/* Bara de căutare + acțiuni */}
      <div className="books-toolbar">
        <Search
          placeholder="Caută după titlu sau autor..."
          onChange={(e) => handleSearch(e.target.value)}
          className="books-search"
          allowClear
        />
        <Button
          type="primary"
          className="btn-ai"
          onClick={handleGetRecommendations}
        >
          ✦ Recomandări AI
        </Button>
      </div>

      {/* Grid cărți */}
      {filtered.length === 0 ? (
        <Empty description="Nu s-au găsit cărți" />
      ) : (
        <div className="books-grid">
          {filtered.map((book) => (
            <div className="book-card" key={book.id}>
              <div
                className="book-card__cover-wrap"
                onClick={() => navigate(`/user/books/${book.id}`)}
              >
                {renderCover(book, "grid")}
              </div>

              <div className="book-card__info">
                <div
                  className="book-card__title"
                  onClick={() => navigate(`/user/books/${book.id}`)}
                >
                  {book.title}
                </div>
                <div className="book-card__author">
                  {book.authorFirstName} {book.authorLastName}
                </div>
                {book.genres && book.genres.length > 0 && (
                  <div className="book-card__genres">
                    {book.genres.map((genre) => (
                      <span className="genre-chip" key={genre}>
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="book-card__actions">
                {availability[book.id] !== undefined && (
                  <div
                    className={`avail ${
                      availability[book.id] ? "avail--yes" : "avail--no"
                    }`}
                  >
                    <span className="avail__dot"></span>
                    {availability[book.id] ? "Disponibilă" : "Indisponibilă"}
                  </div>
                )}
                <div className="book-card__buttons">
                  <Button
                    type="primary"
                    className="btn-reserve"
                    onClick={() => handleReserve(book)}
                  >
                    Rezervă
                  </Button>
                  <Button
                    className="btn-fav"
                    onClick={() => handleAddToFavorites(book.id)}
                    title="Adaugă la favorite"
                  >
                    {isFavorite(book.id) ? (
                      <HeartFilled style={{ color: "#C45C3A" }} />
                    ) : (
                      <HeartOutlined />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal recomandări */}
      <Modal
        title="Recomandări personalizate pentru tine"
        open={recommendationsModalOpen}
        onCancel={() => setRecommendationsModalOpen(false)}
        footer={null}
        width={700}
        className="br-modal"
      >
        {recommendationsLoading ? (
          <div className="rec-loading">
            <Spin size="large" />
            <div className="rec-loading__text">Se generează recomandări...</div>
          </div>
        ) : (
          <div className="rec-list">
            {recommendations.map((rec, index) => {
              const foundBook = books.find(
                (b) =>
                  rec.title?.toLowerCase().includes(b.title?.toLowerCase()) ||
                  b.title?.toLowerCase().includes(rec.title?.toLowerCase()),
              );
              return (
                <div className="rec-item" key={index}>
                  {foundBook && renderCover(foundBook, "rec")}
                  <div className="rec-item__body">
                    <div className="rec-item__title">{rec.title}</div>
                    {foundBook && (
                      <div className="rec-item__author">
                        {foundBook.authorFirstName} {foundBook.authorLastName}
                      </div>
                    )}
                    <div className="rec-item__reason">{rec.reason}</div>
                    {foundBook && (
                      <div className="rec-item__actions">
                        <Button
                          type="primary"
                          className="btn-reserve"
                          onClick={() => {
                            setRecommendationsModalOpen(false);
                            handleReserve(foundBook);
                          }}
                        >
                          Rezervă
                        </Button>
                        <Button
                          className="btn-fav"
                          onClick={() => handleAddToFavorites(foundBook.id)}
                          title="Adaugă la favorite"
                        >
                          {isFavorite(foundBook.id) ? (
                            <HeartFilled style={{ color: "#C45C3A" }} />
                          ) : (
                            <HeartOutlined />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      {/* Modal rezervare */}
      <Modal
        title={`Rezervă: ${selectedBook?.title}`}
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

export default BooksPage;
