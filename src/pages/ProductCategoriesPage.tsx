import { useEffect, useState } from 'react';
import api from "../api/axios";
import type { ProductCategory } from "../types/productCategory";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Product categories page component
 * Displays a list of product categories from the API
 */
function ProductCategoriesPage() {

    const [categories, setCategories] = useState<ProductCategory[]>([]); // Array of product categories from the API
    const { userData } = useAuth(); // Get the current user from the auth context

    // Handle delete product category
    const handleDelete = async (categoryId: string) => {
        if (!confirm("Are you sure you want to delete this product category?")) return;

        try {
            await api.delete(`/product/category/${categoryId}`);
            setCategories(categories.filter((category) => category._id !== categoryId)); // Remove the deleted product category from the list
        } catch (error) {
            console.log("Error deleting product category:", error);
        }
    }

    // Fetch product categories from the API on component mount
    useEffect(() => {
        api.get<ProductCategory[]>("/product/category/")
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => {
                console.log("Error data:", err.response?.data);
            });
    }, []);

    return (
        <div className="p-8">
            <ul>
                {userData?.rolePermission?.productCategory?.createProductCategory?.access && (
                    <li><Link to="/products/categories/new">New product category</Link></li>
                )}
            </ul>
            <table className="mt-4 w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">Slug</th>
                        <th className="border border-gray-300 px-4 py-2">Description</th>
                        <th className="border border-gray-300 px-4 py-2">Active</th>
                        <th className="border border-gray-300 px-4 py-2">&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category._id}>
                            <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{category.slug}</td>
                            <td className="border border-gray-300 px-4 py-2">{category.description}</td>
                            <td className="border border-gray-300 px-4 py-2">{category.active ? "Yes" : "No"}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {userData?.rolePermission?.productCategory?.updateProductCategory?.access && (
                                    <Link to={`/products/categories/${category._id}/edit`}>
                                        Edit <img src="/edit.png" alt="Edit" />
                                    </Link>
                                )}
                                {userData?.rolePermission?.productCategory?.deleteProductCategory?.access && (
                                    <button onClick={() => handleDelete(category._id)}>Delete</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductCategoriesPage;


