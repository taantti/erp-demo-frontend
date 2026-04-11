/**
 * Product category interface
 */
export interface ProductCategory {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    active: boolean;
}

/**
 * Product category request interface
 */
export interface ProductCategoryRequest {
    name: string;
    slug: string;
    description?: string;
    active: boolean;
} 
