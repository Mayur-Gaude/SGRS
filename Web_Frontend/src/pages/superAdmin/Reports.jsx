// import {
//   useEffect,
//   useState,
// } from "react";

// import {
//   generateReport,
//   getReports,
// } from "../../api/analytics.api";

// import {
//   getDepartments,
// } from "../../api/department.api";

// import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

// const Reports = () => {

//   const [departments, setDepartments] =
//     useState([]);

//   const [reports, setReports] =
//     useState([]);

//   const [form, setForm] =
//     useState({
//       departmentId: "",
//       report_period: "DAILY",
//     });

//   useEffect(() => {

//     const fetch = async () => {

//       try {

//         const deptRes =
//           await getDepartments();

//         setDepartments(
//           deptRes.data.data
//         );

//       } catch (error) {

//         console.log(error);
//       }
//     };

//     fetch();

//   }, []);

//   const fetchReports = async (
//     departmentId
//   ) => {

//     try {

//       const res =
//         await getReports(
//           departmentId
//         );

//       setReports(
//         res.data.data
//       );

//     } catch (error) {

//       console.log(error);
//     }
//   };

//   const handleGenerate =
//     async () => {

//       try {

//         await generateReport(form);

//         alert(
//           "Report generated"
//         );

//         fetchReports(
//           form.departmentId
//         );

//       } catch (error) {

//         alert(
//           error.response?.data
//             ?.message
//         );
//       }
//     };

//   return (
//     <SuperAdminLayout>

//       <div className="p-6">

//         {/* HEADER */}
//         <div className="mb-6">

//           <h1 className="text-3xl font-bold">
//             Analytics Reports
//           </h1>

//           <p className="text-gray-500 mt-1">
//             Generate and monitor department reports
//           </p>
//         </div>

//         {/* GENERATE REPORT */}
//         <div className="bg-white shadow rounded-xl p-6">

//           <h2 className="text-xl font-semibold mb-5">
//             Generate Report
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//             {/* DEPARTMENT */}
//             <div>

//               <label className="block mb-2">
//                 Department
//               </label>

//               <select
//                 value={
//                   form.departmentId
//                 }
//                 onChange={(e) => {

//                   setForm({
//                     ...form,
//                     departmentId:
//                       e.target.value,
//                   });

//                   fetchReports(
//                     e.target.value
//                   );
//                 }}
//                 className="border p-3 rounded w-full"
//               >

//                 <option value="">
//                   Select Department
//                 </option>

//                 {departments.map(
//                   (d) => (

//                     <option
//                       key={d._id}
//                       value={d._id}
//                     >

//                       {d.name}
//                     </option>
//                   )
//                 )}
//               </select>
//             </div>

//             {/* PERIOD */}
//             <div>

//               <label className="block mb-2">
//                 Report Period
//               </label>

//               <select
//                 value={
//                   form.report_period
//                 }
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     report_period:
//                       e.target.value,
//                   })
//                 }
//                 className="border p-3 rounded w-full"
//               >

//                 <option value="DAILY">
//                   DAILY
//                 </option>

//                 <option value="WEEKLY">
//                   WEEKLY
//                 </option>

//                 <option value="MONTHLY">
//                   MONTHLY
//                 </option>
//               </select>
//             </div>
//           </div>

//           <button
//             onClick={
//               handleGenerate
//             }
//             className="bg-blue-600 text-white px-5 py-2 rounded mt-6"
//           >
//             Generate Report
//           </button>
//         </div>

//         {/* REPORT LIST */}
//         <div className="bg-white shadow rounded-xl p-6 mt-8">

//           <h2 className="text-xl font-semibold mb-5">
//             Generated Reports
//           </h2>

//           <div className="overflow-x-auto">

//             <table className="w-full">

//               <thead>

//                 <tr className="border-b">

//                   <th className="text-left py-3">
//                     Date
//                   </th>

//                   <th className="text-left py-3">
//                     Period
//                   </th>

