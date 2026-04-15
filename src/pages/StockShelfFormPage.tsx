import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import type { StockShelfRequest } from "../types/stockShelf";
import type { Stock } from "../types/stock";
import { AxiosError } from "axios";

/**
 * Return stock shelf form page
 * @returns Stock shelf form page
 */
function StockShelfFormPage() {
    const [formData, setFormData] = useState<StockShelfRequest>({
        stockId: "",
        name: "",
        code: "",
        location: "",
        capacity: 0,
        active: true
    });

    const [error, setError] = useState<string>("");
    const [stocks, setStocks] = useState<Stock[]>([]);
    const navigate = useNavigate();
    const { id: stockShelfId} = useParams();

    /**
     * Load stock shelf data if editing
     */
    useEffect(() => {
        if (stockShelfId) {
            api.get(`/stock/shelf/${stockShelfId}`)
                .then(response => setFormData(response.data))
                .catch(error => setError(error.response?.data?.error || "Stock retrieval failed"));
        }
    }, [stockShelfId]);


    /**
     * Load stocks
     */
    useEffect(() => {
        api.get<Stock[]>("/stock")
            .then(response => setStocks(response.data))
            .catch(error => setError(error.response?.data.error || "Stocks retrieval failed"));
    }, []);


    /**
     * Handle form submission
     * @param event Form submission event
     */
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            if (stockShelfId) {
                await api.put(`/stock/shelf/${stockShelfId}`, formData);
            } else {
                await api.post('/stock/shelf', formData);
            }
            navigate("/stocks/shelves");
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data?.error || "Stock shelf creation failed");
            } else {
                setError("Unknown error");
            }
        }
    }

    return (
        <div className="p-4">
            <h1 className="fs-4 fw-bold">Stock shelf form</h1>
            <form className="bg-white rounded shadow p-4" onSubmit={handleSubmit}>
                {error && <p className="text-danger small mt-2">{error}</p>}
                <label className="form-label mt-3 fw-medium">Stock
                    <select
                        className="form-select mt-1"
                        name="stockId"
                        value={formData.stockId}
                        onChange={(event) => {
                            setFormData({ ...formData, stockId: event.target.value });
                            setError("");
                        }}
                    >
                        {stocks.map(stock => (
                            <option key={stock._id} value={stock._id}>{stock.name}</option>
                        ))}
                    </select>
                </label>
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
                <label className="form-label mt-3 fw-medium">Code
                    <input
                        className="form-control mt-1"
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={(event) => {
                            setFormData({ ...formData, code: event.target.value });
                            setError("");
                        }}
                        placeholder="Code"
                    />
                </label>
                <label className="form-label mt-3 fw-medium">Location
                    <input
                        className="form-control mt-1"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={(event) => {
                            setFormData({ ...formData, location: event.target.value });
                            setError("");
                        }}
                        placeholder="Location"
                    />
                </label>
                <label className="form-label mt-3 fw-medium">Capacity
                    <input
                        className="form-control mt-1"
                        type="text"
                        name="capacity"
                        value={formData.capacity}
                        onChange={(event) => {
                            setFormData({ ...formData, capacity: parseInt(event.target.value) });
                            setError("");
                        }}
                        placeholder="Capacity"
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

export default StockShelfFormPage;
