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
        <div className="p-4">

            {userData?.rolePermission?.productCategory?.createProductCategory?.access && (
                <Link to="/products/categories/new" className="btn btn-primary mb-3">New product category</Link>
            )}

            <table className="table table-bordered table-striped mt-3">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Description</th>
                        <th>Active</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category.slug}</td>
                            <td>{category.description}</td>
                            <td>{category.active ? "Yes" : "No"}</td>
                            <td>
                                {userData?.rolePermission?.productCategory?.updateProductCategory?.access && (
                                    <Link to={`/products/categories/${category._id}/edit`} className="btn btn-sm btn-outline-primary">
                                        <i className="bi bi-pencil"></i>
                                    </Link>
                                )}
                                {userData?.rolePermission?.productCategory?.deleteProductCategory?.access && (
                                    <button onClick={() => handleDelete(category._id)} className="btn btn-danger btn-sm">
                                        <i className="bi bi-trash"></i>
                                    </button>
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


