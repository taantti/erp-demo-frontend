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

    /**
     * Load category data if editing
     */
    useEffect(() => {
        if (categoryId) {
            api.get(`/product/category/${categoryId}`)
                .then(response => setFormData(response.data))
                .catch(error => setError(error.response?.data?.error || "Category retrieval failed"));
        }
    }, [categoryId])

    /**
     * Handle form submission
     * @param event Form submission event
     */
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
        <div className="p-4">
            <h1 className="fs-4 fw-bold">Product category form</h1>
            <form className="bg-white rounded shadow p-4" onSubmit={handleSubmit}>
                {error && <p className="text-danger small mt-2">{error}</p>}
                <label className="form-label mt-3 fw-medium">Name
                    <input
                        className="form-control mt-1"
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
                <label className="form-label mt-3 fw-medium">Slug
                    <input
                        className="form-control mt-1"
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
                <label className="form-label mt-3 fw-medium">Description
                    <input
                        className="form-control mt-1"
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
                <label className="form-label mt-3 fw-medium">Active
                    <select
                        className="form-select mt-1"
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
                <button type="submit" className="btn btn-primary mt-3">Save</button>
            </form>
        </div>
    );
}

export default ProductCategoryFormPage;
