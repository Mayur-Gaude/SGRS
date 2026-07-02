import {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  getDepartmentAnalytics,
} from "../../api/analytics.api";

import DeptAdminLayout from "../../components/layout/DeptAdminLayout";

import { AuthContext } from "../../context/AuthContext";

const DepartmentAnalytics = () => {

  const { user } =
    useContext(AuthContext);

  const [data, setData] =
    useState(null);

  useEffect(() => {

    const fetch = async () => {

      try {

        const res =
          await getDepartmentAnalytics(
            user.department_id
          );

        setData(res.data.data);


      } catch (error) {

        console.log(error);
      }
    };

    if (user?.department_id) {
      fetch();
    }

  }, [user]);

  if (!user) {
    return (
      <DeptAdminLayout>
        <p className="p-6">
          Authenticating...
        </p>
      </DeptAdminLayout>
    );
  }

  if (!user.department_id) {
    return (
    <DeptAdminLayout>
        <p className="p-6">
          No department assigned
        </p>
      </DeptAdminLayout>
      );
  }

  if (!data) {
    return (
      <DeptAdminLayout>
        <p className="p-6">
          Loading...
        </p>
      </DeptAdminLayout>
    );
  }

  return (
    <DeptAdminLayout>

      <div className="p-6">

        {/* TITLE */}
        <div className="mb-6">

          <h1 className="text-3xl font-bold">
            Department Analytics
          </h1>

          <p className="text-gray-500">
            Performance overview
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          <div className="bg-white shadow rounded-xl p-5">
            <p>Total</p>

            <h2 className="text-3xl font-bold mt-2">
              {data.stats.total}
            </h2>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <p>Resolved</p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {data.stats.resolved}
            </h2>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <p>Pending</p>

            <h2 className="text-3xl font-bold text-orange-500 mt-2">
              {data.stats.pending}
            </h2>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <p>Rejected</p>

            <h2 className="text-3xl font-bold text-red-500 mt-2">
              {data.stats.rejected}
            </h2>
          </div>
        </div>

        {/* SLA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

          <div className="bg-white shadow rounded-xl p-5">

            <h2 className="text-xl font-semibold">
              SLA Compliance
            </h2>

            <div className="mt-4">

              <p>
                Response Compliance
              </p>

              <div className="w-full bg-gray-200 rounded-full h-4 mt-2">

                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{
                    width: `${data.sla.responseCompliance}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-sm">
                {
                  data.sla
                    .responseCompliance
                }%
              </p>
            </div>

            <div className="mt-6">

              <p>
                Resolution Compliance
              </p>

              <div className="w-full bg-gray-200 rounded-full h-4 mt-2">

                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{
                    width: `${data.sla.resolutionCompliance}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-sm">
                {
                  data.sla
                    .resolutionCompliance
                }%
              </p>
            </div>
          </div>

          {/* RESOLUTION */}
          <div className="bg-white shadow rounded-xl p-5">

            <h2 className="text-xl font-semibold">
              Resolution Metrics
            </h2>

            <div className="mt-6">

              <p className="text-gray-500">
                Average Resolution Time
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {
                  data.resolution
                    .avgResolutionTime
                } hrs
              </h2>
            </div>
          </div>
        </div>
      </div>
    </DeptAdminLayout>
  );
};

export default DepartmentAnalytics;