/*
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { ConfigProvider } from 'antd';
import keycloak from './auth/keycloak';
import App from './App.jsx';
import './index.css';

const theme = {
  token: {
    colorPrimary: '#E8896A',
    colorPrimaryHover: '#C45C3A',
    colorBgBase: '#FDF8F5',
    colorBgContainer: '#FFFFFF',
    colorBgLayout: '#F5EDE3',
    colorText: '#3D2314',
    colorTextSecondary: '#7D5A4F',
    colorBorder: '#E8C9B5',
    colorBorderSecondary: '#F0DDD0',
    borderRadius: 8,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  components: {
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#F5C6A0',
      itemSelectedColor: '#C45C3A',
      itemHoverBg: '#F5EDE3',
      itemHoverColor: '#E8896A',
    },
    Button: {
      primaryColor: '#FFFFFF',
    },
    Table: {
      headerBg: '#F5EDE3',
      rowHoverBg: '#FDF8F5',
    },
    Card: {
      colorBgContainer: '#FFFFFF',
    },
    Layout: {
      siderBg: '#FDF8F5',
      bodyBg: '#F5EDE3',
    },
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <ReactKeycloakProvider authClient={keycloak}>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </ReactKeycloakProvider>
);

*/

import React from "react";
import ReactDOM from "react-dom/client";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { ConfigProvider } from "antd";
import keycloak from "./auth/keycloak";
import App from "./App.jsx";
import "./index.css";
import "./styles/theme.css"; // ← NOU: sistemul de design comun (paletă + utilitare)

const theme = {
  token: {
    colorPrimary: "#E8896A",
    colorPrimaryHover: "#C45C3A",
    colorBgBase: "#FDF8F5",
    colorBgContainer: "#FFFFFF",
    colorBgLayout: "#F5EDE3",
    colorText: "#3D2314",
    colorTextSecondary: "#7D5A4F",
    colorBorder: "#E8C9B5",
    colorBorderSecondary: "#F0DDD0",
    borderRadius: 8,
    // ← actualizat: font de interfață modern, în ton cu designul
    fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
  },
  components: {
    Menu: {
      itemBg: "transparent",
      itemSelectedBg: "#F5C6A0",
      itemSelectedColor: "#C45C3A",
      itemHoverBg: "#F5EDE3",
      itemHoverColor: "#E8896A",
    },
    Button: {
      primaryColor: "#FFFFFF",
      fontWeight: 600,
    },
    Table: {
      headerBg: "#F5EDE3",
      rowHoverBg: "#FDF8F5",
      headerColor: "#A0876D",
    },
    Card: {
      colorBgContainer: "#FFFFFF",
    },
    Layout: {
      siderBg: "#FDF8F5",
      bodyBg: "#F5EDE3",
    },
    Modal: {
      borderRadiusLG: 16,
    },
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <ReactKeycloakProvider authClient={keycloak}>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </ReactKeycloakProvider>,
);
