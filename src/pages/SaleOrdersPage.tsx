import { useEffect, useState } from "react";
import api from "../api/axios";
import type { SaleOrder } from "../types/saleOrder";
import type { Customer } from "../types/customer";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PaginationComponent from "../components/Pagination";

/**
 * Sale order page component
 */
function SaleOrdersPage() {
    const [saleOrders, setSaleOrders] = useState<SaleOrder[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const { userData } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleDelete = async (saleOrderId: string) => {
        if (!confirm("Are you sure that you want to delete this sale order?")) return;

        try {
            await api.delete(`/sale-order/${saleOrderId}`);
            setSaleOrders(saleOrders.filter((sO) => sO._id !== saleOrderId));
            setCurrentPage(1);
        } catch (error) {
            console.log("Error deleting sale order", error);
        }
    }

    useEffect(() => {
        api.get<SaleOrder[]>("/sale-order")
            .then((res) => {
                setSaleOrders(res.data);
            })
            .catch((error) => {
                console.log("error data:", error.response?.data);
            })

        api.get<Customer[]>("/customer")
            .then((res) => {
                setCustomers(res.data);
            })
            .catch((error) => {
                console.log("error data:", error.response?.data);
            })
    }, []);

    /**
     * Resolve a customer id to a display name
     * @param customerId The customer _id stored on the order
     * @returns "Firstname Lastname" or empty string if not found
     */
    const customerName = (customerId?: string) => {
        const customer = customers.find((c) => c._id === customerId);
        return customer ? `${customer.first_name} ${customer.last_name}` : "";
    };

    const totalPages = Math.ceil(saleOrders.length / itemsPerPage);
    const paginatedSaleOrders = saleOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4">
            {userData?.rolePermission?.saleOrder?.createSaleOrder?.access && (
                <Link to="/sale-orders/new" className="btn btn-primary mb-3">New sale order</Link>
            )}

            <table className="table table-bordered table-striped mt-3">
                <thead>
                    <tr>
                        <th>Order number</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedSaleOrders.map((sO) => (
                        <tr key={sO._id}>
                            <td>{sO.orderNumber}</td>
                            <td>{customerName(sO.customerId)}</td>
                            <td>{sO.status}</td>
                            <td>
                                {userData?.rolePermission?.saleOrder?.updateSaleOrder?.access && (
                                    <Link to={`/sale-orders/${sO._id}/edit`} className="btn btn-warning btn-sm me-2"><i className="bi bi-pencil"></i> Edit</Link>
                                )}
                                {userData?.rolePermission?.saleOrder?.deleteSaleOrder?.access && (
                                    <button onClick={() => handleDelete(sO._id)} className="btn btn-danger btn-sm"><i className="bi bi-trash"></i> Delete</button>
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

export default SaleOrdersPage;