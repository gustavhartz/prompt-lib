import Link from "next/link";
import { FaHouse } from "react-icons/fa6"; // Assuming you're using react-icons for consistency

export default function NotFound() {
  return (
    <div className="flex h-screen">
      <div className="m-auto text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="mb-6">
          Oops! The page you are looking for has vanished into the ether.
        </p>
        <p className="mb-8">
          This might be a community-driven app, but sadly, this page does not
          exist... yet. Anyone is welcome to contribute, so if you think this
          page is necessary, reach out to us through GitHub!
        </p>
        <Link
          href="/"
          className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          <FaHouse className="mr-2" /> Return Home
        </Link>
      </div>
    </div>
  );
}
