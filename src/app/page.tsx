import Link from 'next/link';

export default function Page() {
  return (
  <main className="min-h-screen flex items-center justify-center p-6 bg-linear-to-b from-[#0b1220] to-[#0f1a33]">
      <div className="w-full max-w-2xl animate-fadeIn">
  <div className="bg-linear-to-b from-[#0f1a33] to-[#0b1228] p-10 rounded-2xl shadow-2xl border border-[#1a2942]">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">
              <span className="text-blue-400">Trust</span>ify
            </h1>
            <div className="h-1 w-20 bg-linear-to-r from-blue-400 to-blue-600 mx-auto mb-4 rounded-full"></div>
            <p className="text-gray-400 text-lg">Tasks, teams, and getting stuff done without the chaos.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="bg-[#0b1228]/50 p-6 rounded-lg border border-[#1a2942] flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-blue-600/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Task Management</h3>
              <p className="text-gray-400 mb-4">Create, track, and complete tasks with ease</p>
            </div>
            
            <div className="bg-[#0b1228]/50 p-6 rounded-lg border border-[#1a2942] flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-blue-600/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-400 mb-4">Work together seamlessly with your team</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link 
              href="/auth/login" 
              className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 text-center flex-1 sm:flex-initial sm:min-w-[140px] hover:shadow-lg hover:shadow-blue-600/20"
            >
              Login
            </Link>
            <Link 
              href="/auth/signup" 
              className="px-6 py-3 rounded-md border border-[#1a2942] hover:border-blue-500 hover:bg-[#1a2942]/30 transition-all duration-200 text-center flex-1 sm:flex-initial sm:min-w-[140px]"
            >
              Sign up
            </Link>
          </div>
        </div>
        
        <div className="text-center mt-6 text-gray-500 text-sm">
          © {new Date().getFullYear()} Trustify. All rights reserved.
        </div>
      </div>
    </main>
  );
}
