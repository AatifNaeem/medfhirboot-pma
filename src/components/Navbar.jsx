import React from 'react';
import { Link } from "react-router";
// import LogoutButton from "./LogoutButton";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <header className='border-b border-base-content/30'>
            <div className='mx-auto maz-w-6xl p-2 px-4'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-2xl font-bold tracking-tighter'>
                        Notebook
                    </h1>
                    <div className='flex items-center gap-4'>
                        {!isAuthenticated && (
                            <>
                                <Link to="/login" className="btn btn-sm btn-ghost">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-sm btn-ghost">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;