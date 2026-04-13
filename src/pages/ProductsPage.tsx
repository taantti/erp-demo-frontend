import { useEffect, useState } from 'react';
import api from "../api/axios";
import type { Product } from "../types/product";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Products page component
 * Displays a list of products from the API
 */
function ProductsPage() {

    const [products, setProducts] = useState<Product[]>([]); // Array of products from the API
    const { userData } = useAuth(); // Get the current user from the auth context

    // Handle delete product
    const handleDelete = async (productId: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await api.delete(`/product/${productId}`);
            setProducts(products.filter((product) => product._id !== productId)); // Remove the deleted product from the list
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

    return (
        <div className="p-8">
            <ul>
                {userData?.rolePermission?.product?.createProduct?.access && (
                    <li><Link to="/products/new">New Product</Link></li>
                )}
            </ul>
            <table className="mt-4 w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">SKU</th>
                        <th className="border border-gray-300 px-4 py-2">Unit</th>
                        <th className="border border-gray-300 px-4 py-2">Net Price</th>
                        <th className="border border-gray-300 px-4 py-2">Gross Price</th>
                        <th className="border border-gray-300 px-4 py-2">VAT Rate</th>
                        <th className="border border-gray-300 px-4 py-2">Active</th>
                        <th className="border border-gray-300 px-4 py-2">&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.sku}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.unit}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.netPrice}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.grossPrice}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.vatRate}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.active ? "Yes" : "No"}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {userData?.rolePermission?.product?.updateProduct?.access && (
                                    <Link to={`/products/${product._id}/edit`}>
                                        Edit <img src="/edit.png" alt="Edit" />
                                    </Link>
                                )}
                                {userData?.rolePermission?.product?.deleteProduct?.access && (
                                    <button onClick={() => handleDelete(product._id)}>Delete</button>
                                )}

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductsPage;


