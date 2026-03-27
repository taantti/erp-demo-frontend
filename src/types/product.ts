/**
 * Product interface
 */
export interface Product {
    _id:        string;
    name:       string;
    sku:        string;
    unit:       string;
    netPrice:   number;
    grossPrice: number;
    vatRate:    number;
    active:     boolean;
}