/**
 * The lifecycle of a purchase order
 */
export type PurchaseOrderStatus =
    | "draft"
    | "ordered"
    | "partially_received"
    | "received"
    | "cancelled";

/**
 * Purchase order item interface
 */
export interface PurchaseOrderItem {
    _id: string;
    productName: string;
    productId: string;
    stockId: string;
    shelfId: string;
    quantity: number;
    unitNetPrice: number;
    unitGrossPrice: number;
    vat: number;
    receivedQuantity: number;
}

/**
 * Purchase order item request
 */
export interface PurchaseOrderItemRequest {
    productName: string;
    productId: string;
    stockId: string;
    shelfId: string;
    quantity: number;
    unitNetPrice: number;
    unitGrossPrice: number;
    vat: number;
    receivedQuantity?: number;
}

/**
 * Purchase order interface
 */
export interface PurchaseOrder {
    _id: string;
    orderNumber: string;
    supplier?: string;
    status: PurchaseOrderStatus;
    orderDate?: string;
    expectedDeliveryDate?: string;
    items: PurchaseOrderItem[];
    notes?: string;
}

/**
 * Purchase order request
 */
export interface PurchaseOrderRequest {
    orderNumber: string;
    supplier?: string;
    status: PurchaseOrderStatus;
    orderDate?: string;
    expectedDeliveryDate?: string;
    items: PurchaseOrderItemRequest[];
    notes?: string;
}
