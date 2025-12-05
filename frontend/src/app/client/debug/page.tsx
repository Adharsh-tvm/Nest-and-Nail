import { getCurrentUser } from "@/app/actions/user-actions";
import UserHydration from "@/app/components/containers/UserHydration";
import { cookies } from "next/headers";

export default async function DebugUserPage() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const user = await getCurrentUser();

  console.log("Heyyyyyyyyyyyyyyyyy",user)

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">🔍 Debug User Page</h1>

      <section className="p-4 border rounded">
        <h2 className="font-semibold mb-2">🍪 All Cookies</h2>
        <pre className="bg-gray-100 p-3 rounded">
          {JSON.stringify(allCookies, null, 2)}
        </pre>
      </section>

      <section className="p-4 border rounded">
        <h2 className="font-semibold mb-2">📌 getCurrentUser() Returned</h2>
        <pre className="bg-gray-100 p-3 rounded">
          {JSON.stringify(user, null, 2)}
        </pre>
      </section>

      {/* Hydrate Zustand */}
      <UserHydration user={user} />

      <section className="p-4 border rounded">
        <p className="text-sm text-gray-500">
          Zustand hydration complete. Open console to check store manually:
        </p>
        <code className="block bg-gray-200 p-2 rounded">
          useUserStore.getState().user
        </code>
      </section>
    </div>
  );
}
