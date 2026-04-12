/**
 * User interface
 */
export interface User {
    _id:        string;
    username:   string; 
    first_name: string;
    last_name:  string;
    email:      string;
    role:       string;
    active:     boolean;
    createdAt:  string;
    tenant:     string;
}

/**
 * User request interface
 */
export interface UserRequest {
    username:   string;
    password?:   string;
    first_name: string;
    last_name:  string;
    email:      string;
    role:       string;
    active:     boolean;
}