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
    const [categories, setCategories] = useState<ProductCategory[]>([])
    const navigate = useNavigate();

    const { id: productId } = useParams();

    useEffect(() => {
        if(productId) {
            api.get(`/product/${productId}`)
                .then(response => setFormData(response.data))
                .catch(error => setError(error.response?.data?.error || "Product retrieval failed"));
        }
    }, [productId]);

    useEffect(() => {
        api.get<ProductCategory[]>("/product/category")
        .then(response => setCategories(response.data))
        .catch(error => setError(error.response?.data.error || "Product category retrieval failed"));
    }, []);


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            if(productId) {
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold">Product form</h1>
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
                <label>SKU
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
                </label>

                    {categories.map(cat => (
                        <label key={cat._id}>
                            <input
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



                <label>Unit
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
                <label>Net price
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
                </label>
                <label>Gross price
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
                </label>
                <label>VAT rate
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

export default ProductFormPage;
