import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { projectService } from "../services/projectService";
import { assignmentService } from "../services/assignmentService";
import { engineerService } from "../services/engineerService";
import type { Project, Assignment, User } from "../types";
import { useAuth } from "../context/AuthContext";
import AssignEngineerModal from "../components/AssignEngineerModal";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [availableEngineers, setAvailableEngineers] = useState<User[]>([]);
  console.log(availableEngineers, "available engineers");

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const data = await projectService.getById(id!);
      setProject(data.project);
      setAssignments(data.assignments);

      // Fetch available engineers if user is manager
      if (user?.role === "manager") {
        const engineers = await engineerService.getAll({
          skills: data.project.requiredSkills.join(","),
          minCapacity: 10,
        });
        console.log("Available Engineers:", engineers);

        setAvailableEngineers(engineers);
      }

      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch project details");
      setLoading(false);
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    if (!window.confirm("Are you sure you want to remove this assignment?"))
      return;

    try {
      await assignmentService.delete(assignmentId);
      toast.success("Assignment removed successfully");
      fetchProjectDetails();
    } catch (error) {
      toast.error("Failed to remove assignment");
    }
  };

  const handleAssignEngineer = async (
    engineerId: string,
    allocation: number,
    role: string
  ) => {
    try {
      await projectService.update(id!, { engineerId: engineerId });
      console.log("Assigning engineer with ID:", engineerId);

      await assignmentService.create({
        engineerId,
        projectId: id,
        allocationPercentage: allocation,
        startDate: new Date().toISOString(),
        role: role as any,
      });
      toast.success("Engineer assigned successfully");
      setShowAssignModal(false);
      fetchProjectDetails();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to assign engineer");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const totalAllocated = assignments.reduce(
    (sum, a) => sum + a.allocationPercentage,
    0
  );
  const teamCapacity = (totalAllocated / (project.teamSize * 100)) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {project.name}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {project.description}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">
                {project.status}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Team Size</dt>
              <dd className="mt-1 text-sm text-gray-900">{project.teamSize}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Start Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(project.startDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">End Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {project.endDate
                  ? new Date(project.endDate).toLocaleDateString()
                  : "Not set"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Required Skills
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="flex flex-wrap gap-1">
                  {project.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Team Capacity
              </dt>
              <dd className="mt-1">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        {teamCapacity.toFixed(0)}% Allocated
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div
                      style={{ width: `${Math.min(teamCapacity, 100)}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        teamCapacity > 100 ? "bg-red-500" : "bg-blue-500"
                      }`}
                    />
                  </div>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Team Assignments
          </h3>
          {user?.role === "manager" && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
            >
              Assign Engineer
            </button>
          )}
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engineer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Allocation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skills
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
                return (
                  <tr key={assignment._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {engineer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.allocationPercentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {engineer.skills?.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    {user?.role === "manager" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleRemoveAssignment(assignment._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
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

      {showAssignModal && (
        <AssignEngineerModal
          engineers={availableEngineers}
          onAssign={handleAssignEngineer}
          onClose={() => setShowAssignModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
