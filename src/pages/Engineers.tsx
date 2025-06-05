import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { engineerService } from "../services/engineerService";
import type { User } from "../types";

const Engineers: React.FC = () => {
  const [engineers, setEngineers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [skillFilter, setSkillFilter] = useState("");
  const [capacityFilter, setCapacityFilter] = useState(0);
  console.log("Engineers component rendered", engineers);
  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const params: any = {};
        if (skillFilter) params.skills = skillFilter;
        if (capacityFilter > 0) params.minCapacity = capacityFilter;

        const data = await engineerService.getAll(params);
        setEngineers(data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch engineers");
        setLoading(false);
      }
    };
    fetchEngineers();
  }, [skillFilter, capacityFilter]);

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 80) return "text-green-600";
    if (capacity >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Engineers</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="skillFilter"
              className="block text-sm font-medium text-gray-700"
            >
              Filter by Skill
            </label>
            <select
              id="skillFilter"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            >
              <option value="">All Skills</option>
              <option value="React">React</option>
              <option value="Node.js">Node.js</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="Spring">Spring</option>
              <option value="Angular">Angular</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="capacityFilter"
              className="block text-sm font-medium text-gray-700"
            >
              Minimum Available Capacity (%)
            </label>
            <input
              type="number"
              id="capacityFilter"
              min="0"
              max="100"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      {/* Engineers Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {engineers.map((engineer) => (
          <div
            key={engineer._id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {engineer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {engineer.name}
                  </h3>
                  <p className="text-sm text-gray-500">{engineer.email}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Department:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {engineer.department || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Available Capacity:
                  </span>
                  <span
                    className={`text-sm font-medium ${getCapacityColor(
                      engineer.currentCapacity || 0
                    )}`}
                  >
                    {engineer.currentCapacity}%
                  </span>
                </div>
                <div className="mt-3">
                  <span className="text-sm text-gray-500">Skills:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {engineer.skills?.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <Link
                to={`/engineers/${engineer._id}`}
                className="text-sm font-medium text-cyan-700 hover:text-cyan-900"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Engineers;
