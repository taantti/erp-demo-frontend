import { useEffect, useState } from 'react';
import api from "../api/axios";
import type { Product } from "../types/product";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PaginationComponent from "../components/Pagination";

/**
 * Products page component
 * Displays a list of products from the API
 */
function ProductsPage() {

    const [products, setProducts] = useState<Product[]>([]); // Array of products from the API
    const { userData } = useAuth(); // Get the current user from the auth context
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Handle delete product
    const handleDelete = async (productId: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await api.delete(`/product/${productId}`);
            setProducts(products.filter((product) => product._id !== productId)); // Remove the deleted product from the list
            setCurrentPage(1);
        } catch (error) {
            console.log("Error deleting product:", error);
        }
    }

    // Fetch products from the API on component mount
    useEffect(() => {
        api.get<Product[]>("/product/")
            .then((res) => {
                setProducts(res.data);
            })
            .catch((err) => {
                console.log("Error data:", err.response?.data);
            });
    }, []);

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const paginatedProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4">
            {userData?.rolePermission?.product?.createProduct?.access && (
                <Link to="/products/new" className="btn btn-primary mb-3">New Product</Link>
            )}
            <table className="table table-bordered table-striped mt-3">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Unit</th>
                        <th>Net Price</th>
                        <th>Gross Price</th>
                        <th>VAT Rate</th>
                        <th>Active</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedProducts.map((product) => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.sku}</td>
                            <td>{product.unit}</td>
                            <td>{product.netPrice}</td>
                            <td>{product.grossPrice}</td>
                            <td>{product.vatRate}</td>
                            <td>{product.active ? "Yes" : "No"}</td>
                            <td>
                                {userData?.rolePermission?.product?.updateProduct?.access && (
                                    <Link to={`/products/${product._id}/edit`} className="btn btn-warning btn-sm me-2"><i className="bi bi-pencil"></i> Edit</Link>
                                )}
                                {userData?.rolePermission?.product?.deleteProduct?.access && (
                                    <button onClick={() => handleDelete(product._id)} className="btn btn-danger btn-sm"><i className="bi bi-trash"></i> Delete</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default ProductsPage;


