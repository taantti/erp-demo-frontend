import { useEffect, useState } from 'react';
import api from "../api/axios";
import type { Product } from "../types/product";
import { Link } from "react-router-dom";

/**
 * Products page component
 * Displays a list of products from the API
 */
function ProductsPage() {

    const [products, setProducts] = useState<Product[]>([]); // Array of products from the API

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
                <li><Link to="/products/new">New Product</Link></li>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductsPage;


