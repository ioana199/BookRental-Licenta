import { useEffect, useState } from 'react';
import { Input, Typography, Row, Col, Empty, Spin, Modal, Button, DatePicker, Select,  message } from 'antd';
import { getAllBooks } from '../../api/bookApi';
import { getAllLibraries } from '../../api/libraryApi';
import { createReservation } from '../../api/reservationApi';
import { useKeycloak } from '@react-keycloak/web';
import { getAllUsers } from '../../api/userApi';
import { addToWishlist } from '../../api/wishlistApi';
import dayjs from 'dayjs';

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
  const [reserveForm, setReserveForm] = useState({ libraryId: null, startDate: null, endDate: null });
  const { keycloak } = useKeycloak();

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
        if (user) setUserId(user.id);
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
          b.authorLastName?.toLowerCase().includes(val)
      )
    );
  };

  const handleReserve = (book) => {
    setSelectedBook(book);
    setReserveModalOpen(true);
  };

  const handleAddToFavorites = (bookId) => {
  addToWishlist(bookId, { date: new Date().toISOString().split('T')[0] })
    .then(() => message.success('Carte adăugată la favorite!'))
    .catch(() => message.error('A apărut o eroare!'));
};

 const handleReserveSubmit = () => {
  if (!reserveForm.libraryId || !reserveForm.startDate || !reserveForm.endDate) {
    message.warning('Te rugăm să completezi toate câmpurile!');
    return;
  }
  createReservation(selectedBook.id, reserveForm.libraryId, {
    startDate: reserveForm.startDate.format('YYYY-MM-DD'),
    endDate: reserveForm.endDate.format('YYYY-MM-DD'),
  })
    .then(() => {
      message.success('Rezervare efectuată cu succes! Vei primi un email de confirmare.');
      setReserveModalOpen(false);
      setReserveForm({ libraryId: null, startDate: null, endDate: null });
    })
    .catch(() => {
      message.error('Nu s-a putut efectua rezervarea. Verifică disponibilitatea!');
    });
};

  if (loading) return <div style={{ textAlign: 'center', padding: '80px' }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: '32px' }}>
      <Title level={2}>Cărți disponibile</Title>
      <Search
        placeholder="Caută după titlu sau autor..."
        onChange={(e) => handleSearch(e.target.value)}
        style={{ maxWidth: 400, marginBottom: '32px' }}
        allowClear
      />
      {filtered.length === 0 ? (
        <Empty description="Nu s-au găsit cărți" />
      ) : (
        <Row gutter={[32, 40]}>
          {filtered.map((book) => (
            <Col key={book.id} xs={12} sm={8} md={6} lg={4}>
              <div
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Coperta */}
                <div
                  style={{
                    width: '100%',
                    paddingBottom: '150%',
                    position: 'relative',
                    borderRadius: '4px 8px 8px 4px',
                    overflow: 'hidden',
                    boxShadow: '4px 4px 12px rgba(0,0,0,0.25), -2px 0 6px rgba(0,0,0,0.1)',
                  }}
                >
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #e8896a, #f5c6a0)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>📚</div>
                      <Text strong style={{ color: 'white', fontSize: '12px' }}>{book.title}</Text>
                    </div>
                  )}
                </div>

                {/* Info sub copertă */}
                <div style={{ marginTop: '10px' }}>
                  <Text strong style={{ fontSize: '13px', display: 'block' }}>{book.title}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {book.authorFirstName} {book.authorLastName}
                  </Text>
                </div>

              <Button
                type="primary"
                size="small"
                block
                style={{ marginTop: '8px' }}
                onClick={() => handleReserve(book)}
              >
                Rezervă
              </Button>
              <Button
                size="small"
                block
                style={{ marginTop: '4px' }}
                onClick={() => handleAddToFavorites(book.id)}
              >
                ❤️ Favorite
              </Button>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal rezervare */}
      <Modal
        title={`Rezervă: ${selectedBook?.title}`}
        open={reserveModalOpen}
        onOk={handleReserveSubmit}
        onCancel={() => setReserveModalOpen(false)}
        okText="Rezervă"
        cancelText="Anulează"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          <div>
            <Text>Bibliotecă</Text>
            <Select
              placeholder="Selectează biblioteca"
              style={{ width: '100%', marginTop: '4px' }}
              options={libraries.map((l) => ({ value: l.id, label: `${l.name} - ${l.city}` }))}
              onChange={(val) => setReserveForm({ ...reserveForm, libraryId: val })}
            />
          </div>
          <div>
            <Text>Data început</Text>
            <DatePicker
              style={{ width: '100%', marginTop: '4px' }}
              onChange={(date) => setReserveForm({ ...reserveForm, startDate: date })}
            />
          </div>
          <div>
            <Text>Data sfârșit</Text>
            <DatePicker
              style={{ width: '100%', marginTop: '4px' }}
              onChange={(date) => setReserveForm({ ...reserveForm, endDate: date })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BooksPage;
/*
import { useEffect, useState } from 'react';
import { Input, Typography, Row, Col, Card, Button, Empty, Spin } from 'antd';
import { getAllBooks } from '../../api/bookApi';

const { Title, Text } = Typography;
const { Search } = Input;
const { Meta } = Card;

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBooks()
      .then((res) => {
        setBooks(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (value) => {
    const val = value.toLowerCase();
    setFiltered(
      books.filter(
        (b) =>
          b.title?.toLowerCase().includes(val) ||
          b.authorFirstName?.toLowerCase().includes(val) ||
          b.authorLastName?.toLowerCase().includes(val) ||
          b.publisherName?.toLowerCase().includes(val)
      )
    );
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px' }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Cărți disponibile</Title>
      <Search
        placeholder="Caută după titlu, autor sau publisher..."
        onChange={(e) => handleSearch(e.target.value)}
        style={{ maxWidth: 400, marginBottom: '24px' }}
        allowClear
      />
      {filtered.length === 0 ? (
        <Empty description="Nu s-au găsit cărți" />
      ) : (
        <Row gutter={[24, 24]}>
          {filtered.map((book) => (
            <Col key={book.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  book.imageUrl ? (
                    <img
                      alt={book.title}
                      src={book.imageUrl}
                      style={{ height: '280px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      height: '280px',
                      background: 'linear-gradient(135deg, #f5c6a0, #e8896a)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px'
                    }}>
                      📚
                    </div>
                  )
                }
                style={{ borderRadius: '12px', overflow: 'hidden' }}
              >
                <Meta
                  title={book.title}
                  description={
                    <div>
                      <Text type="secondary">{book.authorFirstName} {book.authorLastName}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>{book.publisherName}</Text>
                    </div>
                  }
                />
                <Button
                  type="primary"
                  block
                  style={{ marginTop: '12px' }}
                  onClick={() => {}}
                >
                  Rezervă
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default BooksPage;
*/