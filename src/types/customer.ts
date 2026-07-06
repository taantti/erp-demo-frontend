/**
 * A single postal address
 */
export interface PostalAddress {
    type: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
}

/**
 * Customer interface
 */
export interface Customer {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: Record<string, PostalAddress>;
    active: boolean;
}

/**
 * Customer request
 */
export interface CustomerRequest {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: Record<string, PostalAddress>;
    active: boolean;
}