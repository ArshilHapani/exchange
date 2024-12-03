import GoogleSignInButton from "./GoogleSignInButton";

export function HeroSection() {
  return (
    <div className="text-center py-20 px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto">
        The crypto of tomorrow, <span className="text-blue-500">today</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Create a frictionless wallet with just a Google Account.
      </p>
      <GoogleSignInButton />
    </div>
  );
}