//                   <th className="text-left py-3">
//                     Total
//                   </th>

//                   <th className="text-left py-3">
//                     Resolved
//                   </th>

//                   <th className="text-left py-3">
//                     Pending
//                   </th>

//                   <th className="text-left py-3">
//                     SLA %
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>

//                 {reports.map(
//                   (r) => (

//                     <tr
//                       key={r._id}
//                       className="border-b"
//                     >

//                       <td className="py-3">

//                         {new Date(
//                           r.report_date
//                         ).toLocaleDateString()}
//                       </td>

//                       <td>
//                         {
//                           r.report_period
//                         }
//                       </td>

//                       <td>
//                         {
//                           r.total_complaints
//                         }
//                       </td>

//                       <td className="text-green-600">
//                         {
//                           r.resolved_complaints
//                         }
//                       </td>

//                       <td className="text-orange-500">
//                         {
//                           r.pending_complaints
//                         }
//                       </td>

//                       <td className="font-semibold">
//                         {
//                           r.sla_compliance_percent
//                         }
//                         %
//                       </td>
//                     </tr>
//                   )
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </SuperAdminLayout>
//   );
// };

// export default Reports;

import {
  useEffect,
  useState,
} from "react";

import {
  generateReport,
  getReports,
} from "../../api/analytics.api";

import {
  getDepartments,
} from "../../api/department.api";

import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

