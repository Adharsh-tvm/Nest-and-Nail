import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "./Login-form";

const LoginPage = async () => {



  const linkClass = "text-gray-500 hover:text-[#DC2626] transition-colors";

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 font-sans p-4">
      <div className="w-full max-w-sm">
        {/* Card Container */}
        <div className="bg-white border-t-4 border-t-[#DC2626] rounded-2xl shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="p-8 pb-0 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-[#0f291e] text-white rounded-xl shadow-md">
                <GalleryVerticalEnd className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#0f291e]">Welcome Back</h1>
            <p className="text-sm text-gray-500 mt-2">
              Sign in to your account to continue.
            </p>
          </div>

          {/* Card Content */}
          <LoginForm />

          {/* Card Footer */}
          <div className="p-6 pt-2 text-center text-sm bg-gray-50/50">
            <p className="text-gray-500 mb-2">Don't have an account?</p>

            <div className="flex justify-center items-center gap-2">
              <a href="/signup" className={`font-bold ${linkClass}`}>
                Sign up here
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
