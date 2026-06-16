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
      {/* NAVBAR */}
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

      {/* BANNER */}
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
        {/* Text stânga */}
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

        {/* Logo 3D dreapta — înlocuiește Book3D */}
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

      {/* CĂRȚI */}
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

      {/* BIBLIOTECI */}
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

      {/* CONTACT */}
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

      {/* FOOTER */}
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
