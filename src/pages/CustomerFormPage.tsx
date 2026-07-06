import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import type { CustomerRequest, PostalAddress } from "../types/customer";
import { AxiosError } from "axios";

/**
 * Return customer form page
 * @returns Customer form page
 */
function CustomerFormPage() {
    const [formData, setFormData] = useState<CustomerRequest>({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: {},
        active: true
    });

    const [addressTypes, setAddressTypes] = useState<string[]>([]);
    const [selectedAddressType, setSelectedAddressType] = useState<string>("");
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();
    const { id: customerId } = useParams();

    /**
     * Load customer data if editing
     */
    useEffect(() => {
        if (customerId) {
            api.get(`/customer/${customerId}`)
                .then(response => setFormData(response.data))
                .catch(error => setError(error.response?.data?.error || "Customer retrieval failed"));
        }
    }, [customerId]);

    /**
     * Load available address types
     */
    useEffect(() => {
        api.get<string[]>("/asset/customer/address-types")
            .then(response => setAddressTypes(response.data))
            .catch(error => setError(error.response?.data?.error || "Address types retrieval failed"));
    }, []);

    /**
     * Update single field of one address
     */
    const handleAddressChange = (typeKey: string, field: keyof PostalAddress, value: string) => {
        const updatedAddress = { ...formData.address[typeKey], [field]: value };
        const updatedAddresses = { ...formData.address, [typeKey]: updatedAddress };
        setFormData({ ...formData, address: updatedAddresses });
        setError("");
    }

    /**
     * Add a new empty address of the selected type
     */
    const handleAddresses = () => {
        if (!selectedAddressType) return;
        if (formData.address[selectedAddressType]) return;

        const newAddress: PostalAddress = {
            type: selectedAddressType,
            streetAddress: "",
            city: "",
            postalCode: "",
            country: ""
        };

        setFormData({
            ...formData,
            address: { ...formData.address, [selectedAddressType]: newAddress }
        });

        setSelectedAddressType("");
        setError("");
    };

    /**
     * Remove an address by its type key
     */
    const handleRemoveAddress = (typeKey: string) => {
        const updatedAddresses = { ...formData.address };
        delete updatedAddresses[typeKey];
        setFormData({ ...formData, address: updatedAddresses });
        setError("");
    }


    /**
     * Handle form submission
     * @param event Form submission event
     */
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            if (customerId) {
                await api.put(`/customer/${customerId}`, formData);
            } else {
                await api.post("/customer", formData);
            }
            navigate("/customers");
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data?.error || "Customer " + (customerId ? "update" : "creation") + " failed");
            } else {
                setError("Unknown error")
            }
        }
    }

    return (
        <div className="p-4">
            <h1 className="fs-4 fw-bold">Customer form</h1>
            <form className="bg-white rounded shadow p-4" onSubmit={handleSubmit}>
                {error && <p className="text-danger small mt-2">{error}</p>}
                <label className="form-label mt-3 fw-medium">First name
                    <input
                        className="form-control mt-1"
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={(event) => {
                            setFormData({ ...formData, first_name: event.target.value });
                            setError("");
                        }}
                        placeholder="First name"
                    />
                </label>
                <label className="form-label mt-3 fw-medium">Last name
                    <input
                        className="form-control mt-1"
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={(event) => {
                            setFormData({ ...formData, last_name: event.target.value });
                            setError("");
                        }}
                        placeholder="Last name"
                    />
                </label>
                <label className="form-label mt-3 fw-medium">Email
                    <input
                        className="form-control mt-1"
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={(event) => {
                            setFormData({ ...formData, email: event.target.value });
                            setError("");
                        }}
                        placeholder="Email"
                    />
                </label>
                <label className="form-label mt-3 fw-medium">Phone
                    <input
                        className="form-control mt-1"
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={(event) => {
                            setFormData({ ...formData, phone: event.target.value });
                            setError("");
                        }}
                        placeholder="Phone"
                    />
                </label>

                <h2 className="fs-5 fw-bold mt-4">Addresses</h2>
                {Object.entries(formData.address ?? {}).map(([typeKey, address]) => (
                    <div key={typeKey} className="border rounded p-3 mt-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <h3 className="fs-6 fw-bold text-capitalize mb-0">{typeKey}</h3>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveAddress(typeKey)}
                            >
                                Remove
                            </button>
                        </div>
                        <input
                            className="form-control mt-2"
                            type="text"
                            value={address.streetAddress}
                            onChange={(event) => handleAddressChange(typeKey, "streetAddress", event.target.value)}
                            placeholder="Street address"
                        />
                        <input
                            className="form-control mt-2"
                            type="text"
                            value={address.city}
                            onChange={(event) => handleAddressChange(typeKey, "city", event.target.value)}
                            placeholder="City"
                        />
                        <input
                            className="form-control mt-2"
                            type="text"
                            value={address.postalCode}
                            onChange={(event) => handleAddressChange(typeKey, "postalCode", event.target.value)}
                            placeholder="Postal code"
                        />
                        <input
                            className="form-control mt-2"
                            type="text"
                            value={address.country}
                            onChange={(event) => handleAddressChange(typeKey, "country", event.target.value)}
                            placeholder="Country"
                        />
                    </div>
                ))}
                <div className="d-flex gap-2 mt-3">
                    <select
                        className="form-select"
                        value={selectedAddressType}
                        onChange={(event) => setSelectedAddressType(event.target.value)}
                    >
                        <option value="">Select address type</option>
                        {addressTypes
                            .filter(type => !formData.address?.[type])
                            .map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                    </select>
                    <button type="button" className="btn btn-outline-primary" onClick={handleAddresses}>Add</button>
                </div>

                <label className="form-label mt-3 fw-medium">Active

                    <select
                        className="form-select mt-2"
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
            </form >
        </div >
    );

}

export default CustomerFormPage;