const Reports = () => {

  const [departments, setDepartments] =
    useState([]);

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      departmentId: "",
      report_period: "DAILY",
      start_date: "",
      end_date: "",
    });

  // FETCH DEPARTMENTS
  useEffect(() => {

    const fetchDepartments =
      async () => {

        try {

          const res =
            await getDepartments();

          setDepartments(
            res.data.data
          );

        } catch (error) {

          console.log(error);
        }
      };

    fetchDepartments();

  }, []);

  // FETCH REPORTS
  const fetchReports =
    async (departmentId) => {

      if (!departmentId) return;

      try {

        const res =
          await getReports(
            departmentId
          );

        setReports(
          res.data.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  // GENERATE REPORT
  const handleGenerate =
    async () => {

      try {

        if (!form.departmentId) {
          return alert(
            "Select department"
          );
        }

        if (
          form.report_period ===
            "CUSTOM" &&
          (
            !form.start_date ||
            !form.end_date
          )
        ) {
          return alert(
            "Please Select start and end date"
          );
        }

        setLoading(true);

        await generateReport(form);

        alert(
          "Report generated successfully"
        );

        fetchReports(
          form.departmentId
        );

      } catch (error) {

        alert(
          error.response?.data
            ?.message ||
          "Failed to generate report"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <SuperAdminLayout>

      <div className="p-6">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Analytics Reports
          </h1>

          <p className="text-gray-500 mt-2">
            Generate daily, weekly,
            monthly and custom reports
          </p>
        </div>

        {/* GENERATE REPORT */}
        <div className="bg-white shadow rounded-2xl p-6">

          <h2 className="text-2xl font-semibold mb-6">
            Generate Report
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* DEPARTMENT */}
            <div>

              <label className="block mb-2 font-medium">
                Department
              </label>

              <select
                value={
                  form.departmentId
                }
                onChange={(e) => {

                  setForm({
                    ...form,
                    departmentId:
                      e.target.value,
                  });

                  fetchReports(
                    e.target.value
                  );
                }}
                className="border border-gray-300 p-3 rounded-lg w-full"
              >

                <option value="">
                  Select Department
                </option>

                {departments.map(
                  (d) => (

                    <option
                      key={d._id}
                      value={d._id}
                    >
                      {d.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* PERIOD */}
            <div>

              <label className="block mb-2 font-medium">
                Report Period
              </label>

              <select
                value={
                  form.report_period
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    report_period:
                      e.target.value,
                  })
                }
                className="border border-gray-300 p-3 rounded-lg w-full"
              >

                <option value="DAILY">
                  DAILY
                </option>

                <option value="WEEKLY">
                  WEEKLY
                </option>

                <option value="MONTHLY">
                  MONTHLY
                </option>

                <option value="CUSTOM">
                  CUSTOM
                </option>
              </select>
            </div>
          </div>

          {/* CUSTOM DATES */}
          {form.report_period ===
            "CUSTOM" && (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

              {/* START DATE */}
              <div>

                <label className="block mb-2 font-medium">
                  Start Date
                </label>

                <input
                  type="date"
                  value={
                    form.start_date
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      start_date:
                        e.target.value,
                    })
                  }
                  className="border border-gray-300 p-3 rounded-lg w-full"
                />
              </div>

              {/* END DATE */}
              <div>

                <label className="block mb-2 font-medium">
                  End Date
                </label>

                <input
                  type="date"
                  value={
                    form.end_date
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      end_date:
                        e.target.value,
                    })
                  }
                  className="border border-gray-300 p-3 rounded-lg w-full"
                />
              </div>
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={
              handleGenerate
            }
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mt-6 transition"
          >

            {loading
              ? "Generating..."
              : "Generate Report"}
          </button>
        </div>

        {/* REPORT TABLE */}
        <div className="bg-white shadow rounded-2xl p-6 mt-8">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-semibold">
              Generated Reports
            </h2>

            <p className="text-sm text-gray-500">
              Total Reports:
              {" "}
              {reports.length}
            </p>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-50">

                  <th className="text-left py-4 px-3">
                    Report Date
                  </th>

                  <th className="text-left py-4 px-3">
                    Period
                  </th>

                  <th className="text-left py-4 px-3">
                    From
                  </th>

                  <th className="text-left py-4 px-3">
                    To
                  </th>

                  <th className="text-left py-4 px-3">
                    Total
                  </th>

                  <th className="text-left py-4 px-3">
                    Resolved
                  </th>

                  <th className="text-left py-4 px-3">
                    Pending
                  </th>

                  <th className="text-left py-4 px-3">
                    Avg Hours
                  </th>

                  <th className="text-left py-4 px-3">
                    SLA %
                  </th>
                </tr>
              </thead>

              <tbody>

                {reports.map(
                  (r) => (

                    <tr
                      key={r._id}
                      className="border-b hover:bg-gray-50 transition"
                    >

                      {/* REPORT DATE */}
                      <td className="py-4 px-3">

                        {new Date(
                          r.report_date
                        ).toLocaleDateString()}
                      </td>

                      {/* PERIOD */}
                      <td className="py-4 px-3 font-medium">
                        {
                          r.report_period
                        }
                      </td>

                      {/* START */}
                      <td className="py-4 px-3">

                        {new Date(
                          r.period_start
                        ).toLocaleDateString()}
                      </td>

                      {/* END */}
                      <td className="py-4 px-3">

                        {new Date(
                          r.period_end
                        ).toLocaleDateString()}
                      </td>

                      {/* TOTAL */}
                      <td className="py-4 px-3">
                        {
                          r.total_complaints
                        }
                      </td>

                      {/* RESOLVED */}
                      <td className="py-4 px-3 text-green-600 font-semibold">
                        {
                          r.resolved_complaints
                        }
                      </td>

                      {/* PENDING */}
                      <td className="py-4 px-3 text-orange-500 font-semibold">
                        {
                          r.pending_complaints
                        }
                      </td>

                      {/* AVG */}
                      <td className="py-4 px-3">
                        {
                          Number(
                            r.avg_resolution_hours
                          ).toFixed(2)
                        }
                        h
                      </td>

                      {/* SLA */}
                      <td className="py-4 px-3 font-semibold text-blue-600">

                        {
                          Number(
                            r.sla_compliance_percent
                          ).toFixed(2)
                        }
                        %
                      </td>
                    </tr>
                  )
                )}

                {reports.length === 0 && (

                  <tr>

                    <td
                      colSpan="9"
                      className="text-center py-10 text-gray-500"
                    >
                      No reports generated
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Reports;