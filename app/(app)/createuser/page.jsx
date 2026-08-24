"use client";
import {
  Boxes,
  KeyRound,
  Mail,
  User,
  UserStar,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  ShieldCheck,
  ShieldOff,
  Loader2,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const PACKAGES = [
  "ASS1", "ASS2", "ASS3", "ASS4", "ASS5",
  "ASS6", "ASS7", "ASS8", "ASS9", "ASS10",
];

// createUser expects a Bearer token; the rest ride on the httpOnly-style cookie.
// If your auth cookie is httpOnly, swap this for wherever you already keep the
// token client-side (e.g. a value you set in localStorage at login).
function getToken() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const emptyForm = { name: "", email: "", password: "", isAdmin: false };

export default function WorkforceManage() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "edit"
  const [form, setForm] = useState(emptyForm);
  const [originalEmail, setOriginalEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getusers`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      } else {
        setError(data.message || "Failed to load users");
      }
    } catch (e) {
      setError("Network error while loading users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.pkg?.toLowerCase().includes(q)
    );
  }, [users, query]);

  const openCreate = () => {
    setMode("create");
    setForm(emptyForm);
    setOriginalEmail("");
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setMode("edit");
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      isAdmin: !!user.isAdmin,
    });
    setOriginalEmail(user.email);
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const handleSave = async () => {
    setFormError("");

    if (!form.name || !form.email || (mode === "create" && !form.password)) {
      setFormError("Please fill in all required fields");
      return;
    }
    if (form.password && form.password.length < 6) {
      setFormError("Password must be at least 6 characters long");
      return;
    }

    setSaving(true);
    try {
      if (mode === "create") {
        const token = getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/createuser`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            isAdmin: form.isAdmin,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to create user");
      } else {
        const updates = {
          email: originalEmail,
          name: form.name,
          isAdmin: form.isAdmin,
        };
        if (form.password) updates.password = form.password;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updateuser`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to update user");
      }

      setModalOpen(false);
      await fetchUsers();
    } catch (e) {
      setFormError(e.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteuser`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: deleteTarget.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");
      setDeleteTarget(null);
      await fetchUsers();
    } catch (e) {
      setError(e.message || "Failed to delete user");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const initials = (name) =>
    (name || "?")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");

  return (
    <div className="w-full h-full  p-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-black rounded-xl text-white">
              <Users size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Workforce</h1>
              <p className="text-xs text-gray-500 mt-1">
                {users.length} user{users.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search name, email, package"
                className="bg-transparent outline-none text-sm w-48"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="flex items-center gap-1.5 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
            >
              <Plus size={16} />
              Add User
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wide border-b">
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Package</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingUsers ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                      <Loader2 size={18} className="animate-spin inline-block mr-2" />
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                      {query ? "No users match your search" : "No users yet — add your first one"}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id || u.email} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                            {initials(u.name)}
                          </div>
                          <span className="font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{u.email}</td>
                      <td className="px-5 py-3">
                        {u.isAdmin ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                            <ShieldCheck size={12} /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            <ShieldOff size={12} /> Member
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-gray-600">{u.pkg || "—"}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEdit(u)}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(u)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base">
                {mode === "create" ? "Add User" : "Edit User"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X size={18} />
              </button>
            </div>

            {/* Name */}
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">Name</span>
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 focus-within:border-black">
                <User size={16} />
                <input
                  type="text"
                  className="w-full bg-transparent outline-none text-sm"
                  placeholder="Enter name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </label>

            {/* Email */}
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">
                Email{" "}
                {mode === "edit" && (
                  <span className="font-normal text-gray-400">(can&apos;t be changed)</span>
                )}
              </span>
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 focus-within:border-black">
                <Mail size={16} />
                <input
                  type="email"
                  className="w-full bg-transparent outline-none text-sm disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="Enter email"
                  autoComplete="off"
                  disabled={mode === "edit"}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </label>

            {/* Password */}
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">
                Password{" "}
                {mode === "edit" && (
                  <span className="font-normal text-gray-400">(leave blank to keep)</span>
                )}
              </span>
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 focus-within:border-black">
                <KeyRound size={16} />
                <input
                  type="password"
                  className="w-full bg-transparent outline-none text-sm"
                  placeholder={mode === "create" ? "Enter password" : "New password"}
                  autoComplete="off"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </label>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <UserStar size={16} /> Is Admin
                </span>
                <select
                  className="p-2 border rounded-lg bg-gray-50 text-sm focus:border-black outline-none"
                  value={form.isAdmin ? "yes" : "no"}
                  onChange={(e) => setForm({ ...form, isAdmin: e.target.value === "yes" })}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Boxes size={16} /> Package
                </span>
                <select
                  disabled
                  className="p-2 border rounded-lg bg-gray-50 text-sm focus:border-black outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {PACKAGES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {formError && (
              <p className="text-xs text-red-600 -mt-2">{formError}</p>
            )}

            <button
              type="button"
              className="w-full bg-black text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                ? "Create User"
                : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-full">
                <Trash2 size={18} />
              </div>
              <div>
                <h2 className="font-bold text-base">Delete user?</h2>
                <p className="text-xs text-gray-500">This can&apos;t be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">{deleteTarget.name}</span>{" "}
              ({deleteTarget.email}) will be permanently removed.
            </p>
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2 rounded-lg text-sm font-semibold border hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:opacity-90 transition disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}