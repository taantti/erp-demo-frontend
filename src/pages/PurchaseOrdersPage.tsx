import { useEffect, useState } from "react";
import api from "../api/axios";
import type { PurchaseOrder } from "../types/purchaseOrder";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PaginationComponent from "../components/Pagination";

/**
 * Purchase order page component
 * Displays a list of purchase order from the api
 */
function PurchaseOrdersPage() {
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
    const { userData } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleDelete = async (purchaseOrderId: string) => {
        if (!confirm("Are you sure that you want to delete this purchase order?")) return;
        try {
            await api.delete(`/purchase-order/${purchaseOrderId}`);
            setPurchaseOrders(purchaseOrders.filter((order) => order._id !== purchaseOrderId));
            setCurrentPage(1);
        } catch (error) {
            console.log("Error deleting purchase order", error);
        }
    }

    useEffect(() => {
        api.get<PurchaseOrder[]>(`/purchase-order`)
            .then((res) => {
                setPurchaseOrders(res.data);
            })
            .catch((error) => {
                console.log("error data:", error.response?.data);
            })
    }, []);

    const totalPages = Math.ceil(purchaseOrders.length / itemsPerPage);
    const paginatedPurchaseOrders = purchaseOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4">
            {userData?.rolePermission?.purchaseOrder?.createPurchaseOrder?.access && (
                <Link to="/purchase-orders/new" className="btn btn-primary mb-3">New Purchase Order</Link>
            )}
            <table className="table table-bordered table-striped mt-3">
                <thead>
                    <tr>
                        <th>Order number</th>
                        <th>Supplier</th>
                        <th>Status</th>
                        <th>Items</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedPurchaseOrders.map((order) => (
                        <tr key={order._id}>
                            <td>{order.orderNumber}</td>
                            <td>{order.supplier}</td>
                            <td>{order.status}</td>
                            <td>{order.items.length}</td>
                            <td>
                                {userData?.rolePermission?.purchaseOrder?.updatePurchaseOrder?.access && (
                                    <Link to={`/purchase-orders/${order._id}/edit`} className="btn btn-warning btn-sm me-2"><i className="bi bi-pencil"></i> Edit</Link>
                                )}
                                {userData?.rolePermission?.purchaseOrder?.deletePurchaseOrder?.access && (
                                    <button onClick={() => handleDelete(order._id)} className="btn btn-danger btn-sm"><i className="bi bi-trash"></i> Delete</button>
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

export default PurchaseOrdersPage;

