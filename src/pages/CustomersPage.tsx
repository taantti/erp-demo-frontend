import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Customer } from "../types/customer";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PaginationComponent from "../components/Pagination";

/**
 * Customers page component
 * Displays a list of customers from the API
 */
function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const { userData } = useAuth(); // Get the current user from the auth context
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleDelete = async (customerId: string) => {
        if (!confirm("Are you sure you want to delete this customer?")) return;

        try {
            await api.delete(`/customer/${customerId}`);
            setCustomers(customers.filter((customer) => customer._id !== customerId));
            setCurrentPage(1);
        } catch (error) {
            console.log("Error deleting customer", error);
        }
    }

    useEffect(() => {
        api.get<Customer[]>("/customer")
            .then((res) => {
                setCustomers(res.data);
            })
            .catch((error) => {
                console.log("Error data:", error.response?.data);

            });
    }, []);

    const totalPages = Math.ceil(customers.length / itemsPerPage);
    const paginatedCustomers = customers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    return (
        <div className="p-4">
            {userData?.rolePermission?.customer?.createCustomer?.access && (
                <Link to="/customers/new" className="btn btn-primary mb-3">New Customer</Link>
            )}
            <table className="table table-bordered table-striped mt-3">
                <thead>
                    <tr>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Active</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCustomers.map((customer) => (
                        <tr key={customer._id}>
                            <td>{customer.first_name}</td>
                            <td>{customer.last_name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.active ? "Yes" : "No"}</td>
                            <td>
                                {userData?.rolePermission?.customer?.updateCustomer?.access && (
                                    <Link to={`/customers/${customer._id}/edit`} className="btn btn-warning btn-sm me-2"><i className="bi bi-pencil"></i> Edit</Link>
                                )}
                                {userData?.rolePermission?.customer?.deleteCustomer?.access && (
                                    <button onClick={() => handleDelete(customer._id)} className="btn btn-danger btn-sm"><i className="bi bi-trash"></i> Delete</button>
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

export default CustomersPage;
