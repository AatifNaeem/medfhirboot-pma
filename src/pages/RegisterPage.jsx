import React from 'react';
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";

const RegisterPage = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
            toast.error("All fields are required");
            return;
        }

        setLoading(true);

        try {
            await axios.post("/api/auth/register", form);
            setSuccess(true);
            setForm({ name: "", email: "", password: "" });
            toast.success("Registered successfully.");
            navigate("/");
        } catch (err) {
            toast.error("Failed to create note.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-full max-w-md shadow-xl bg-base-100">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl">
                        Create Account
                    </h2>

                    {error && (
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success">
                            <span>Account created successfully</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="input input-bordered"
                                placeholder="Your name"
                                value={form.name}
                                onChange={handleChange}
                            />
                        </div>

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
                            <label className="label">
                                <span className="label-text-alt">
                                    Minimum 6 characters
                                </span>
                            </label>
                        </div>

                        <div className="form-control mt-6">
                            <button
                                className={`btn btn-accent ${loading ? "loading" : ""}`}
                                disabled={loading}
                            >
                                Register
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm mt-4">
                        Already have an account?{" "}
                        <a href="/login" className="link link-primary">
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;