"use client";

import {
  Boxes,
  KeyRound,
  Mail,
  User,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Shield,
  Loader2,
  Users,
  Lock,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

const PACKAGES = [
  "ASS1", "ASS2", "ASS3", "ASS4", "ASS5",
  "ASS6", "ASS7", "ASS8", "ASS9", "ASS10",
];

// Matches userSchema.role enum exactly
const ALL_ROLES = ["installer", "supervisor", "user", "admin", "superadmin"];

const ROLE_STYLES = {
  superadmin: "text-purple-700 bg-purple-50",
  admin: "text-emerald-700 bg-emerald-50",
  supervisor: "text-blue-700 bg-blue-50",
  installer: "text-gray-600 bg-gray-100",
  user: "text-gray-600 bg-gray-100",
};

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "installer",
  pkg: "",
};

/*
 * Reads the logged-in user's role + pkg from localStorage.
 *
 * Adjust these key names to match what your login flow actually
 * stores. Tries a single "user" JSON blob first, then falls back
 * to flat "role" / "pkg" keys.
 */
function readAuthFromStorage() {
  if (typeof window === "undefined") {
    return { role: null, pkg: null };
  }

  try {
    const raw = window.localStorage.getItem("user:data");

    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        role: parsed.role || null,
        pkg: parsed.pkg || null,
      };
    }
  } catch {
    // fall through to flat keys
  }

  return {
    role: window.localStorage.getItem("role"),
    pkg: window.localStorage.getItem("pkg"),
  };
}

