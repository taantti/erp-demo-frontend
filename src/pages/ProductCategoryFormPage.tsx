import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import type { ProductCategoryRequest } from "../types/productCategory";
import { AxiosError } from "axios";

/**
 * Return product category form page
 * @returns Product category form page
 */
function ProductCategoryFormPage() {
    const [formData, setFormData] = useState<ProductCategoryRequest>({
        name: "",
        slug: "",
        description: "",
        active: true
    });

    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const { id: categoryId } = useParams();

    useEffect(() => {
        if (categoryId) {
            api.get(`/product/category/${categoryId}`)
                .then(response => setFormData(response.data))
                .catch(error => setError(error.response?.data?.error || "Category retrieval failed"));
        }
    }, [categoryId])


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            if (categoryId) {
                await api.put(`/product/category/${categoryId}`, formData);
            } else {
                await api.post('/product/category', formData);
            }
            navigate("/products/categories");
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data?.error || "Category creation failed");
            } else {
                setError("Unknown error");
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold">Product category form</h1>
            <form className="bg-white rounded-lg shadow-md p-8" onSubmit={handleSubmit}>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <label>Name
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(event) => {
                        setFormData({ ...formData, name: event.target.value });
                        setError("");
                    }}
                    placeholder="Name"
                />
                </label>
                <label>Slug
                <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={(event) => {
                        setFormData({ ...formData, slug: event.target.value });
                        setError("");
                    }}
                    placeholder="Slug"
                />
                </label>
                <label>Description
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={(event) => {
                        setFormData({ ...formData, description: event.target.value });
                        setError("");
                    }}
                    placeholder="Description"
                />
                </label>
                <label>Active
                <select
                    name="active"
                    value={formData.active.toString()}
                    onChange={(event) => {
                        setFormData({ ...formData, active: event.target.value === "true" });
                        setError("");
                    }}
                >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
                </label>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            </form>
        </div>
    );
}

export default ProductCategoryFormPage;
