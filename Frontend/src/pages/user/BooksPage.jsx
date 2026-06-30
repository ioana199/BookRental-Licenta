import { useEffect, useState, useMemo } from "react";
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
import {
  addToWishlist,
  getMyWishlists,
  removeFromWishlist,
} from "../../api/wishlistApi";
import { getRecommendations } from "../../api/recommendationApi";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./BooksPage.css";

const { Search } = Input;

function BooksPage() {
  const [books, setBooks] = useState([]);
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
  const [availability, setAvailability] = useState({}); // bookId -> boolean
  const [bookLibraryIds, setBookLibraryIds] = useState({}); // bookId -> [libraryId]
  const navigate = useNavigate();
  const [reserveLibraries, setReserveLibraries] = useState([]);

  // Filtre
  const [searchText, setSearchText] = useState("");
  const [filterAvailable, setFilterAvailable] = useState(null);
  const [filterLibrary, setFilterLibrary] = useState(null);
  const [filterGenre, setFilterGenre] = useState(null);
  const [filterAuthor, setFilterAuthor] = useState(null);

  useEffect(() => {
    getAllBooks()
      .then((res) => {
        setBooks(res.data);
        // Pentru fiecare carte: lista de id-uri de biblioteci în care există exemplare
        Promise.all(
          res.data.map((b) =>
            getLibrariesForBook(b.id)
              .then((r) => [b.id, (r.data || []).map((lib) => lib.id)])
              .catch(() => [b.id, []]),
          ),
        ).then((entries) => {
          const libMap = Object.fromEntries(entries);
          setBookLibraryIds(libMap);
          setAvailability(
            Object.fromEntries(
              Object.entries(libMap).map(([id, libs]) => [id, libs.length > 0]),
            ),
          );
        });
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

  // Opțiuni derivate pentru filtre
  const genreOptions = useMemo(() => {
    const set = new Set();
    books.forEach((b) => (b.genres || []).forEach((g) => set.add(g)));
    return [...set].sort();
  }, [books]);

  const authorOptions = useMemo(() => {
    const set = new Set();
    books.forEach((b) => {
      const full =
        `${b.authorFirstName ?? ""} ${b.authorLastName ?? ""}`.trim();
      if (full) set.add(full);
    });
    return [...set].sort();
  }, [books]);

  // Lista filtrată (căutare + cele 4 filtre, combinate)
  const filtered = useMemo(() => {
    const txt = searchText.toLowerCase();
    return books.filter((b) => {
      if (txt) {
        const matchesText =
          b.title?.toLowerCase().includes(txt) ||
          b.authorFirstName?.toLowerCase().includes(txt) ||
          b.authorLastName?.toLowerCase().includes(txt);
        if (!matchesText) return false;
      }
      if (filterAvailable !== null) {
        if ((availability[b.id] === true) !== filterAvailable) return false;
      }
      if (filterLibrary !== null) {
        const libs = bookLibraryIds[b.id] || [];
        if (!libs.includes(filterLibrary)) return false;
      }
      if (filterGenre !== null) {
        if (!(b.genres || []).includes(filterGenre)) return false;
      }
      if (filterAuthor !== null) {
        const full =
          `${b.authorFirstName ?? ""} ${b.authorLastName ?? ""}`.trim();
        if (full !== filterAuthor) return false;
      }
      return true;
    });
  }, [
    books,
    searchText,
    filterAvailable,
    filterLibrary,
    filterGenre,
    filterAuthor,
    availability,
    bookLibraryIds,
  ]);

  const handleReserve = (book) => {
    setSelectedBook(book);
    setReserveForm({ libraryId: null, startDate: null, endDate: null });
    setReserveLibraries([]);
    getLibrariesForBook(book.id)
      .then((res) => setReserveLibraries(res.data))
      .catch(() => setReserveLibraries([]));
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

  const handleToggleFavorite = (bookId) => {
    const isAlreadyFavorite = favoriteBookIds.some(
      (id) => String(id) === String(bookId),
    );

    if (isAlreadyFavorite) {
      removeFromWishlist(bookId)
        .then(() => {
          message.success("Carte eliminată de la favorite!");
          setFavoriteBookIds((prev) =>
            prev.filter((id) => String(id) !== String(bookId)),
          );
        })
        .catch(() => message.error("A apărut o eroare!"));
    } else {
      addToWishlist(bookId, { date: new Date().toISOString().split("T")[0] })
        .then(() => {
          message.success("Carte adăugată la favorite!");
          setFavoriteBookIds((prev) => [...prev, String(bookId)]);
        })
        .catch(() => message.error("A apărut o eroare!"));
    }
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
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
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

      {/* Bara de filtre */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <Select
          allowClear
          placeholder="Disponibilitate"
          value={filterAvailable}
          onChange={(v) => setFilterAvailable(v ?? null)}
          style={{ minWidth: 160 }}
          options={[
            { value: true, label: "Disponibilă" },
            { value: false, label: "Indisponibilă" },
          ]}
        />
        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          placeholder="Bibliotecă"
          value={filterLibrary}
          onChange={(v) => setFilterLibrary(v ?? null)}
          style={{ minWidth: 200 }}
          options={libraries.map((l) => ({
            value: l.id,
            label: `${l.name} - ${l.city}`,
          }))}
        />
        <Select
          allowClear
          showSearch
          placeholder="Gen"
          value={filterGenre}
          onChange={(v) => setFilterGenre(v ?? null)}
          style={{ minWidth: 160 }}
          options={genreOptions.map((g) => ({ value: g, label: g }))}
        />
        <Select
          allowClear
          showSearch
          placeholder="Autor"
          value={filterAuthor}
          onChange={(v) => setFilterAuthor(v ?? null)}
          style={{ minWidth: 200 }}
          options={authorOptions.map((a) => ({ value: a, label: a }))}
        />
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
                    onClick={() => handleToggleFavorite(book.id)}
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
                (b) => String(b.id) === String(rec.id),
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
                    {rec.imageUrl ? (
                      <img
                        src={rec.imageUrl}
                        alt={rec.title}
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

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "16px",
                        color: "#3D2314",
                        fontWeight: "bold",
                      }}
                    >
                      📚 {rec.title}
                    </div>
                    {rec.author && (
                      <div style={{ fontSize: "13px", color: "#8c8c8c" }}>
                        {rec.author}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#8c8c8c",
                        marginTop: "8px",
                      }}
                    >
                      {rec.reason}
                    </div>

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
                          onClick={() => handleToggleFavorite(foundBook.id)}
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
              value={reserveForm.libraryId}
              notFoundContent="Momentan nu există exemplare disponibile"
              options={reserveLibraries.map((l) => ({
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
