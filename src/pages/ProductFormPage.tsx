import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import type { ProductRequest } from "../types/product";
import { AxiosError } from "axios";
import type { ProductCategory } from "../types/productCategory";

/**
 * Return product form page
 * @returns Product form page
 */
function ProductFormPage() {
    const [formData, setFormData] = useState<ProductRequest>({
        name: "",
        sku: "",
        categoryIds: [],
        unit: "piece",
        description: "",
        netPrice: 0,
        grossPrice: 0,
        vatRate: 0,
        active: true
    });

    const [error, setError] = useState<string>("");
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [units, setUnits] = useState<string[]>([]);
    const navigate = useNavigate();
    const { id: productId } = useParams();

    /**
     * Load product data if editing
     */
    useEffect(() => {
        if (productId) {
            api.get(`/product/${productId}`)
                .then(response => setFormData(response.data))
                .catch(error => setError(error.response?.data?.error || "Product retrieval failed"));
        }
    }, [productId]);

    /**
     * Load product categories
     */
    useEffect(() => {
        api.get<ProductCategory[]>("/product/category")
            .then(response => setCategories(response.data))
            .catch(error => setError(error.response?.data.error || "Product category retrieval failed"));
    }, []);

    /**
     * Load product units
     */
    useEffect(() => {
        api.get<string[]>("/asset/product/units")
            .then(response => setUnits(response.data))
            .catch(error => setError(error.response?.data?.error || "Product units retrieval failed"));
    }, []);

    /**
     * Handle form submission
     * @param event Form submission event
     */
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            if (productId) {
                await api.put(`/product/${productId}`, formData);
            } else {
                await api.post('/product', formData);
            }
            navigate("/products");
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data?.error || "Product creation failed");
            } else {
                setError("Unknown error");
            }
        }
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Product form</h1>
            <form className="bg-white rounded-lg shadow-md p-8" onSubmit={handleSubmit}>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <label className="block mt-4 font-medium">Name
                    <input
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
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
                <label className="block mt-4 font-medium">SKU
                    <input
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={(event) => {
                            setFormData({ ...formData, sku: event.target.value });
                            setError("");
                        }}
                        placeholder="SKU"
                    />
                </label>
                {categories.map(cat => (
                    <label className="block mt-4 font-medium" key={cat._id}>Category
                        <input
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                            type="checkbox"
                            name="category"
                            value={cat._id}
                            checked={formData.categoryIds.includes(cat._id)}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    setFormData({ ...formData, categoryIds: [...formData.categoryIds, cat._id] });
                                } else {
                                    setFormData({ ...formData, categoryIds: formData.categoryIds.filter(id => id !== cat._id) });
                                }
                                setError("");
                            }}
                        />
                        {cat.name}
                    </label>
                ))}
                <label className="block mt-4 font-medium">Unit
                    <select
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        name="unit"
                        value={formData.unit}
                        onChange={(event) => {
                            setFormData({ ...formData, unit: event.target.value });
                            setError("");
                        }}
                    >
                        {units.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </label>
                <label className="block mt-4 font-medium">Description
                    <input
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
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
                <label className="block mt-4 font-medium">Net price
                    <input
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        type="text"
                        name="netPrice"
                        value={formData.netPrice}
                        onChange={(event) => {
                            setFormData({ ...formData, netPrice: parseFloat(event.target.value) });
                            setError("");
                        }}
                        placeholder="Net price"
                    />
                </label>
                <label className="block mt-4 font-medium">Gross price
                    <input
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        type="text"
                        name="grossPrice"
                        value={formData.grossPrice}
                        onChange={(event) => {
                            setFormData({ ...formData, grossPrice: parseFloat(event.target.value) });
                            setError("");
                        }}
                        placeholder="Gross price"
                    />
                </label>
                <label className="block mt-4 font-medium">VAT rate
                    <input
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        type="text"
                        name="vatRate"
                        value={formData.vatRate}
                        onChange={(event) => {
                            setFormData({ ...formData, vatRate: parseFloat(event.target.value) });
                            setError("");
                        }}
                        placeholder="VAT rate"
                    />
                </label>
                <label className="block mt-4 font-medium">Active
                    <select
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
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

export default ProductFormPage;
