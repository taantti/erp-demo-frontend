import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
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


                        {(userData?.rolePermission?.product?.readProducts?.access || userData?.rolePermission?.productCategory?.readProductCategories?.access) && (
                            <NavDropdown title="Product" id="products-dropdown">
                                {userData?.rolePermission?.product?.readProducts?.access && (
                                    <LinkContainer to="/products">
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </LinkContainer>
                                )}
                                {userData?.rolePermission?.productCategory?.readProductCategories?.access && (
                                    <LinkContainer to="/products/categories">
                                        <NavDropdown.Item>Categories</NavDropdown.Item>
                                    </LinkContainer>
                                )}
                            </NavDropdown>
                        )}



                        {userData?.rolePermission?.user?.readUsers?.access && (
                            <NavDropdown title="User" id="user-dropdown">
                                {userData?.rolePermission?.user?.readUsers?.access && (
                                    <LinkContainer to="/users">
                                        <NavDropdown.Item>Users</NavDropdown.Item>
                                    </LinkContainer>
                                )}
                            </NavDropdown>
                        )}







                        {(userData?.rolePermission?.stock?.readStocks?.access || userData?.rolePermission?.stock?.readShelves?.access) && (
                            <NavDropdown title="Stock" id="stock-dropdown">
                                {userData?.rolePermission?.stock?.readStocks?.access && (
                                    <LinkContainer to="/stocks">
                                        <NavDropdown.Item>Stocks</NavDropdown.Item>
                                    </LinkContainer>
                                )}
                                {userData?.rolePermission?.stock?.readShelves?.access && (
                                    <LinkContainer to="/stocks/shelves">
                                        <NavDropdown.Item>Shelves</NavDropdown.Item>
                                    </LinkContainer>
                                )}
                            </NavDropdown>
                        )}
                    </Nav>
                    <Nav>
                        <span className="navbar-text me-3">
                            {userData?.user_first_name} {userData?.user_last_name}
                        </span>
                        <Nav.Link onClick={handleLogout}><i className="bi bi-box-arrow-right"></i></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;