export default function WorkforceManage({
  initialUsers = [],
  initialError = "",
}) {
  const [users, setUsers] = useState(initialUsers);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(initialError);

  const [query, setQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("create");

  const [form, setForm] = useState(emptyForm);

  const [originalEmail, setOriginalEmail] = useState("");

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [currentRole, setCurrentRole] = useState(null);
  const [currentPkg, setCurrentPkg] = useState(null);

  useEffect(() => {
    const { role, pkg } = readAuthFromStorage();
    setCurrentRole(role);
    setCurrentPkg(pkg);
  }, []);

  const isSuperAdmin = currentRole === "superadmin";
  const isAdmin = currentRole === "admin";
  const canManageUsers = isSuperAdmin || isAdmin;

  /*
   * Roles the current viewer is allowed to assign.
   * superadmin -> everything
   * admin -> everything except admin / superadmin
   * everyone else -> nothing (Add User is hidden anyway)
   */
  const assignableRoles = useMemo(() => {
    if (isSuperAdmin) return ALL_ROLES;
    if (isAdmin) return ALL_ROLES.filter((r) => r !== "admin" && r !== "superadmin");
    return [];
  }, [isSuperAdmin, isAdmin]);

  /*
   * Can the current viewer edit/delete this particular row?
   * admin can't touch admin/superadmin accounts.
   */
  const canModifyUser = (u) => {
    if (isSuperAdmin) return true;
    if (isAdmin) return u.role !== "admin" && u.role !== "superadmin";
    return false;
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setError("");

    try {
      const res = await fetch("/api/workforce", { method: "GET" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load users");
      }

      setUsers(data.users || []);
    } catch (error) {
      setError(error.message || "Network error while loading users");
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
        u.pkg?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
    );
  }, [users, query]);

  const openCreate = () => {
    if (!canManageUsers) return;

    setMode("create");
    setForm({
      ...emptyForm,
      role: assignableRoles[0] || "installer",
      // admin is locked to their own package
      pkg: isAdmin ? currentPkg || "" : "",
    });
    setOriginalEmail("");
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (user) => {
    if (!canModifyUser(user)) return;

    setMode("edit");

    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "installer",
      pkg: user.pkg || "",
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

    if (!canManageUsers) {
      setFormError("You don't have permission to do this");
      return;
    }

    if (
      !form.name ||
      !form.email ||
      (mode === "create" && !form.password) ||
      (mode === "create" && !form.pkg)
    ) {
      setFormError("Please fill in all required fields");
      return;
    }

    if (form.password && form.password.length < 6) {
      setFormError("Password must be at least 6 characters long");
      return;
    }

    // Guard against a spoofed/disabled dropdown value slipping through
    if (!assignableRoles.includes(form.role)) {
      setFormError("You're not allowed to assign this role");
      return;
    }

    if (isAdmin && form.pkg !== currentPkg) {
      setFormError("You can only create users in your own package");
      return;
    }

    setSaving(true);

    try {
      if (mode === "create") {
        const res = await fetch("/api/workforce", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
            pkg: form.pkg,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to create user");
        }
      } else {
        const updates = {
          email: originalEmail,
          name: form.name,
          role: form.role,
        };

        if (form.password) {
          updates.password = form.password;
        }

        const res = await fetch("/api/workforce", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to update user");
        }
      }

      setModalOpen(false);
      await fetchUsers();
    } catch (error) {
      setFormError(error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !canModifyUser(deleteTarget)) return;

    setDeleting(true);

    try {
      const res = await fetch("/api/workforce", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: deleteTarget.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      setDeleteTarget(null);
      await fetchUsers();
    } catch (error) {
      setError(error.message || "Failed to delete user");
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
    <div className="w-full h-full p-6">
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
                placeholder="Search name, email, package, role"
                className="bg-transparent outline-none text-sm w-56"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {canManageUsers && (
              <button
                type="button"
                onClick={openCreate}
                className="flex items-center gap-1.5 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
              >
                <Plus size={16} />
                Add User
              </button>
            )}
          </div>
        </div>

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
                  filteredUsers.map((u) => {
                    const modifiable = canModifyUser(u);

                    return (
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
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                              ROLE_STYLES[u.role] || ROLE_STYLES.user
                            }`}
                          >
                            {u.role === "admin" || u.role === "superadmin" ? (
                              <ShieldCheck size={12} />
                            ) : (
                              <Shield size={12} />
                            )}
                            {u.role || "user"}
                          </span>
                        </td>

                        <td className="px-5 py-3 text-gray-600">{u.pkg || "—"}</td>

                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            {modifiable ? (
                              <>
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
                              </>
                            ) : (
                              <span
                                className="p-2 text-gray-300"
                                title="You don't have permission to manage this user"
                              >
                                <Lock size={15} />
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
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

            {/* Role / Package */}
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck size={16} />
                  Role
                </span>

                <select
                  className="p-2 border rounded-lg bg-gray-50 text-sm capitalize focus:border-black outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  value={form.role}
                  disabled={assignableRoles.length === 0}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  {/* keep current value visible even if outside allowed set (e.g. viewing an admin row you can't edit into) */}
                  {!assignableRoles.includes(form.role) && (
                    <option value={form.role} className="capitalize">
                      {form.role}
                    </option>
                  )}

                  {assignableRoles.map((r) => (
                    <option key={r} value={r} className="capitalize">
                      {r}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Boxes size={16} />
                  Package{" "}
                  {(mode === "edit" || isAdmin) && (
                    <span className="font-normal text-gray-400 text-xs">(fixed)</span>
                  )}
                </span>

                <select
                  disabled={mode === "edit" || isAdmin}
                  className="p-2 border rounded-lg bg-gray-50 text-sm focus:border-black outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  value={form.pkg}
                  onChange={(e) => setForm({ ...form, pkg: e.target.value })}
                >
                  <option value="" disabled>
                    Select package
                  </option>

                  {PACKAGES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {formError && <p className="text-xs text-red-600 -mt-2">{formError}</p>}

            <button
              type="button"
              className="w-full bg-black text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? mode === "create" ? "Creating..." : "Saving..."
                : mode === "create" ? "Create User" : "Save Changes"}
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
              <span className="font-semibold">{deleteTarget.name}</span> ({deleteTarget.email})
              will be permanently removed.
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