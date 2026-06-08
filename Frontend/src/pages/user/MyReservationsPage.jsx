import { useEffect, useState } from 'react';
import { Typography, Table, Tag, Empty, Spin, message } from 'antd';
import { getMyReservations } from '../../api/reservationApi';
import { useKeycloak } from '@react-keycloak/web';

const { Title } = Typography;

const statusColors = {
  PENDING: 'orange',
  IN_PROGRESS: 'blue',
  FINISHED: 'green',
  DELAYED: 'red',
  CANCELED: 'gray',
};

function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { keycloak } = useKeycloak();

  const userId = keycloak.tokenParsed?.user_id;

  useEffect(() => {
    getMyReservations()
    .then((res) => setReservations(res.data))
    .catch(() => message.error('A apărut o eroare!'))
    .finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Book Name', dataIndex: 'bookName', key: 'bookName' },
    { title: 'Data început', dataIndex: 'startDate', key: 'startDate' },
    { title: 'Data sfârșit', dataIndex: 'endDate', key: 'endDate' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
  ];

  if (loading) return <div style={{ textAlign: 'center', padding: '80px' }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: '32px' }}>
      <Title level={2}>Rezervările mele</Title>
      {reservations.length === 0 ? (
        <Empty description="Nu ai nicio rezervare" />
      ) : (
        <Table
          dataSource={reservations}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
}

export default MyReservationsPage;