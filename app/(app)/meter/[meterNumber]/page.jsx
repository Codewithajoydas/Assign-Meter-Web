import getInstallerName from "@/lib/getInstallerName";
import { cookies } from "next/headers";

export default async function Page({ params }) {
  const cookieStore = await cookies();
  const paramss = await params;
  const access_token = cookieStore.get("access_token")?.value;

  const res = await fetch(
    `https://assign-meter-backend.onrender.com/api/searchmeter?meterNumber=${paramss.meterNumber}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-store",
    },
  );

  const data = await res.json();
  const meter = data.data?.meters;

  const installerName = await getInstallerName(meter?.installerId);
  console.log(installerName);

  if (!meter) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-400">No meter found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-2 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Meter Details
              </h1>
              <p className="text-sm text-gray-500 mt-1">#{meter.meterNumber}</p>
            </div>

            <StatusBadge status={meter.status} />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg">
          <Section title="Meter Information">
            <Info label="Package" value={meter.pkg} />
            <Info label="Category" value={meter.equipCategory} />
            <Info label="Type" value={meter.meterType} />
            <Info label="Installation" value={meter.installationType} />
            <Info label="Location" value={meter.storeLocation} />
            <Info label="Agency" value={meter.agency} />
            <Info label="Installer ID" value={meter.installerId} />
            <Info label="Installer Name" value={installerName} />
          </Section>


          <Section title="Supervisor">
            <Info label="Name" value={meter.supervisor?.name} />
            <Info label="Email" value={meter.supervisor?.email} />
            <Info label="Package" value={meter.supervisor?.pkg} />
            <Info
              label="Admin"
              value={meter.supervisor?.isAdmin ? "Yes" : "No"}
            />
          </Section>

          <Divider />

          {/* Footer */}
          <div className="px-6 py-4 text-xs text-gray-500 flex justify-between">
            <span>
              Created:{" "}
              <span className="text-gray-800 font-medium">
                {new Date(meter.createdAt).toLocaleString()}
              </span>
            </span>
            <span>
              Updated:{" "}
              <span className="text-gray-800 font-medium">
                {new Date(meter.updatedAt).toLocaleString()}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Section */
function Section({ title, children }) {
  return (
    <div className=" mt-4 px-6 py-5">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        {title}
      </h2>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

/* Divider */
function Divider() {
  return <div className="border-t border-gray-100 mt-2" />;
}

/* Info Row */
function Info({ label, value }) {
  return (
    <div className="grid grid-cols-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium text-right">
        {value || "—"}
      </span>
    </div>
  );
}

/* Status Badge */
function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 text-lg rounded-full capitalize font-medium ${
        styles[status] || styles.inactive
      }`}
    >
      {status || "unknown"}
    </span>
  );
}
