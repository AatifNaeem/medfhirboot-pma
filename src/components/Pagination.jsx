import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ offset, offsetTo, total, prevUrl, nextUrl, onPageChange }) => {
    return (
        <>
            <button
                onClick={() => onPageChange(prevUrl)}
                disabled={!prevUrl}
                className="font-semibold btn btn-sm btn-square btn-outline btn-outline-neutral text-neutral text-center disabled:opacity-50"
            >
                <ChevronLeft size={18} />
            </button>

            <span className='text-sm text-gray-700'>
                Showing patients {offset + 1}-{offsetTo} of {total}
            </span>

            <button
                onClick={() => onPageChange(nextUrl)}
                disabled={!nextUrl}
                className="font-semibold btn btn-sm btn-square btn-outline btn-outline-neutral text-neutral text-center disabled:opacity-50"
            >
                <ChevronRight size={18} />
            </button>
        </>
    );
};

export default Pagination;
