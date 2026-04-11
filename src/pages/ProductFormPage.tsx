import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { ProductRequest } from "../types/product";
import { AxiosError } from "axios";


/**
 * Return product form page
 * @returns Product form page
 */
function ProductFormPage() {
    const [formData, setFormData] = useState<ProductRequest>({
        name: "",
        sku: "",
        unit: "piece",
        description: "",
        netPrice: 0,
        grossPrice: 0,
        vatRate: 0,
        active: true
    });

    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await api.post('/product', formData);
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold">Product form</h1>
            <form className="bg-white rounded-lg shadow-md p-8" onSubmit={handleSubmit}>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
                <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={(event) => {
                        setFormData({ ...formData, sku: event.target.value });
                        setError("");
                    }}
                    placeholder="SKU"
                />
                <select
                    name="unit"
                    value={formData.unit}
                    onChange={(event) => {
                        setFormData({ ...formData, unit: event.target.value });
                        setError("");
                    }}
                >
                    <option value="piece">Piece</option>
                    <option value="kilogram">Kilogram</option>
                    <option value="gram">Gram</option>
                    <option value="liter">Liter</option>
                    <option value="meter">Meter</option>
                    <option value="centimeter">Centimeter</option>
                    <option value="millimeter">Millimeter</option>
                    <option value="box">Box</option>
                    <option value="no_unit">No unit</option>
                </select>
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
                <input
                    type="text"
                    name="netPrice"
                    value={formData.netPrice}
                    onChange={(event) => {
                        setFormData({ ...formData, netPrice: parseFloat(event.target.value) });
                        setError("");
                    }}
                    placeholder="Net price"
                />
                <input
                    type="text"
                    name="grossPrice"
                    value={formData.grossPrice}
                    onChange={(event) => {
                        setFormData({ ...formData, grossPrice: parseFloat(event.target.value) });
                        setError("");
                    }}
                    placeholder="Gross price"
                />
                <input
                    type="text"
                    name="vatRate"
                    value={formData.vatRate}
                    onChange={(event) => {
                        setFormData({ ...formData, vatRate: parseFloat(event.target.value) });
                        setError("");
                    }}
                    placeholder="VAT rate"
                />
                <input
                    type="text"
                    name="active"
                    value={formData.active.toString()}
                    onChange={(event) => {
                        setFormData({ ...formData, active: event.target.value === "true" });
                        setError("");
                    }}
                    placeholder="Active"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            </form>
        </div>
    );
}

export default ProductFormPage;
