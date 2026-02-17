import api from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useState, useEffect } from 'react';
import { MenuIcon, PenSquareIcon, ArrowLeftSquareIcon } from "lucide-react";

export default function Sidebar({ setNote }) {
    const [level, setLevel] = useState(0);
    const [notes, setNotes] = useState([]);
    const [notebooks, setNotebooks] = useState([]);
    const [currentNotebookId, setCurrentNotebookId] = useState(0);
    const [currentNotebookName, setCurrentNotebookName] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const getNotebooks = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const resp = await api.get("/notebook", { headers: { Authorization: `Bearer ${token}` } });
                    setNotebooks(resp.data);
                } else {
                    navigate("/login");
                }
            } catch (err) {
                if (err.response.status === 401) {
                    navigate("/login");
                } else {
                    toast.error("Unable to get your notebooks.");
                }
            } finally { }
        };

        getNotebooks();
    }, []);

    const createNotebook = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const resp = await api.post(`/notebook`, { name: 'New Notebook' }, { headers: { Authorization: `Bearer ${token}` } });
                if (resp.status === 200) {
                    setNotebooks(prevNotebooks => [
                        resp.data,
                        ...prevNotebooks
                    ]);
                } else {
                    toast.error("Unable to get create notebook.");
                    return;
                }
            } else {
                navigate("/login");
            }
        } catch (err) {
            toast.error("Unable to create notebook.");
        } finally { }
    }

    const deleteNotebook = async (e, notebookId) => {
        e.preventDefault();
        if (!window.confirm("Are you sure you want to delete this notebook?")) return;
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const resp = await api.delete(`/notebook/${notebookId}`, { headers: { Authorization: `Bearer ${token}` } });
                console.log(resp);
                if (resp.status === 200) {
                    setNotebooks(prevNotebooks => prevNotebooks.filter(notebook => notebook.id !== notebookId));
                } else {
                    toast.error("Unable to delete notebook.");
                    return;
                }
            } else {
                navigate("/login");
            }
        } catch (err) {
            toast.error("Unable to delete notebook.");
        } finally { }
    }

    const getNotes = async (e, notebookId, notebookName) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const resp = await api.get(`/notes/inbook/${notebookId}`, { headers: { Authorization: `Bearer ${token}` } });
                setNotes(resp.data);
                setCurrentNotebookId(notebookId);
                setCurrentNotebookName(notebookName);
                setLevel(1);
            } else {
                navigate("/login");
            }
        } catch (err) {
            toast.error("Unable to get notes.");
        } finally { }
    }

    const createNote = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const resp = await api.post('/notes',
                    {
                        notebookId: currentNotebookId,
                        title: "New Note"
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                if (resp.status === 200) {
                    setNotes(prevNotes => [
                        resp.data,
                        ...prevNotes
                    ]);
                } else {
                    toast.error("Unable to get create note.");
                    return;
                }
            } else {
                navigate("/login");
            }
        } catch (err) {
            toast.error("Unable to create note.");
        } finally { }
    }

    const getNote = async (e, noteId) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const resp = await api.get(`/notes/${noteId}`, { headers: { Authorization: `Bearer ${token}` } });
                setNote(resp.data);
            } else {
                navigate("/login");
            }
        } catch (err) {
            toast.error("Unable to get note.");
        } finally { }
    }

    const deleteNote = async (e, noteId) => {
        e.preventDefault();
        if (!window.confirm("Are you sure you want to delete this note?")) return;
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const resp = await api.delete(`/notes/${noteId}`, { headers: { Authorization: `Bearer ${token}` } });
                console.log(resp);
                if (resp.status === 200) {
                    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
                } else {
                    toast.error("Unable to delete note.");
                    return;
                }
            } else {
                navigate("/login");
            }
        } catch (err) {
            toast.error("Unable to delete note.");
        } finally { }
    }

    const goToNotebooks = async (e) => {
        e.preventDefault();

        setNotes([]);
        setCurrentNotebookId(0);
        setCurrentNotebookName("");
        setLevel(0);
    }

    const truncateText = (text, maxLength) => {
        if (!text) return "";
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + "...";
        } else {
            return text;
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div class="navbar border-b">
                <div class="navbar-start">
                    {level === 0 && (
                        <button className="btn btn-ghost btn-circle">
                            <MenuIcon className="sixe-4" />
                        </button>

                    )}
                    {level === 1 && (
                        <button class="btn btn-ghost btn-circle" >
                            <ArrowLeftSquareIcon className="sixe-4" onClick={(e) => goToNotebooks(e)} />
                        </button>
                    )}
                </div>
                <div class="navbar-center">
                    {level === 0 && (
                        <span className="font-semibold text-xl">Notebooks</span>
                    )}
                    {level === 1 && currentNotebookName.length <= 20 && (
                        <span className="font-semibold text-xl">{currentNotebookName}</span>
                    )}
                    {level === 1 && currentNotebookName.length > 20 && (
                        <span className="font-semibold text-xl tooltip tooltip-bottom" data-tip={currentNotebookName}>
                            {truncateText(currentNotebookName, 20)}
                        </span>
                    )}
                </div>
                <div class="navbar-end">
                    {level === 0 && (
                        <button class="btn btn-ghost btn-circle" onClick={(e) => createNotebook(e)}>
                            <PenSquareIcon className="sixe-4" />
                        </button>
                    )}
                    {level === 1 && (
                        <button class="btn btn-ghost btn-circle" onClick={(e) => createNote(e)}>
                            <PenSquareIcon className="sixe-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Notebooks and Notes */}
            <div className="p-3">
                {level === 0 && (
                    <ul class="menu p-0">
                        {/* {notebooks.map(notebook => (
                            <li key={notebook.id}>
                                <a className="text-base border-b border-base-300" onClick={(e) => getNotes(e, notebook.id, notebook.name)}>
                                    {notebook.name}
                                </a>
                            </li>
                        ))} */}
                        {notebooks.map(notebook => (
                            <li key={notebook.id}>
                                <div className="flex items-center gap-2 border-b border-base-300 px-3 py-3">
                                    <a className="flex-1 text-base cursor-pointer truncate" onClick={(e) => getNotes(e, notebook.id, notebook.name)}>
                                        {notebook.name}
                                    </a>
                                    <details className="dropdown dropdown-end shrink-0">
                                        <summary className="btn btn-ghost btn-sm px-2">⋮</summary>
                                        <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-40 p-2 shadow">
                                            <li>
                                                <a>Edit</a>
                                            </li>
                                            <li>
                                                <a className="text-error" onClick={(e) => deleteNotebook(e, notebook.id)}>
                                                    Delete Notebook
                                                </a>
                                            </li>
                                        </ul>
                                    </details>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {level === 1 && (
                    <ul class="menu p-0">
                        {/* {notes.map(note => (
                            <li key={note.id}>
                                <a className="text-base border-b border-base-300" onClick={(e) => getNote(e, note.id)}>
                                    {note.title}
                                </a>
                            </li>
                        ))} */}
                        {notes.map(note => (
                            <li key={note.id}>
                                <div className="flex items-center gap-2 border-b border-base-300 px-3 py-3">
                                    <a className="flex-1 text-base cursor-pointer truncate" onClick={(e) => getNote(e, note.id)}>
                                        {note.title}
                                    </a>
                                    <details className="dropdown dropdown-end shrink-0">
                                        <summary className="btn btn-ghost btn-sm px-2">⋮</summary>
                                        <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-40 p-2 shadow">
                                            {/* <li><a>Edit</a></li> */}
                                            <li>
                                                <a className="text-error" onClick={(e) => deleteNote(e, note.id)}>
                                                    Delete Note
                                                </a>
                                            </li>
                                        </ul>
                                    </details>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
