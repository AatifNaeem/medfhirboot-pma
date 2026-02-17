import React from 'react'

const Loader = () => {
    return (
        // <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
        //     <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-500" />
        // </div>
        <div className="fixed inset-0 flex items-center justify-center bg-base-100/60 z-50">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral/30 border-t-neutral" />
        </div>
    )
}

export default Loader