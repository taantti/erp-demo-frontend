import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import type { StockShelf } from "../types/stockShelf";
import type { Stock } from "../types/stock";
import PaginationComponent from "../components/Pagination";

/**
 * Stock shelves page component
 * Displays a list of shelves from the API
 */
function StockShelvesPage() {
    const [shelves, setShelves] = useState<StockShelf[]>([]);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const { userData } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this shelf?")) return;
        try {
            await api.delete(`/stock/shelf/${id}`);
            setShelves(shelves.filter(s => s._id !== id));
            setCurrentPage(1);
        } catch (error) {
            console.log("Error deleting shelf:", error);
        }
    };

    useEffect(() => {
        api.get<StockShelf[]>("/stock/shelf")
            .then(response => setShelves(response.data));
        api.get<Stock[]>("/stock")
            .then(response => setStocks(response.data));
    }, []);

    const getStockName = (stockId: string) => {
        return stocks.find(s => s._id === stockId)?.name || stockId;
    };

    const totalPages = Math.ceil(shelves.length / itemsPerPage);
    const paginatedShelves = shelves.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4">
            {userData?.rolePermission?.stock?.createShelf?.access && (
                <Link to="/stocks/shelves/new" className="btn btn-primary mb-3">New shelf</Link>
            )}
            <table className="table table-bordered table-striped mt-3">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Stock</th>
                        <th>Location</th>
                        <th>Capacity</th>
                        <th>Active</th>
                        <th>&​nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedShelves.map((shelf) => (
                        <tr key={shelf._id}>
                            <td>{shelf.name}</td>
                            <td>{shelf.code}</td>
                            <td>{getStockName(shelf.stockId)}</td>
                            <td>{shelf.location}</td>
                            <td>{shelf.capacity}</td>
                            <td>{shelf.active ? "Yes" : "No"}</td>
                            <td>
                                {userData?.rolePermission?.stock?.updateShelf?.access && (
                                    <Link to={`/stocks/shelves/${shelf._id}/edit`} className="btn btn-warning btn-sm me-2">
                                        <i className="bi bi-pencil"></i> Edit
                                    </Link>
                                )}
                                {userData?.rolePermission?.stock?.deleteShelf?.access && (
                                    <button onClick={() => handleDelete(shelf._id)} className="btn btn-danger btn-sm">
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

export default StockShelvesPage;