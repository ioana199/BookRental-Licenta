/*
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
*/

import { useEffect, useState } from "react";
import { Empty, Spin, message } from "antd";
import { getMyReservations } from "../../api/reservationApi";
import { getAllBooks } from "../../api/bookApi";
import { useKeycloak } from "@react-keycloak/web";
import "./MyReservationsPage.css";

// Etichete RO pentru status (culoarea vine din clasa .br-badge.is-STATUS)
const statusLabels = {
  PENDING: "În așteptare",
  IN_PROGRESS: "În curs",
  FINISHED: "Finalizată",
  DELAYED: "Întârziată",
  CANCELED: "Anulată",
};

function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [coverByName, setCoverByName] = useState({});
  const [loading, setLoading] = useState(true);
  const { keycloak } = useKeycloak();

  const userId = keycloak.tokenParsed?.user_id;

  useEffect(() => {
    getMyReservations()
      .then((res) => setReservations(res.data))
      .catch(() => message.error("A apărut o eroare!"))
      .finally(() => setLoading(false));

    // DTO-ul de rezervare nu conține coperta → o aducem prin titlu
    getAllBooks()
      .then((res) => {
        const map = {};
        res.data.forEach((b) => {
          if (b.title && b.imageUrl)
            map[b.title.trim().toLowerCase()] = b.imageUrl;
        });
        setCoverByName(map);
      })
      .catch(() => {});
  }, []);

  const coverFor = (name) =>
    name ? coverByName[name.trim().toLowerCase()] : undefined;

  if (loading)
    return (
      <div className="res-loading">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="res-page br-page">
      <div className="res-head">
        <div className="br-eyebrow">Istoricul tău</div>
        <h1 className="br-title">Rezervările mele</h1>
      </div>

      {reservations.length === 0 ? (
        <Empty description="Nu ai nicio rezervare" />
      ) : (
        <div className="res-list">
          {reservations.map((r) => {
            const cover = coverFor(r.bookName);
            return (
              <div className="res-card" key={r.id}>
                <div className="res-id">#{r.id}</div>
                <div className="res-thumb">
                  {cover ? (
                    <img src={cover} alt={r.bookName} />
                  ) : (
                    <span className="res-thumb__mono">
                      {(r.bookName || "?").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="res-info">
                  <div className="res-title">{r.bookName}</div>
                  <div className="res-dates">
                    <span>{r.startDate}</span>
                    <span className="res-arrow">→</span>
                    <span>{r.endDate}</span>
                  </div>
                </div>
                <span className={`br-badge is-${r.status}`}>
                  {statusLabels[r.status] || r.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyReservationsPage;
