import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import type { StockRequest } from "../types/stock";
import { AxiosError } from "axios";

/**
 * Return stock form page
 * @returns Stock form page
 */
function StockFormPage() {
    const [formData, setFormData] = useState<StockRequest>({
        name: "",
        location: {
            address: "",
            city: "",
            postalCode: "",
            country: ""
        },
        active: true,
        manager: "",
        contactInfo: {
            phone: "",
            email: ""
        }
    });

    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const { id: stockId } = useParams();

    /**
     * Load stock data if editing
     */
    useEffect(() => {
        if (stockId) {
            api.get(`/stock/${stockId}`)
                .then(response => setFormData(response.data))
                .catch(error => setError(error.response?.data?.error || "Stock retrieval failed"));
        }
    }, [stockId]);

    /**
     * Handle form submission
     * @param event Form submission event
     */
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            if (stockId) {
                await api.put(`/stock/${stockId}`, formData);
            } else {
                await api.post('/stock', formData);
            }
            navigate("/stocks");
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data?.error || "Stock creation failed");
            } else {
                setError("Unknown error");
            }
        }
    }

    return (
        <div className="p-4">
            <h1 className="fs-4 fw-bold">Stock form</h1>
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
                <label className="form-label mt-3 fw-medium">Address
                    <input
                        className="form-control mt-1"
                        type="text"
                        name="address"
                        value={formData.location.address}
                        onChange={(event) => {
                            setFormData({ ...formData, location: { ...formData.location, address: event.target.value } });
                            setError("");
                        }}
                        placeholder="Address"
                    />
                </label>
                <label className="form-label mt-3 fw-medium">City
                    <input
                        className="form-control mt-1"
                        type="text"
                        name="city"
                        value={formData.location.city}
                        onChange={(event) => {
                            setFormData({ ...formData, location: { ...formData.location, city: event.target.value } });
                            setError("");
                        }}
                        placeholder="City"
                    />
                </label>
                <label className="form-label mt-3 fw-medium">Postal code
                    <input
                        className="form-control mt-1"
                        type="text"
                        name="postalCode"
                        value={formData.location.postalCode}
                        onChange={(event) => {
                            setFormData({ ...formData, location: { ...formData.location, postalCode: event.target.value } });
                            setError("");
                        }}
                        placeholder="Postal code"
                    />
                </label>
                <label className="form-label mt-3 fw-medium">Country
                    <input
                        className="form-control mt-1"
                        type="text"
                        name="country"
                        value={formData.location.country}
                        onChange={(event) => {
                            setFormData({ ...formData, location: { ...formData.location, country: event.target.value } });
                            setError("");
                        }}
                        placeholder="Country"
                    />
                </label>
                <label className="form-label mt-3 fw-medium">Manager
                    <input
                        className="form-control mt-1"
                        type="text"
                        name="manager"
                        value={formData.manager}
                        onChange={(event) => {
                            setFormData({ ...formData, manager: event.target.value });
                            setError("");
                        }}
                        placeholder="Manager"
                    />
                </label>
                <label className="form-label mt-3 fw-medium">Phone
                    <input
                        className="form-control mt-1"
                        type="text"
                        name="phone"
                        value={formData.contactInfo.phone}
                        onChange={(event) => {
                            setFormData({ ...formData, contactInfo: { ...formData.contactInfo, phone: event.target.value } });
                            setError("");
                        }}
                        placeholder="Phone"
                    />
                </label>
                <label className="form-label mt-3 fw-medium">Email
                    <input
                        className="form-control mt-1"
                        type="text"
                        name="email"
                        value={formData.contactInfo.email}
                        onChange={(event) => {
                            setFormData({ ...formData, contactInfo: { ...formData.contactInfo, email: event.target.value } });
                            setError("");
                        }}
                        placeholder="Email"
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

export default StockFormPage;
