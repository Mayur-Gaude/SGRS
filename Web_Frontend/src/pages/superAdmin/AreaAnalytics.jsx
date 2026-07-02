import {
  useEffect,
  useState,
} from "react";

import {
  getAreaAnalytics,
} from "../../api/analytics.api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

const AreaAnalytics = () => {

  const [areas, setAreas] =
    useState([]);

  useEffect(() => {

    const fetch = async () => {

      try {

        const res =
          await getAreaAnalytics();

        setAreas(
          res.data.data
        );

      } catch (error) {

        console.log(error);
      }
    };

    fetch();

  }, []);

  return (
    <SuperAdminLayout>

      <div className="p-6">

        {/* HEADER */}
        <div className="mb-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Area Analytics
          </h1>

          <p className="text-gray-500 mt-1">
            Complaint hotspot analysis
          </p>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white shadow rounded-xl p-5">

            <p className="text-gray-500">
              Total Areas
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {areas.length}
            </h2>
          </div>

          <div className="bg-white shadow rounded-xl p-5">

            <p className="text-gray-500">
              Highest Complaints
            </p>

            <h2 className="text-3xl font-bold text-red-500 mt-2">

              {
                areas[0]
                  ?.complaintCount || 0
              }
            </h2>
          </div>

          <div className="bg-white shadow rounded-xl p-5">

            <p className="text-gray-500">
              Most Affected Area
            </p>

            <h2 className="text-2xl font-bold text-orange-500 mt-2">

              {
                areas[0]
                  ?.area_id || "N/A"
              }
            </h2>
          </div>
        </div>

        {/* CHART */}
        <div className="bg-white shadow rounded-xl p-5 mt-8">

          <h2 className="text-xl font-semibold mb-5">
            Complaint Distribution by Area
          </h2>

          <ResponsiveContainer
            width="100%"
            height={400}
          >

            <BarChart data={areas}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="area_id"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="complaintCount"
              />

            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow rounded-xl p-5 mt-8">

          <h2 className="text-xl font-semibold mb-5">
            Area Breakdown
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-3">
                    Area
                  </th>

                  <th className="text-left py-3">
                    Complaints
                  </th>
                </tr>
              </thead>

              <tbody>

                {areas.map((a, index) => (

                  <tr
                    key={index}
                    className="border-b"
                  >

                    <td className="py-3">
                      {a.area_id}
                    </td>

                    <td className="font-semibold">
                      {
                        a.complaintCount
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default AreaAnalytics;