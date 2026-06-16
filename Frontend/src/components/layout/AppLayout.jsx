import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

const { Sider, Content, Header } = Layout;

function AppLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { keycloak } = useKeycloak();

  const realmRoles = keycloak.tokenParsed?.realm_access?.roles || [];
  const clientRoles =
    keycloak.tokenParsed?.resource_access?.book_rental?.roles || [];
  const allRoles = [...realmRoles, ...clientRoles];

  const isAdmin = allRoles.includes("role_admin");
  const isLibrarian = allRoles.includes("librarian");

  const librarianMenuItems = [
    { key: "/home", label: "Acasă" },
    { key: "/librarian/users", label: "Listă utilizatori" },
    { key: "/librarian/publishers", label: "Edituri" },
    { key: "/librarian/books", label: "Cărți" },
    { key: "/librarian/authors", label: "Autori" },
    { key: "/librarian/exemplaries", label: "Exemplare" },
    { key: "/librarian/reservations", label: "Rezervări" },
  ];

  /*const adminMenuItems = [
    ...librarianMenuItems,
    { key: '/admin/libraries', label: 'Librării' },
    { key: '/admin/librarians', label: 'Librarians' },
  ];
*/
  const adminMenuItems = [
    { key: "/home", label: "Acasă" },
    { key: "/admin/users", label: "Gestionare utilizatori" },
    { key: "/admin/libraries", label: "Gestionare biblioteci" },
    { key: "/admin/librarians", label: "Gestionare bibliotecari" },
    { key: "/librarian/publishers", label: "Edituri" },
    { key: "/librarian/books", label: "Cărți" },
    { key: "/librarian/authors", label: "Autori" },
    { key: "/admin/exemplaries", label: "Exemplare" },
    { key: "/librarian/reservations", label: "Rezervări" },
  ];

  const userMenuItems = [
    { key: "/user/profile", label: "Profilul meu" },
    { key: "/user/libraries", label: "Librării" },
    { key: "/user/books", label: "Cărți" },
    { key: "/user/favorites", label: "Favorite" },
    { key: "/user/reviews", label: "Recenzii" },
    { key: "/user/reservations", label: "Rezervările mele" },
  ];

  const menuItems = isAdmin
    ? adminMenuItems
    : isLibrarian
      ? librarianMenuItems
      : userMenuItems;
  return (
    /*
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} theme="light">
        <div style={{ padding: '24px 16px', fontWeight: 'bold', fontSize: '18px' }}>
          📚 BookRental
        </div>
        */
    <Layout style={{ minHeight: "100vh", background: "#F5EDE3" }}>
      <Sider
        width={220}
        style={{ background: "#3D2314", borderRight: "none" }} // maro închis
      >
        <div
          style={{ padding: "16px", cursor: "pointer" }}
          onClick={() => navigate("/home")}
        >
          <img
            src="/logo2.svg"
            alt="BookRental"
            style={{ width: "100%", objectFit: "contain", display: "block" }}
          />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          theme="dark" // text alb pe fond maro
          style={{ background: "#3D2314" }}
        />
        <div
          style={{
            padding: "16px",
            position: "absolute",
            bottom: 0,
            width: "100%",
          }}
        >
          <button
            onClick={() => keycloak.logout()}
            style={{
              width: "100%",
              cursor: "pointer",
              padding: "8px",
              border: "1px solid #e8896a",
              borderRadius: "4px",
              background: "transparent",
              color: "#F5C6A0",
            }}
          >
            Deconectare
          </button>
        </div>
      </Sider>
      <Layout>
        <Content style={{ padding: "24px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
