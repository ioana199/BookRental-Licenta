import { useEffect, useState } from 'react';
import { Table, Input, Typography, Space } from 'antd';
import { getAllUsers } from '../../api/userApi';

const { Title } = Typography;
const { Search } = Input;

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then((res) => {
        setUsers(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (value) => {
    const val = value.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.firstName?.toLowerCase().includes(val) ||
          u.lastName?.toLowerCase().includes(val) ||
          u.email?.toLowerCase().includes(val)
      )
    );
  };

  const columns = [
  { title: 'Prenume', dataIndex: 'firstName', key: 'firstName', sorter: (a, b) => a.firstName?.localeCompare(b.firstName) },
  { title: 'Nume', dataIndex: 'lastName', key: 'lastName', sorter: (a, b) => a.lastName?.localeCompare(b.lastName) },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Oraș', dataIndex: ['address', 'city'], key: 'city' },
  { title: 'Țară', dataIndex: ['address', 'country'], key: 'country' },
];

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Title level={3}>Lista utilizatori</Title>
        <Search
          placeholder="Caută după nume sau email..."
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 400 }}
          allowClear
        />
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Space>
    </div>
  );
}

export default UserListPage;