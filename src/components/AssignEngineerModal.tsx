import React, { useState } from "react";
import type { User } from "../types";

interface AssignEngineerModalProps {
  engineers: User[];
  onAssign: (engineerId: string, allocation: number, role: string) => void;
  onClose: () => void;
}

const AssignEngineerModal: React.FC<AssignEngineerModalProps> = ({
  engineers,
  onAssign,
  onClose,
}) => {
  const [selectedEngineer, setSelectedEngineer] = useState("");
  const [allocation, setAllocation] = useState(20);
  const [role, setRole] = useState("Developer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEngineer) {
      onAssign(selectedEngineer, allocation, role);
    }
  };

  const selectedEngineerData = engineers.find(
    (e) => e._id === selectedEngineer
  );

  return (
    <div className="fixed z-990 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div> */}

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Assign Engineer to Project
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="engineer"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Engineer
                  </label>
                  <select
                    id="engineer"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={selectedEngineer}
                    onChange={(e) => setSelectedEngineer(e.target.value)}
                    required
                  >
                    <option value="">Choose an engineer</option>
                    {engineers.map((engineer) => (
                      <option key={engineer._id} value={engineer._id}>
                        {engineer.name} (Available: {engineer.currentCapacity}%)
                      </option>
                    ))}
                  </select>
                </div>

                {selectedEngineerData && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">
                      <strong>Skills:</strong>{" "}
                      {selectedEngineerData.skills?.join(", ")}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Department:</strong>{" "}
                      {selectedEngineerData.department}
                    </p>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="allocation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Allocation Percentage
                  </label>
                  <input
                    type="number"
                    id="allocation"
                    min="10"
                    max={selectedEngineerData?.currentCapacity || 100}
                    step="10"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={allocation}
                    onChange={(e) => setAllocation(parseInt(e.target.value))}
                    required
                  />
                  {selectedEngineerData &&
                    allocation > selectedEngineerData.currentCapacity! && (
                      <p className="mt-1 text-sm text-red-600">
                        Allocation exceeds available capacity
                      </p>
                    )}
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="Developer">Developer</option>
                    <option value="Tech Lead">Tech Lead</option>
                    <option value="Architect">Architect</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={
                  !selectedEngineer ||
                  (selectedEngineerData &&
                    allocation > selectedEngineerData.currentCapacity!)
                }
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignEngineerModal;
