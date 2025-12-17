export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center px-6">
        <img
          src="/logo.webp"
          alt="Logo"
          className="w-44 h-44 md:w-56 md:h-56 mx-auto mb-8 select-none pointer-events-none"
          draggable={false}
        />

        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />

        <p className="text-white text-xl">Loading Galaxy...</p>
        <p className="text-gray-400 text-lg mt-2">
          Generating stars and cosmic structures
        </p>
      </div>
    </div>
  );
}
