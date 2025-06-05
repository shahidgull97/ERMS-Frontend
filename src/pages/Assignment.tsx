import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { assignmentService } from "../services/assignmentService";
import type { Assignment, User, Project } from "../types";

import { useAuth } from "../context/AuthContext";

const Assignments: React.FC = () => {
  //   const user = useAuthStore((state) => state.user);
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "engineer" | "project">(
    "all"
  );
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    fetchAssignments();
  }, [filterType, filterValue]);

  const fetchAssignments = async () => {
    try {
      const params: any = {};
      if (filterType === "engineer" && filterValue) {
        params.engineerId = filterValue;
      } else if (filterType === "project" && filterValue) {
        params.projectId = filterValue;
      }

      const data = await assignmentService.getAll(params);
      setAssignments(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch assignments");
      setLoading(false);
    }
  };

  const handleUpdateAssignment = async (id: string, allocation: number) => {
    try {
      await assignmentService.update(id, { allocationPercentage: allocation });
      toast.success("Assignment updated successfully");
      fetchAssignments();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update assignment"
      );
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this assignment?"))
      return;

    try {
      await assignmentService.delete(id);
      toast.success("Assignment deleted successfully");
      fetchAssignments();
    } catch (error) {
      toast.error("Failed to delete assignment");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Assignments</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-4">
          <select
            className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value as any);
              setFilterValue("");
            }}
          >
            <option value="all">All Assignments</option>
            <option value="engineer">By Engineer</option>
            <option value="project">By Project</option>
          </select>

          {filterType !== "all" && (
            <input
              type="text"
              placeholder={`Enter ${filterType} ID`}
              className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          )}
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Engineer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Allocation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Date
              </th>
              {user?.role === "manager" && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assignments.map((assignment) => {
              const engineer = assignment.engineerId as User;
              const project = assignment.projectId as Project;
              return (
                <tr key={assignment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {engineer.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {engineer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {project.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {project.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assignment.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assignment.allocationPercentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(assignment.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assignment.endDate
                      ? new Date(assignment.endDate).toLocaleDateString()
                      : "Ongoing"}
                  </td>
                  {user?.role === "manager" && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteAssignment(assignment._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assignments;
