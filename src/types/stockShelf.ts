/**
 * Stock shelf interface
 */
export interface StockShelf {
    _id: string;
    stockId: string;
    name: string;
    code: string;
    location: string;
    capacity: number;
    active: boolean;
}

/**
 * Stock shelf request interface for create/update
 */
export interface StockShelfRequest {
    name: string;
    stockId: string;
    code: string;
    location: string;
    capacity: number;
    active: boolean;
}