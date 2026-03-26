/**
 * User interface
 */
export interface User {
    _id:        string;
    first_name: string;
    last_name:  string;
    email:      string;
    role:       string;
    active:     boolean;
    createdAt:  string;
    tenant:     string;
}