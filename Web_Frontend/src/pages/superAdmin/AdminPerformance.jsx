import {
  useEffect,
  useState,
} from "react";

import {
  getAdminPerformance,
} from "../../api/analytics.api";

import {
  getAdmins,
} from "../../api/admin.api";

import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

const AdminPerformance = () => {

  const [admins, setAdmins] =
    useState([]);

  const [selectedAdmin, setSelectedAdmin] =
    useState("");

  const [stats, setStats] =
    useState(null);

  useEffect(() => {

    const fetchAdmins =
      async () => {

        try {

          const res =
            await getAdmins();

          setAdmins(
            res.data.data
          );

        } catch (error) {

          console.log(error);
        }
      };

    fetchAdmins();

  }, []);

  const fetchPerformance =
    async (adminId) => {

      try {

        const res =
          await getAdminPerformance(
            adminId
          );

        setStats(
          res.data.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  return (
    <SuperAdminLayout>

      <div className="p-6">

        {/* HEADER */}
        <div className="mb-6">

          <h1 className="text-3xl font-bold">
            Admin Performance
          </h1>

          <p className="text-gray-500 mt-1">
            Monitor department admin efficiency
          </p>
        </div>

        {/* SELECT ADMIN */}
        <div className="bg-white shadow rounded-xl p-6">

          <label className="block mb-3">
            Select Department Admin
          </label>

          <select
            value={selectedAdmin}
            onChange={(e) => {

              setSelectedAdmin(
                e.target.value
              );

              fetchPerformance(
                e.target.value
              );
            }}
            className="border p-3 rounded w-full"
          >

            <option value="">
              Select Admin
            </option>

            {admins.map((a) => (

              <option
                key={a._id}
                value={a._id}
              >

                {a.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* STATS */}
        {stats && (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">

            <div className="bg-white shadow rounded-xl p-5">

              <p>Total Assigned</p>

              <h2 className="text-3xl font-bold mt-2">

                {
                  stats.totalAssigned
                }
              </h2>
            </div>

            <div className="bg-white shadow rounded-xl p-5">

              <p>Resolved</p>

              <h2 className="text-3xl font-bold text-green-600 mt-2">

                {
                  stats.resolved
                }
              </h2>
            </div>

            <div className="bg-white shadow rounded-xl p-5">

              <p>Pending</p>

              <h2 className="text-3xl font-bold text-orange-500 mt-2">

                {
                  stats.pending
                }
              </h2>
            </div>

            <div className="bg-white shadow rounded-xl p-5">

              <p>SLA Compliance</p>

              <h2 className="text-3xl font-bold text-blue-500 mt-2">

                {
                  stats.slaCompliance
                }
                %
              </h2>
            </div>

            <div className="bg-white shadow rounded-xl p-5">

              <p>Escalations</p>

              <h2 className="text-3xl font-bold text-red-500 mt-2">

                {
                  stats.escalations
                }
              </h2>
            </div>

            <div className="bg-white shadow rounded-xl p-5">

              <p>Avg Resolution</p>

              <h2 className="text-3xl font-bold text-purple-500 mt-2">

                {
                  stats.avgResolutionTime
                }
                hrs
              </h2>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
};

export default AdminPerformance;