import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

/**
 * Navigation bar component
 * @returns Navigation bar component
 */
const NavBar = () => {
    const { logout, userData } = useAuth();
    const navigate = useNavigate();

    /**
     * Handle logout
     */
    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <Navbar bg="white" expand="md" className="shadow-sm">
            <Container fluid>
                <Navbar.Toggle aria-controls="main-nav" />
                <Navbar.Collapse id="main-nav">
                    <Nav className="me-auto">
                        <LinkContainer to="/">
                            <Nav.Link>Dashboard</Nav.Link>
                        </LinkContainer>
                        {userData?.rolePermission?.product?.readProducts?.access && (
                            <LinkContainer to="/products">
                                <Nav.Link>Products</Nav.Link>
                            </LinkContainer>
                        )}
                        {userData?.rolePermission?.productCategory?.readProductCategories?.access && (
                            <LinkContainer to="/products/categories">
                                <Nav.Link>Product Categories</Nav.Link>
                            </LinkContainer>
                        )}
                        {userData?.rolePermission?.user?.readUsers?.access && (
                            <LinkContainer to="/users">
                                <Nav.Link>Users</Nav.Link>
                            </LinkContainer>
                        )}
                        {userData?.rolePermission?.stock?.readStocks?.access && (
                            <LinkContainer to="/stocks">
                                <Nav.Link>Stocks</Nav.Link>
                            </LinkContainer>
                        )}
                        {userData?.rolePermission?.stock?.readShelves?.access && (
                            <LinkContainer to="/stocks/shelves">
                                <Nav.Link>Stock shelves</Nav.Link>
                            </LinkContainer>
                        )}
                    </Nav>
                    <Nav>
                        <span className="navbar-text me-3">
                            {userData?.user_first_name} {userData?.user_last_name}
                        </span>
                        <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;