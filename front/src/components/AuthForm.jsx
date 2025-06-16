
import { useState } from 'react'

// import { useNavigate } from 'react-router-dom';
import axioshelper from '../helper/axiosHelper';

const AuthForm = ({ onLogin }) => {
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(prev => !prev);

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form)
    const postData = Object.fromEntries(formData.entries());
   
    try {
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
        const {data} = await axioshelper.post(endpoint, postData);
        
        if(data?.status){
          
           onLogin(data?.data.user, data?.data?.token)
        }
        setLoading(false)
    } catch (error) {
       console.log("response:", error.message);
      setLoading(false)
      console.error("Login error:", error);
    }
  };

  return (
      <div className="min-h-screen flex  items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 ">
      <div className="py-6 px-4 ">
        <div className="min-w-[450px]">
          <div className="border bg-white border-slate-300 rounded-lg p-6  ">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="mb-12">
                <h1 className="text-slate-900 text-3xl font-semibold">
                  {isLogin ? 'Sign in' : 'Register'}
                </h1>
                <p className="text-slate-600 text-[15px] mt-6 leading-relaxed">
                  {isLogin
                    ? 'Sign in to your account and explore a world of possibilities.'
                    : 'Create an account and join us!'}
                </p>
              </div>

              {/* Username */}
              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">User name</label>
                <input
                  name="username"
                  type="text"
                  required
                  className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                  placeholder="Enter user name"
                />
              </div>

              {/* Email (only for register) */}
              {!isLogin && (
                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                    placeholder="Enter email"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                  placeholder="Enter password"
                />
              </div>

              <div className="!mt-12">
                <button
                  type="submit"
                  className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Register'}
                </button>

                <p className="text-sm !mt-6 text-slate-600">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    type="button"
                    onClick={toggleForm}
                    className="text-blue-600 font-medium hover:underline ml-1"
                  >
                    {isLogin ? 'Register here' : 'Login here'}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm