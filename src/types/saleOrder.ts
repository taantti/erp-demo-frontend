/**
 * The life cycle of the sale order
 */
export type SaleOrderStatus =
    | "draft"
    | "ordered"
    | "partially_sent"
    | "send"
    | "cancelled";

/**
 * Sale order item interface
 */
export interface SaleOrderItem {
    _id: string;
    productName: string;
    productId: string;
    stockId: string;
    shelfId: string;
    quantity: number;
    unitNetPrice: number;
    unitGrossPrice: number;
    vat: number;
    sendQuantity: number;
}

/**
 * Sale order item request
 */
export interface SaleOrderItemRequest {
    productName: string;
    productId: string;
    stockId: string;
    shelfId: string;
    quantity: number;
    unitNetPrice: number;
    unitGrossPrice: number;
    vat: number;
    sendQuantity: number;
}

/**
 * Sale order interface
 */
export interface SaleOrder {
    _id: string;
    orderNumber: string;
    customerId: string;
    status: SaleOrderStatus;
    orderDate?: string;
    expectedDeliveryDate?: string;
    items: SaleOrderItem[];
    notes?: string;
}

/**
 * Sale order request
 */
export interface SaleOrderRequest {
    orderNumber: string;
    customerId: string;
    status: SaleOrderStatus;
    orderDate?: string;
    expectedDeliveryDate?: string;
    items: SaleOrderItemRequest[];
    notes?: string;
}