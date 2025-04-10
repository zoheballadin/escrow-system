'use client';
import Link from 'next/link';

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Login as...</h1>

        <div className="flex flex-col gap-4">
          <Link href="/buyer">
            <button className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200">
              🛒 Buyer
            </button>
          </Link>

          <Link href="/seller">
            <button className="cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200">
              🏷️ Seller
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
