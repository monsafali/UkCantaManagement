import Navbar from "../components/Navbar";
import useAuthStore from "../store/authStore";




export default function UserDashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <>


      <main className="min-h-screen bg-gray-100">
        {/* Dashboard Header */}
        <section className="border-b bg-white">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900">
              User Dashboard
            </h1>

            <p className="mt-1 text-gray-500">
              Welcome, {user?.fullname}
            </p>
          </div>
        </section>

      </main>
    </>
  );
}
