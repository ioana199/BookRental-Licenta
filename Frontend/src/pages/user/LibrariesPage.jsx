import { useEffect, useState } from 'react';
import { Input, Typography, Row, Col, Card, Empty, Spin } from 'antd';
import { getAllLibraries } from '../../api/libraryApi';

const { Title, Text } = Typography;
const { Search } = Input;

function LibrariesPage() {
  const [libraries, setLibraries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllLibraries()
      .then((res) => {
        setLibraries(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (value) => {
    const val = value.toLowerCase();
    setFiltered(
      libraries.filter(
        (l) =>
          l.name?.toLowerCase().includes(val) ||
          l.city?.toLowerCase().includes(val) ||
          l.email?.toLowerCase().includes(val)
      )
    );
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px' }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: '32px' }}>
      <Title level={2}>Biblioteci</Title>
      <Search
        placeholder="Caută după nume, oraș sau email..."
        onChange={(e) => handleSearch(e.target.value)}
        style={{ maxWidth: 400, marginBottom: '32px' }}
        allowClear
      />
      {filtered.length === 0 ? (
        <Empty description="Nu s-au găsit biblioteci" />
      ) : (
        <Row gutter={[24, 24]}>
          {filtered.map((library) => (
            <Col key={library.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{ borderRadius: '12px' }}
              >
                <div style={{ fontSize: '40px', textAlign: 'center', marginBottom: '12px' }}>🏛️</div>
                <Title level={5} style={{ textAlign: 'center', marginBottom: '8px' }}>{library.name}</Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
  );
}

export default LibrariesPage;