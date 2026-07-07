import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import type { PurchaseOrderRequest, PurchaseOrderStatus } from "../types/purchaseOrder";
import type { Product } from "../types/product";
import type { Stock } from "../types/stock";
import type { StockShelf } from "../types/stockShelf";
import { AxiosError } from "axios";

/**
 * All possible purchase order statuses
 */
const statuses: PurchaseOrderStatus[] = ["draft", "ordered", "partially_received", "received", "cancelled"];

/**
 * Return purchase form page
 * @returns Purchase order form page
 */
function PurchaseOrderFormPage() {
    const [formData, setFormData] = useState<PurchaseOrderRequest>({
        orderNumber: "",
        supplier: "",
        status: "draft",
        orderDate: "",
        expectedDeliveryDate: "",
        items: [],
        notes: ""
    });

    const [products, setProducts] = useState<Product[]>([]);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [shelves, setShelves] = useState<StockShelf[]>([]);
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();
    const { id: purchaseOrderId } = useParams();

    /**
     * Load purchase order data if editing
     */
    useEffect(() => {
        if (purchaseOrderId) {
            api.get(`/purchase-order/${purchaseOrderId}`)
                .then(response => setFormData(response.data))
                .catch(error => setError(error.response?.data?.error || "Purchase order retrieval failed"));
        }
    }, [purchaseOrderId]);


    /**
     * Load products, stocks and shelves for the item dropdown
     */
    useEffect(() => {
        api.get<Product[]>("/product")
            .then(response => setProducts(response.data))
            .catch(error => setError(error.response?.data?.error || "Product retrieval failed"));

        api.get<Stock[]>("/stock")
            .then(response => setStocks(response.data))
            .catch(error => setError(error.response?.data?.error || "Stock retrieval failed"));

        api.get<StockShelf[]>("/stock/shelf")
            .then(response => setShelves(response.data))
            .catch(error => setError(error.response?.data?.error || "Shelf retrieval failed"));
    }, []);

    /**
     * Add a new empty item row to the order
     */
    const handleAddItem = () => {
        const newItem = {
            productName: "",
            productId: "",
            stockId: "",
            shelfId: "",
            quantity: 1,
            unitNetPrice: 0,
            unitGrossPrice: 0,
            vat: 0
        }

        setFormData({ ...formData, items: [...formData.items, newItem] });
        setError("");
    }

    /**
     * Update a single field of one item row
     * @param index Index of the item in the items array
     * @param field Name of the field to update
     * @param value New value for the field 
     */
    const handleItemChange = (index: number, field: string, value: string | number) => {
        const updatedItems = formData.items.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );

        setFormData({ ...formData, items: updatedItems });
        setError("");
    };

    /**
     * Select a product for an item row and prefill name and prices from product
     * @param index Index of the item in the items array
     * @param productId The selected product _id
     */
    const handleItemProductChange = (index: number, productId: string) => {
        const product = products.find(p => p._id === productId)

        const updatedItems = formData.items.map((item, i) =>
            i === index
                ? {
                    ...item,
                    productId: productId,
                    productName: product?.name ?? "",
                    unitNetPrice: product?.netPrice ?? 0,
                    unitGrossPrice: product?.grossPrice ?? 0,
                    vat: product?.vatRate ?? 0
                }
                : item
        );

        setFormData({ ...formData, items: updatedItems });
        setError("");
    };

    /**
     * Remove an item row by its index
     * @param index Index of the item to remove
     */
    const handleRemoveItem = (index: number) => {
        setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
        setError("");
    }

    /**
     * Handle form submission
     * @param event Form submission event
     */
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (formData.items.some(item => !item.productId || !item.stockId || !item.shelfId)) {
            setError("Every item needs a product, stock and shelf");
            return;
        }

        try {
            if (purchaseOrderId) {
                await api.put(`/purchase-order/${purchaseOrderId}`, formData);
            } else {
                await api.post("/purchase-order", formData);
            }

            navigate("/purchase-orders");
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data?.error || "Purchase order " + (purchaseOrderId ? "update" : "creation") + " failed");
            } else {
                setError("Unknown error");
            }
        }
    }

    return (
        <div className="p-4">
            <h1 className="fs-4 fw-bold">Purchase order form</h1>
            <form className="bg-white rounded shadow p-4" onSubmit={handleSubmit}>
                {error && <p className="text-danger small mt-2">{error}</p>}

                <label className="form-label mt-3 fw-medium">Order number
                    <input
                        className="form-control mt-1"
                        type="text"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={(event) => {
                            setFormData({ ...formData, orderNumber: event.target.value });
                            setError("");
                        }}
                        placeholder="Order number"
                    />
                </label>
                <label className="form-label mt-3 fw-medium">Supplier
                    <input
                        className="form-control mt-1"
                        type="text"
                        name="supplier"
                        value={formData.supplier}
                        onChange={(event) => {
                            setFormData({ ...formData, supplier: event.target.value });
                            setError("");
                        }}
                        placeholder="Supplier"
                    />
                </label>
                <label className="form-label mt-3 fw-medium">Status
                    <select
                        className="form-select mt-1"
                        name="status"
                        value={formData.status}
                        onChange={(event) => {
                            setFormData({ ...formData, status: event.target.value as PurchaseOrderStatus });
                            setError("");
                        }}
                    >
                        {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </label>
                <label className="form-label mt-3 fw-medium">Order date
                    <input
                        className="form-control mt-1"
                        type="date"
                        name="orderDate"
                        value={formData.orderDate?.slice(0, 10) ?? ""}
                        onChange={(event) => {
                            setFormData({ ...formData, orderDate: event.target.value });
                            setError("");
                        }}
                    />
                </label>
                <label className="form-label mt-3 fw-medium">Expected delivery date
                    <input
                        className="form-control mt-1"
                        type="date"
                        name="expectedDeliveryDate"
                        value={formData.expectedDeliveryDate?.slice(0, 10) ?? ""}
                        onChange={(event) => {
                            setFormData({ ...formData, expectedDeliveryDate: event.target.value });
                            setError("");
                        }}
                    />
                </label>
                <h2 className="fs-5 fw-bold mt-4">Items</h2>
                {formData.items.map((item, index) => (
                    <div key={index} className="border rounded p-3 mt-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <h3 className="fs-6 fw-bold mb-0">Item {index + 1}</h3>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveItem(index)}
                            >
                                Remove
                            </button>
                        </div>
                        <select
                            className="form-select mt-2"
                            value={item.productId}
                            onChange={(event) => handleItemProductChange(index, event.target.value)}
                        >
                            <option value="">Select product</option>
                            {products.map(product => (
                                <option key={product._id} value={product._id}>{product.name}</option>
                            ))}
                        </select>
                        <select
                            className="form-select mt-2"
                            value={item.stockId}
                            onChange={(event) => handleItemChange(index, "stockId", event.target.value)}
                        >
                            <option value="">Select stock</option>
                            {stocks.map(stock => (
                                <option key={stock._id} value={stock._id}>{stock.name}</option>
                            ))}
                        </select>

                        <select className="form-select mt-2"
                            value={item.shelfId}
                            onChange={(event) => handleItemChange(index, "shelfId", event.target.value)}
                        >
                            <option value="">Select shelf</option>
                            {shelves
                                .filter(shelf => shelf.stockId === item.stockId)
                                .map(shelf => (
                                    <option key={shelf._id} value={shelf._id}>{shelf.name}</option>
                                ))}
                        </select>
                        <input
                            className="form-control mt-2"
                            type="number"
                            value={item.quantity}
                            onChange={(event) => handleItemChange(index, "quantity", parseFloat(event.target.value))}
                            placeholder="Quantity"
                        />
                        <input
                            className="form-control mt-2"
                            type="number"
                            value={item.unitNetPrice}
                            onChange={(event) => handleItemChange(index, "unitNetPrice", parseFloat(event.target.value))}
                            placeholder="Unit net price"
                        />
                        <input
                            className="form-control mt-2"
                            type="number"
                            value={item.unitGrossPrice}
                            onChange={(event) => handleItemChange(index, "unitGrossPrice", parseFloat(event.target.value))}
                            placeholder="Unit gross price"
                        />
                        <input
                            className="form-control mt-2"
                            type="number"
                            value={item.vat}
                            onChange={(event) => handleItemChange(index, "vat", parseFloat(event.target.value))}
                            placeholder="VAT"
                        />
                    </div>
                ))}
                <button type="button" className="btn btn-outline-primary mt-3" onClick={handleAddItem}>Add item</button>
                <label className="form-label mt-3 fw-medium d-block">Notes
                    <input
                        className="form-control mt-1"
                        type="text"
                        name="notes"
                        value={formData.notes}
                        onChange={(event) => {
                            setFormData({ ...formData, notes: event.target.value });
                            setError("");
                        }}
                        placeholder="Notes"
                    />
                </label>
                <button type="submit" className="btn btn-primary mt-3">Save</button>
            </form>
        </div>
    );
}

export default PurchaseOrderFormPage;
