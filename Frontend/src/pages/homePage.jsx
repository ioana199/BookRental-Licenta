/*
import { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Card,
  Typography,
  Form,
  Input,
  message,
  Empty,
} from "antd";
import { useNavigate } from "react-router-dom";
import { getAllBooks } from "../api/bookApi";
import { getAllLibraries } from "../api/libraryApi";
import axiosInstance from "../api/axiosInstance";
import publicAxios from "../api/publicAxios";
import { useKeycloak } from "@react-keycloak/web";
import Logo3D from "../components/Book3D";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function HomePage() {
  const [books, setBooks] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [contactForm] = Form.useForm();
  const [contactLoading, setContactLoading] = useState(false);
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();
  const isAuthenticated = keycloak.authenticated;

  useEffect(() => {
    publicAxios.get("/books/all").then((res) => setBooks(res.data));
    publicAxios.get("/libraries/all").then((res) => setLibraries(res.data));
  }, []);

  const handleContact = () => {
    contactForm.validateFields().then((values) => {
      setContactLoading(true);
      axiosInstance
        .post("/contact", values)
        .then(() => {
          message.success("Mesaj trimis cu succes!");
          contactForm.resetFields();
        })
        .catch(() => message.error("A apărut o eroare!"))
        .finally(() => setContactLoading(false));
    });
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 48px",
          height: "80px",
          background: "#3D2314",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <img
          src="/logo2.svg"
          alt="BookRental"
          style={{
            height: "140px",
            cursor: "pointer",
            objectFit: "contain",
            objectPosition: "left center",
            display: "block",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          <a href="#books" style={{ color: "white", textDecoration: "none" }}>
            Cărți
          </a>
          <a
            href="#libraries"
            style={{ color: "white", textDecoration: "none" }}
          >
            Biblioteci
          </a>
          <a href="#contact" style={{ color: "white", textDecoration: "none" }}>
            Contact
          </a>
          {isAuthenticated ? (
            <Button
              type="primary"
              onClick={() =>
                navigate(
                  keycloak.tokenParsed?.realm_access?.roles?.includes("user")
                    ? "/user/books"
                    : "/librarian/users",
                )
              }
              style={{
                borderRadius: "8px",
                background: "#e8896a",
                borderColor: "#e8896a",
              }}
            >
              Mergi la aplicație
            </Button>
          ) : (
            <>
              <Button
                onClick={() => navigate("/register")}
                style={{ borderRadius: "8px" }}
              >
                Înregistrare
              </Button>
              <Button
                type="primary"
                onClick={() => navigate("/")}
                style={{
                  borderRadius: "8px",
                  background: "#e8896a",
                  borderColor: "#e8896a",
                }}
              >
                Autentificare
              </Button>
            </>
          )}
        </div>
      </div>

      <div
        style={{
          background: "linear-gradient(135deg, #3D2314 0%, #5C3D2E 100%)",
          padding: "80px 48px",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "48px",
        }}
      >

      <div style={{ flex: 1, maxWidth: "600px" }}>
          <Title
            style={{ color: "#F5C6A0", fontSize: "48px", marginBottom: "16px" }}
          >
            Bine ai venit la BookRental
          </Title>
          <Paragraph
            style={{ color: "#F5EDE3", fontSize: "18px", marginBottom: "32px" }}
          >
            Descoperă mii de cărți disponibile în bibliotecile din orașul tău.
            Rezervă online, simplu și rapid.
          </Paragraph>
          <div style={{ display: "flex", gap: "16px" }}>
            {isAuthenticated ? (
              <Button
                size="large"
                type="primary"
                onClick={() => navigate("/user/books")}
                style={{
                  background: "#E8896A",
                  borderColor: "#E8896A",
                  borderRadius: "8px",
                }}
              >
                Mergi la aplicație
              </Button>
            ) : (
              <>
                <Button
                  size="large"
                  type="primary"
                  onClick={() => navigate("/register")}
                  style={{
                    background: "#E8896A",
                    borderColor: "#E8896A",
                    borderRadius: "8px",
                  }}
                >
                  Creează cont gratuit
                </Button>
                <Button
                  size="large"
                  onClick={() => navigate("/")}
                  style={{
                    borderRadius: "8px",
                    borderColor: "#F5C6A0",
                    color: "#F5C6A0",
                    background: "transparent",
                  }}
                >
                  Autentifică-te
                </Button>
              </>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Logo3D logoUrl="/logo2.svg" width={450} height={450} />{" "}
          <span
            style={{
              color: "#F5C6A0",
              fontSize: "12px",
              marginTop: "-8px",
              opacity: 0.7,
            }}
          ></span>
        </div>
      </div>

      <div id="books" style={{ padding: "64px 48px", background: "#fdf8f5" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
          Cărți disponibile
        </Title>
        {books.length === 0 ? (
          <Empty description="Nu există cărți" />
        ) : (
          <Row gutter={[32, 40]}>
            {books.map((book) => (
              <Col key={book.id} xs={12} sm={8} md={6} lg={4}>
                <div
                  style={{ cursor: "default", transition: "transform 0.2s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-8px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  <div
                    style={{
                      width: "100%",
                      paddingBottom: "150%",
                      position: "relative",
                      borderRadius: "4px 8px 8px 4px",
                      overflow: "hidden",
                      boxShadow: "4px 4px 12px rgba(0,0,0,0.25)",
                    }}
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
                          background:
                            "linear-gradient(135deg, #e8896a, #f5c6a0)",
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
                        <Text
                          strong
                          style={{ color: "white", fontSize: "12px" }}
                        >
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
                  </div>
                  <Button
                    block
                    size="small"
                    style={{ marginTop: "8px" }}
                    onClick={() =>
                      navigate(isAuthenticated ? "/user/books" : "/")
                    }
                  >
                    {isAuthenticated
                      ? "Mergi la aplicație"
                      : "Autentifică-te pentru a rezerva"}
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <div
        id="libraries"
        style={{ padding: "64px 48px", background: "#FDF8F5 " }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
          Bibliotecile noastre
        </Title>
        {libraries.length === 0 ? (
          <Empty description="Nu există biblioteci" />
        ) : (
          <Row gutter={[24, 24]}>
            {libraries.map((library) => (
              <Col key={library.id} xs={24} sm={12} md={8} lg={6}>
                <Card hoverable style={{ borderRadius: "12px" }}>
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

      <div id="contact" style={{ padding: "64px 48px", background: "#fdf8f5" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
          Contactează-ne
        </Title>
        <Card style={{ maxWidth: 600, margin: "0 auto", borderRadius: "12px" }}>
          <Form form={contactForm} layout="vertical">
            <Form.Item
              name="name"
              label="Nume"
              rules={[{ required: true, message: "Numele este obligatoriu" }]}
            >
              <Input placeholder="Numele tău" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Email-ul este obligatoriu" },
                { type: "email", message: "Email invalid" },
              ]}
            >
              <Input placeholder="email@exemplu.com" />
            </Form.Item>
            <Form.Item
              name="message"
              label="Mesaj"
              rules={[{ required: true, message: "Mesajul este obligatoriu" }]}
            >
              <TextArea rows={4} placeholder="Scrie mesajul tău aici..." />
            </Form.Item>
            <Button
              type="primary"
              block
              onClick={handleContact}
              loading={contactLoading}
              style={{
                background: "#e8896a",
                borderColor: "#e8896a",
                borderRadius: "8px",
              }}
            >
              Trimite mesaj
            </Button>
          </Form>
        </Card>
      </div>

      <div
        style={{
          background: "#3D2314 ",
          color: "#ccc",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <Text style={{ color: "#ccc" }}>
          © 2026 BookRental. Toate drepturile rezervate.
        </Text>
      </div>
    </div>
  );
}

export default HomePage;
*/
import { useEffect, useState } from "react";
import { Button, Form, Input, message, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import publicAxios from "../api/publicAxios";
import axiosInstance from "../api/axiosInstance";
import { useKeycloak } from "@react-keycloak/web";
import BookMedallion3D from "../components/BookMedallion3D";
import "./homePage.css";

const { TextArea } = Input;

function HomePage() {
  const [books, setBooks] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [contactForm] = Form.useForm();
  const [contactLoading, setContactLoading] = useState(false);
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();
  const isAuthenticated = keycloak.authenticated;

  useEffect(() => {
    publicAxios.get("/books/all").then((res) => setBooks(res.data));
    publicAxios.get("/libraries/all").then((res) => setLibraries(res.data));
  }, []);

  const handleContact = () => {
    contactForm.validateFields().then((values) => {
      setContactLoading(true);
      axiosInstance
        .post("/contact", values)
        .then(() => {
          message.success("Mesaj trimis cu succes!");
          contactForm.resetFields();
        })
        .catch(() => message.error("A apărut o eroare!"))
        .finally(() => setContactLoading(false));
    });
  };

  const goToApp = () =>
    navigate(
      keycloak.tokenParsed?.realm_access?.roles?.includes("user")
        ? "/user/books"
        : "/librarian/users",
    );

  return (
    <div className="home">
      {/* NAVBAR */}
      <header className="home-nav">
        <div
          className="home-nav__brand"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="home-nav__logo">BookRental</span>
          <span className="home-nav__tag">RENT A BOOK, TAKE A LOOK</span>
        </div>
        <nav className="home-nav__links">
          <a href="#books">Cărți</a>
          <a href="#libraries">Biblioteci</a>
          <a href="#contact">Contact</a>
          {isAuthenticated ? (
            <Button type="primary" className="btn-primary" onClick={goToApp}>
              Mergi la aplicație
            </Button>
          ) : (
            <>
              <Button
                className="btn-ghost"
                onClick={() => navigate("/register")}
              >
                Înregistrare
              </Button>
              <Button
                type="primary"
                className="btn-primary"
                onClick={() => navigate("/")}
              >
                Autentificare
              </Button>
            </>
          )}
        </nav>
      </header>

      {/* BANNER */}
      <section className="home-hero">
        <div className="home-hero__inner">
          <div className="home-hero__text">
            <div className="br-eyebrow home-hero__eyebrow">
              Biblioteca ta digitală
            </div>
            <h1 className="home-hero__title">
              Bine ai venit la <em>BookRental.</em>
            </h1>
            <p className="home-hero__lead">
              Descoperă mii de cărți disponibile în bibliotecile din orașul tău.
              Rezervă online, simplu și rapid.
            </p>
            <div className="home-hero__cta">
              {isAuthenticated ? (
                <Button
                  size="large"
                  type="primary"
                  className="btn-primary"
                  onClick={() => navigate("/user/books")}
                >
                  Mergi la aplicație
                </Button>
              ) : (
                <>
                  <Button
                    size="large"
                    type="primary"
                    className="btn-primary"
                    onClick={() => navigate("/register")}
                  >
                    Creează cont gratuit
                  </Button>
                  <Button
                    size="large"
                    className="btn-outline-light"
                    onClick={() => navigate("/")}
                  >
                    Autentifică-te
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="home-hero__art">
            <BookMedallion3D size={320} />
            <span className="home-hero__hint">trage pentru a roti · 3D</span>
          </div>
        </div>
      </section>

      {/* CĂRȚI */}
      <section id="books" className="home-section">
        <div className="home-section__head">
          <div className="br-eyebrow">Acum în catalog</div>
          <h2 className="home-section__title">Cărți disponibile</h2>
        </div>
        {books.length === 0 ? (
          <Empty description="Nu există cărți" />
        ) : (
          <>
            <div className="home-books">
              {books.slice(0, 12).map((book) => (
                <div
                  className="home-book"
                  key={book.id}
                  onClick={() =>
                    navigate(isAuthenticated ? `/user/books/${book.id}` : "/")
                  }
                >
                  <div className="home-book__cover">
                    {book.imageUrl ? (
                      <img src={book.imageUrl} alt={book.title} />
                    ) : (
                      <div className="home-book__fallback">
                        <span>📚</span>
                        <strong>{book.title}</strong>
                      </div>
                    )}
                  </div>
                  <div className="home-book__title">{book.title}</div>
                  <div className="home-book__author">
                    {book.authorFirstName} {book.authorLastName}
                  </div>
                </div>
              ))}
            </div>
            <div className="home-books__more">
              <Button
                className="btn-more"
                onClick={() => navigate(isAuthenticated ? "/user/books" : "/")}
              >
                {isAuthenticated
                  ? "Vezi toate cărțile →"
                  : "Autentifică-te pentru mai mult →"}
              </Button>
            </div>
          </>
        )}
      </section>

      {/* BIBLIOTECI */}
      <section id="libraries" className="home-libraries">
        <div className="home-section__head">
          <div className="br-eyebrow">Rețeaua noastră</div>
          <h2 className="home-section__title">Bibliotecile noastre</h2>
        </div>
        {libraries.length === 0 ? (
          <Empty description="Nu există biblioteci" />
        ) : (
          <div className="home-lib-grid">
            {libraries.map((library) => (
              <div className="lib-card" key={library.id}>
                <div className="lib-card__icon">
                  <svg
                    width="24"
                    height="24"
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
                <div className="lib-card__name">{library.name}</div>
                <div className="lib-card__meta">
                  <span className="lib-card__city">
                    <i></i>
                    {library.city}
                  </span>
                  <span className="lib-card__contact">{library.email}</span>
                  <span className="lib-card__contact">
                    {library.phoneNumber}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CONTACT */}
      <section id="contact" className="home-contact">
        <div className="home-section__head">
          <div className="br-eyebrow">Ai o întrebare?</div>
          <h2 className="home-section__title">Contactează-ne</h2>
        </div>
        <div className="contact-card">
          <Form form={contactForm} layout="vertical">
            <div className="contact-row">
              <Form.Item
                name="name"
                label="Nume"
                rules={[{ required: true, message: "Numele este obligatoriu" }]}
              >
                <Input placeholder="Numele tău" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Email-ul este obligatoriu" },
                  { type: "email", message: "Email invalid" },
                ]}
              >
                <Input placeholder="email@exemplu.com" />
              </Form.Item>
            </div>
            <Form.Item
              name="message"
              label="Mesaj"
              rules={[{ required: true, message: "Mesajul este obligatoriu" }]}
            >
              <TextArea rows={4} placeholder="Scrie mesajul tău aici..." />
            </Form.Item>
            <Button
              type="primary"
              block
              className="btn-primary"
              onClick={handleContact}
              loading={contactLoading}
            >
              Trimite mesaj
            </Button>
          </Form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="home-footer__brand">
          <span className="home-footer__logo">BookRental</span>
          <span className="home-footer__tag">RENT A BOOK, TAKE A LOOK</span>
        </div>
        <div className="home-footer__links">
          <a href="#books">Cărți</a>
          <a href="#libraries">Biblioteci</a>
          <a href="#contact">Contact</a>
        </div>
        <span className="home-footer__copy">© 2026 BookRental</span>
      </footer>
    </div>
  );
}

export default HomePage;
