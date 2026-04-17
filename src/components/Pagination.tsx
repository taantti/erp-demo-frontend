import { Pagination } from "react-bootstrap";
import type { PaginationProps } from "../types/paginationProps";

const PaginationComponent = (props: PaginationProps) => {
    if (props.totalPages <= 1) {
        return null;
    }


    return (
        <div className="d-flex justify-content-center mt-3">
            <Pagination>

                <Pagination.Prev
                    onClick={() => props.onPageChange(props.currentPage - 1)}
                    disabled={props.currentPage === 1}
                />

                {Array.from({ length: props.totalPages }, (_, index) => index + 1).map(page =>
                    <Pagination.Item
                        key={page}
                        active={page === props.currentPage}
                        onClick={() => props.onPageChange(page)}
                    >
                        {page}
                    </Pagination.Item>
                )}

                <Pagination.Next
                    onClick={() => props.onPageChange(props.currentPage + 1)}
                    disabled={props.currentPage === props.totalPages}
                />
            </Pagination>
        </div>
    );
};

export default PaginationComponent;