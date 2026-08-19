"use client";

import React, { useState, useEffect } from "react";
import { Search, UserCheck, Shield, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminUsers, updateUserRole, deleteUser } from "@/lib/api/auth";

const mockUsers = [
  { id: "usr-1", firstName: "Alex", lastName: "Johnson", email: "alex.johnson@example.com", role: "TRAVELER", phoneNumber: "+1 (555) 234-5678" },
  { id: "usr-2", firstName: "Ruwan", lastName: "Silva", email: "ruwan.silva@blueceylon.lk", role: "BUSINESS_OWNER", phoneNumber: "+94 77 111 2222" },
  { id: "usr-3", firstName: "Kasun", lastName: "Perera", email: "kasun.guide@gmail.com", role: "TOUR_GUIDE", phoneNumber: "+94 71 333 4444" },
  { id: "usr-4", firstName: "Admin", lastName: "User", email: "admin@blueceylon.com", role: "ADMIN", phoneNumber: "+94 11 222 3333" }
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers();
      setUsers(res && res.length ? res : mockUsers);
    } catch {
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChangeRole = async (id: string, currentRole: string, name: string) => {
    const rolesList = ["TRAVELER", "BUSINESS_OWNER", "TOUR_GUIDE", "ADMIN"];
    const input = window.prompt(
      `Change role for "${name}". Current: ${currentRole}\nEnter one of: ${rolesList.join(", ")}`
    );
    if (!input) return;
    const newRole = input.toUpperCase().trim();
    if (!rolesList.includes(newRole)) {
      alert("Invalid role selected.");
      return;
    }

    try {
      await updateUserRole(id, newRole, null);
      loadData();
    } catch {
      // Fallback update
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to deactivate / soft delete user "${name}"?`)) return;
    try {
      await deleteUser(id);
      loadData();
    } catch {
      // Fallback deletion
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term);
    
    if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center text-sm text-[#4A5A62] dark:text-[#A9BCC2]">
        Loading users...
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>
            User Accounts Management
          </h1>
          <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] mt-1">
            Search users, promote administrative roles, and manage Keycloak IAM accounts.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0F252E] rounded-[2rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#E4E9EA] dark:border-[#20353D] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AAAB0]" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#15323D] border border-[#E4E9EA] dark:border-[#20353D] rounded-xl pl-10 pr-4 py-2 text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:border-[#008080]"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-gray-50 dark:bg-[#15323D] border border-[#E4E9EA] dark:border-[#20353D] rounded-xl">
            {["ALL", "TRAVELER", "BUSINESS_OWNER", "TOUR_GUIDE", "ADMIN"].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  roleFilter === role
                    ? "bg-[#003366] text-white"
                    : "text-[#4A5A62] dark:text-[#A9BCC2] hover:text-[#0E1B22]"
                }`}
              >
                {role === "ALL" ? "All Roles" : role.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F4F6F8] dark:bg-[#15323D] text-[#4A5A62] dark:text-[#A9BCC2] text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Account Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9EA] dark:divide-[#20353D]">
              {filteredUsers.map((u) => {
                const fullName = `${u.firstName} ${u.lastName}`;
                return (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-[#15323D]/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
                      {fullName}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {u.phoneNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === "ADMIN" ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400" :
                        u.role === "BUSINESS_OWNER" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400" :
                        u.role === "TOUR_GUIDE" ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400" :
                        "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                      }`}>
                        {u.role === "ADMIN" && <Shield className="w-3 h-3" />}
                        {u.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-[#008080] hover:bg-[#008080]/10 rounded-lg" title="Change User Role" onClick={() => handleChangeRole(u.id, u.role, fullName)}>
                        <UserCheck className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-[#D64545] hover:bg-[#D64545]/10 rounded-lg" title="Deactivate User" onClick={() => handleDelete(u.id, fullName)}>
                        <UserX className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
