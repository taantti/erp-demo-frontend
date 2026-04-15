/**
 * Stock interface
 */
export interface Stock {
    _id: string;
    name: string;
    location: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    active: boolean;
    manager: string;
    contactInfo: {
        phone: string;
        email: string;
    };
}

/**
 * Stock request interface for create/update
 */
export interface StockRequest {
    name: string;
    location: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    active: boolean;
    manager: string;
    contactInfo: {
        phone: string;
        email: string;
    };
}