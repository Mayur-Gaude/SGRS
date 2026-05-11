import { useEffect, useState } from "react";

import { createAppeal } from "../../api/violation.api";
import { getMyBan } from "../../api/violation.api";

import UserLayout from "../../components/layout/UserLayout";

const AppealPage = () => {

  const [ban, setBan] = useState(undefined);

  const [reason, setReason] = useState("");

  useEffect(() => {

    const fetchBan = async () => {

      try {

        const res = await getMyBan();

        setBan(res.data.data.ban);
        
      }catch (error) {
        if (error.response?.status === 404) {
          setBan(null); // no ban, show friendly message
        } else {
          console.error("Unexpected error:", error);
        }
      }
      // } catch (error) {

      //   console.log(error);
      // }
    };

    fetchBan();

  }, []);

  const handleSubmit = async () => {

    if (!reason.trim()) {
      return alert("Enter appeal reason");
    }

    try {

      await createAppeal(
        ban._id,
        reason.trim()
      );

      alert("Appeal submitted");

      setReason("");

    } catch (error) {

      alert(
        error.response?.data?.message
      );
    }
  };

  // if (!ban) {

  //   return (
  //     <UserLayout>
  //       <p className="p-6">Loading...</p>
  //     </UserLayout>
  //   );
  // }

  if (ban === undefined) {
    return <UserLayout><p className="p-6">Loading...</p></UserLayout>;
  }
  if (ban === null) {
    return (
      <UserLayout>
        <p className="p-6">You have no active bans 🎉</p>
      </UserLayout>
    );
  }


  return (
    <UserLayout>

      <div className="p-6">

        <div className="bg-white shadow rounded p-5">

          <h1 className="text-2xl font-bold">
            Ban Appeal
          </h1>

          {/* BAN DETAILS */}
          <div className="mt-5 bg-red-50 p-4 rounded">

            <p>
              <span className="font-semibold">
                Ban Type:
              </span>{" "}
              {ban.ban_type}
            </p>

            <p className="mt-2">
              <span className="font-semibold">
                Reason:
              </span>{" "}
              {ban.ban_reason}
            </p>

            {ban.ban_end && (

              <p className="mt-2">
                <span className="font-semibold">
                  Ban Ends:
                </span>{" "}
                {new Date(
                  ban.ban_end
                ).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* APPEAL FORM */}
          <div className="mt-5">

            <label className="block mb-2">
              Appeal Reason
            </label>

            <textarea
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
              className="border p-3 rounded w-full"
              placeholder="Explain your appeal"
            />

            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-5 py-2 rounded mt-5"
            >
              Submit Appeal
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default AppealPage;