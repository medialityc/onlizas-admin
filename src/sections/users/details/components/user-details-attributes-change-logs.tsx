"use client";
import React from "react";
import { format } from "date-fns";
import { UserAttributeLog } from "@/types/users";
import { getUserAttributeHistory } from "@/services/users";

const AttributeChangeLog = ({ id }: { id: number }) => {
  const [logs, setLogs] = React.useState<UserAttributeLog[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await getUserAttributeHistory(id);

        if (response.data) {
          setLogs(response.data);
        } else {
          console.log("Error on logs", response);
         
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [id]);

  if (loading) {
    return <div className="bg-white shadow rounded-lg p-6">Loading...</div>;
  }

  if (logs.length === 0) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Attribute Change History
      </h2>
      <div className="space-y-6">
        {logs.map((log, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {log.changedBy}
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(log.changedAt), "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="bg-gray-50 rounded p-2">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(JSON.parse(log.attributesJson), null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttributeChangeLog;
