import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * @description Interface for permission guard props
 */
interface PermissionGuardProps {
    module: string;
    feature?: string;
    children: React.ReactNode;
}

/**
 * @description      Permission guard component to check user permissions
 * @param module     Module name
 * @param feature    Feature name (optional)
 * @param children   Children to render if user has permission
 * @returns          Children if user has permission, error message if not
 */
const PermissionGuard = ({ module, feature, children }: PermissionGuardProps) => {
    const { userData } = useAuth();

    if (feature) {
        if (!userData?.rolePermission?.[module]?.[feature]?.access) {
            return (
                <div className="p-4">
                    <p className="text-danger">You do not have permission to access {module}-module {feature}-feature.</p>
                </div>
            );
        }
    } else {
        if (!userData?.rolePermission?.[module]) {
            return (
                <div className="p-4">
                    <p className="text-danger">You do not have permission to access {module}-module.</p>
                </div>
            );
        }
    }

    return children;
}

export default PermissionGuard;
