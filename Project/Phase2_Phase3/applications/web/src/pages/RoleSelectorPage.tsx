import { Link } from "react-router";
import { Shield, Gamepad2, ArrowRight } from "lucide-react";

export default function RoleSelectorPage() {
  return (
    <div className="h-screen w-full flex">
      {/* Admin Panel - Left Side */}
      <Link
        to="/admin"
        className="group relative flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex flex-col items-center justify-center overflow-hidden transition-all duration-500 hover:flex-[1.1]"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-white">
          <div className="rounded-full bg-white/10 p-8 backdrop-blur-sm ring-2 ring-white/20 transition-all duration-500 group-hover:scale-110 group-hover:bg-white/20">
            <Shield className="h-24 w-24" strokeWidth={1.5} />
          </div>

          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 transition-transform duration-500 group-hover:scale-105">
              Admin
            </h1>
            <p className="text-xl text-blue-100 max-w-md mb-8">
              Manage the platform, view analytics, and generate comprehensive reports
            </p>

            <div className="inline-flex items-center gap-2 text-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
              <span>Access Dashboard</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Bottom Label */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <span className="text-sm text-blue-200/80 font-medium">
            Full platform control
          </span>
        </div>
      </Link>

      {/* Divider */}
      <div className="w-1 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

      {/* Player Panel - Right Side */}
      <Link
        to="/player/select"
        className="group relative flex-1 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-800 flex flex-col items-center justify-center overflow-hidden transition-all duration-500 hover:flex-[1.1]"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-white">
          <div className="rounded-full bg-white/10 p-8 backdrop-blur-sm ring-2 ring-white/20 transition-all duration-500 group-hover:scale-110 group-hover:bg-white/20">
            <Gamepad2 className="h-24 w-24" strokeWidth={1.5} />
          </div>

          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 transition-transform duration-500 group-hover:scale-105">
              Player
            </h1>
            <p className="text-xl text-purple-100 max-w-md mb-8">
              View your stats, track achievements, and explore the game library
            </p>

            <div className="inline-flex items-center gap-2 text-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
              <span>Enter Game Hub</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Bottom Label */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <span className="text-sm text-purple-200/80 font-medium">
            Your gaming journey
          </span>
        </div>
      </Link>
    </div>
  );
}
