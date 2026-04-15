import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import type { Stock } from "../types/stock";

/**
 * Stocks page component
 * Displays a list of stocks from the API
 */
function StocksPage() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const { userData } = useAuth();

    const handleDelete = async (id: string) => {
        await api.delete(`/stock/${id}`);
        setStocks(stocks.filter(s => s._id !== id));
    };

    useEffect(() => {
        api.get<Stock[]>("/stock")
            .then(response => setStocks(response.data));
    }, []);

    return (
        <div className="p-4">
            {userData?.rolePermission?.stock?.createStock?.access && (
                <Link to="/stocks/new" className="btn btn-primary mb-3">New stock</Link>
            )}
            <table className="table table-bordered table-striped mt-3">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>City</th>
                        <th>Manager</th>
                        <th>Active</th>
                        <th>&​nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock) => (
                        <tr key={stock._id}>
                            <td>{stock.name}</td>
                            <td>{stock.location?.city}</td>
                            <td>{stock.manager}</td>
                            <td>{stock.active ? "Yes" : "No"}</td>
                            <td>
                                {userData?.rolePermission?.stock?.updateStock?.access && (
                                    <Link to={`/stocks/${stock._id}/edit`} className="btn btn-warning btn-sm me-2">
                                        <i className="bi bi-pencil"></i> Edit
                                    </Link>
                                )}
                                {userData?.rolePermission?.stock?.deleteStock?.access && (
                                    <button onClick={() => handleDelete(stock._id)} className="btn btn-danger btn-sm">
                                        <i className="bi bi-trash"></i> Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StocksPage;