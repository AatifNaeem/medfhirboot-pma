import React from 'react';
import api from "../api/axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const { login } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!form.email || !form.password) {
            toast.error("Email and password are required.");
            return;
        }

        setLoading(true);

        try {
            const resp = await api.post("/auth/login", form);
            login(resp.data.token);
            navigate("/home");
        } catch (err) {
            if (err.response.status === 401) {
                toast.error("Invalid email or password!");
            } else {
                toast.error("Unable to get your notebooks.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-full max-w-md shadow-xl bg-base-100">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl">
                        Login
                    </h2>

                    {error && (
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="input input-bordered"
                                placeholder="email@example.com"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="input input-bordered"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-control mt-6">
                            <button
                                className={`btn btn-accent ${loading ? "loading" : ""}`}
                                disabled={loading}
                            >
                                Login
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm mt-4">
                        Don’t have an account?{" "}
                        <a href="/register" className="link link-primary">
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;