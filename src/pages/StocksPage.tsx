import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import type { Stock } from "../types/stock";
import PaginationComponent from "../components/Pagination";

/**
 * Stocks page component
 * Displays a list of stocks from the API
 */
function StocksPage() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const { userData } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this stock?")) return;
        try {
            await api.delete(`/stock/${id}`);
            setStocks(stocks.filter(s => s._id !== id));
            setCurrentPage(1);
        } catch (error) {
            console.log("Error deleting stock:", error);
        }
    };

    useEffect(() => {
        api.get<Stock[]>("/stock")
            .then(response => setStocks(response.data));
    }, []);

    const totalPages = Math.ceil(stocks.length / itemsPerPage);
    const paginatedStocks = stocks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                    {paginatedStocks.map((stock) => (
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
            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}

export default StocksPage;