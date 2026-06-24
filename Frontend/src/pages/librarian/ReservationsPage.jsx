/*
import { useEffect, useState } from "react";
import { Table, Select, Typography, message, Space, Tag } from "antd";
import axiosInstance from "../../api/axiosInstance";
import {
  getAllReservations,
  updateReservationStatus,
} from "../../api/reservationApi";

const { Title } = Typography;

const statusColors = {
  PENDING: "orange",
  IN_PROGRESS: "blue",
  FINISHED: "green",
  DELAYED: "red",
  CANCELED: "gray",
};

const nextStatuses = {
  PENDING: ["IN_PROGRESS"],
  IN_PROGRESS: ["FINISHED", "DELAYED"],
  DELAYED: [],
  FINISHED: [],
  CANCELED: [],
};

function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = () => {
    setLoading(true);
    getAllReservations()
      .then((res) => {
        console.log("rezervari:", res.data);
        setReservations(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    updateReservationStatus(id, newStatus)
      .then(() => {
        message.success("Status actualizat!");
        fetchReservations();
      })
      .catch(() => message.error("A apărut o eroare!"));
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "ID utilizator", dataIndex: "userId", key: "userId" },
    {
      title: "Nume Prenume",
      key: "userName",
      render: (_, record) =>
        `${record.userFirstName || ""} ${record.userLastName || ""}`,
    },
    { title: "ID exemplar", dataIndex: "exemplaryId", key: "exemplaryId" },
    { title: "Titlu carte", dataIndex: "bookName", key: "bookName" },
    { title: "Data început", dataIndex: "startDate", key: "startDate" },
    { title: "Data sfârșit", dataIndex: "endDate", key: "endDate" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: "Schimbă status",
      key: "actions",
      render: (_, record) => {
        const options = nextStatuses[record.status] || [];
        if (options.length === 0) return "-";
        return (
          <Select
            placeholder="Selectează status"
            style={{ width: 150 }}
            options={options.map((s) => ({ value: s, label: s }))}
            onChange={(val) => handleStatusChange(record.id, val)}
          />
        );
      },
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Title level={3}>Rezervări</Title>
        <Table
          dataSource={reservations}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Space>
    </div>
  );
}

export default ReservationsPage;
*/

import { useEffect, useState } from "react";
import { Table, message } from "antd";
import {
  getAllReservations,
  updateReservationStatus,
} from "../../api/reservationApi";
import { Select } from "antd";
import "../../styles/management.css";

const statusLabels = {
  PENDING: "În așteptare",
  IN_PROGRESS: "În curs",
  FINISHED: "Finalizată",
  DELAYED: "Întârziată",
  CANCELED: "Anulată",
};

const nextStatuses = {
  PENDING: ["IN_PROGRESS"],
  IN_PROGRESS: ["FINISHED", "DELAYED"],
  DELAYED: [],
  FINISHED: [],
  CANCELED: [],
};

function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = () => {
    setLoading(true);
    getAllReservations()
      .then((res) => setReservations(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    updateReservationStatus(id, newStatus)
      .then(() => {
        message.success("Status actualizat!");
        fetchReservations();
      })
      .catch(() => message.error("A apărut o eroare!"));
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <span className="mgmt-mono">#{id}</span>,
    },
    {
      title: "Utiliz.",
      dataIndex: "userId",
      key: "userId",
      render: (id) => <span className="mgmt-mono">{id}</span>,
    },
    {
      title: "Nume Prenume",
      key: "userName",
      render: (_, record) =>
        `${record.userFirstName || ""} ${record.userLastName || ""}`,
    },
    {
      title: "Exemplar",
      dataIndex: "exemplaryId",
      key: "exemplaryId",
      render: (id) => <span className="mgmt-mono">{id}</span>,
    },
    { title: "Titlu carte", dataIndex: "bookName", key: "bookName" },
    {
      title: "Început",
      dataIndex: "startDate",
      key: "startDate",
      render: (d) => <span className="mgmt-mono">{d}</span>,
    },
    {
      title: "Sfârșit",
      dataIndex: "endDate",
      key: "endDate",
      render: (d) => <span className="mgmt-mono">{d}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={`br-badge is-${status}`}>
          {statusLabels[status] || status}
        </span>
      ),
    },
    {
      title: "Schimbă status",
      key: "actions",
      render: (_, record) => {
        const options = nextStatuses[record.status] || [];
        if (options.length === 0)
          return <span style={{ color: "#C9BCA8" }}>—</span>;
        return (
          <Select
            placeholder="Selectează"
            className="mgmt-status-select"
            options={options.map((s) => ({
              value: s,
              label: statusLabels[s] || s,
            }))}
            onChange={(val) => handleStatusChange(record.id, val)}
          />
        );
      },
    },
  ];

  return (
    <div className="mgmt-page">
      <div className="mgmt-head">
        <h1 className="mgmt-title">Rezervări</h1>
      </div>
      <div className="mgmt-card">
        <Table
          dataSource={reservations}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
}

export default ReservationsPage;
