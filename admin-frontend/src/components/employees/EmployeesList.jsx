import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import api from "../../api/axios";
import { useState } from "react";
import toast from "react-hot-toast";
import EmployeeFormModal from "./EmployeeFormModal";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function EmployeesList() {
  const queryClient = useQueryClient();
  const endpoint = "/agency-admin/staff";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  const {
    data: employees,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["agencyEmployees"],
    queryFn: async () => (await api.get(endpoint)).data,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`${endpoint}/${id}`),
    onSuccess: () => {
      toast.success("Employee removed successfully");
      queryClient.invalidateQueries({ queryKey: ["agencyEmployees"] });
    },
    onError: () => toast.error("Failed to remove employee"),
  });

  const handleDelete = (emp) => {
    if (window.confirm(`Are you sure you want to remove ${emp.name}?`)) {
      deleteMutation.mutate(emp.id);
    }
  };

  const handleEdit = (emp) => {
    setEmployeeToEdit(emp);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEmployeeToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8 max-w-7xl mx-auto font-['Plus_Jakarta_Sans']"
      >
        <motion.div
          variants={item}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
              Team Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Manage your agents and their access levels.
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">
              person_add
            </span>
            Add Employee
          </button>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 ambient-shadow overflow-hidden p-2"
        >
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                progress_activity
              </span>
            </div>
          ) : isError ? (
            <div className="p-12 text-center text-red-500 font-bold bg-red-50 dark:bg-red-500/10 rounded-3xl m-4">
              Failed to load employees.
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Name
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Email
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Role
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {employees?.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                    >
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white text-lg flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        {emp.name}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {emp.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${emp.role === "AGENCY_ADMIN" ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-blue-100 text-blue-700 border-blue-200"}`}
                        >
                          {emp.role.replace("AGENCY_", "")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(emp)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-primary hover:bg-primary/10 transition-all"
                          >
                            <span className="material-symbols-outlined text-lg">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(emp)}
                            disabled={deleteMutation.isPending}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                          >
                            <span className="material-symbols-outlined text-lg">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!employees || employees.length === 0) && (
                    <tr>
                      <td colSpan="4" className="p-16 text-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="material-symbols-outlined text-4xl text-slate-400">
                            group_off
                          </span>
                        </div>
                        <p className="text-slate-900 dark:text-white font-bold text-lg">
                          No employees found
                        </p>
                        <p className="text-slate-500 mt-1">
                          Start building your team by adding an employee.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* المودال مرمي كـ أخ بره الجدول تماماً */}
      <AnimatePresence>
        {isModalOpen && (
          <EmployeeFormModal
            onClose={() => setIsModalOpen(false)}
            employeeToEdit={employeeToEdit}
          />
        )}
      </AnimatePresence>
    </>
  );
}
