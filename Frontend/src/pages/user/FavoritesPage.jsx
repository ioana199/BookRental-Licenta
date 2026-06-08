import { useEffect, useState } from 'react';
import { Row, Col, Typography, Empty, Spin, Button, message } from 'antd';
import { getMyWishlists, removeFromWishlist } from '../../api/wishlistApi';
import { getAllBooks } from '../../api/bookApi';
import { addToWishlist } from '../../api/wishlistApi';

const { Title, Text } = Typography;

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = () => {
    setLoading(true);
    getMyWishlists({})
      .then((res) => setFavorites(res.data.content || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = (bookId) => {
    removeFromWishlist(bookId)
      .then(() => {
        message.success('Carte eliminată din favorite!');
        fetchFavorites();
      })
      .catch(() => message.error('A apărut o eroare!'));
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px' }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: '32px' }}>
      <Title level={2}>Cărțile mele favorite</Title>
      {favorites.length === 0 ? (
        <Empty description="Nu ai cărți favorite încă" />
      ) : (
        <Row gutter={[32, 40]}>
          {favorites.map((wishlist) => (
            <Col key={wishlist.id} xs={12} sm={8} md={6} lg={4}>
              <div
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
  width: '100%',
  paddingBottom: '150%',
  position: 'relative',
  borderRadius: '4px 8px 8px 4px',
  overflow: 'hidden',
  boxShadow: '4px 4px 12px rgba(0,0,0,0.25)',
}}>
  {wishlist.imageUrl ? (
    <img
      src={wishlist.imageUrl}
      alt={wishlist.bookName}
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
      <Text strong style={{ color: 'white', fontSize: '12px' }}>{wishlist.bookName}</Text>
    </div>
  )}
</div>

                <div style={{ marginTop: '10px' }}>
                  <Text strong style={{ fontSize: '13px', display: 'block' }}>{wishlist.bookName}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>{wishlist.userFirstName}</Text>
                </div>

                <Button
                  danger
                  size="small"
                  block
                  style={{ marginTop: '8px' }}
                  onClick={() => handleRemove(wishlist.bookId)}
                >
                  Elimină din favorite
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default FavoritesPage;