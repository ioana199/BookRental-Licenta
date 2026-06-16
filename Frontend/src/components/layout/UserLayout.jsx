import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

const { Header, Content } = Layout;

function UserLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { keycloak } = useKeycloak();

  const menuItems = [
    { key: "/home", label: "Acasă" },
    { key: "/user/libraries", label: "Biblioteci" },
    { key: "/user/books", label: "Cărți" },
    { key: "/user/favorites", label: "Favorite" },
    { key: "/user/reservations", label: "Rezervările mele" },
    { key: "/user/profile", label: "Profilul meu" },
  ];

  return (
    <Layout style={{ minHeight: "100vh", overflow: "visible" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "#3D2314",
          overflow: "visible",
          height: "80px",
          lineHeight: "80px",
        }}
      >
        <div
          style={{
            color: "#F5C6A0",
            fontWeight: "bold",
            fontSize: "20px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/home")}
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
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ flex: 1, marginLeft: "24px", background: "#3D2314" }}
        />
        <div
          onClick={() => keycloak.logout()}
          style={{ color: "#F5C6A0", cursor: "pointer", marginLeft: "24px" }}
        >
          Deconectare
        </div>
      </Header>
      <Content style={{ padding: "24px", marginTop: "16px" }}>
        {children}
      </Content>
    </Layout>
  );
}

export default UserLayout;
