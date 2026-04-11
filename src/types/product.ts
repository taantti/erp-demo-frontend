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

/**
 * Product request interface for create/update
 */
export interface ProductRequest {
    name:           string;
    sku:            string;
    unit:           string;
    description:    string;
    netPrice:       number;
    grossPrice:     number;
    vatRate:        number;
    active:         boolean;
}