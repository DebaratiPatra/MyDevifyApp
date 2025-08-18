
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

const navigate = useNavigate() 

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/")
    } catch (err) {
      setErr(err.response.data);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
    <div className="hero-content flex-col lg:flex-row-reverse">
      <div className="text-center lg:text-left">
        <h1 className="text-5xl font-bold">Welcome Back!</h1>
        <p className="py-6">  Connect with friends, share your moments, and see what’s new in your world. 
  Let’s get you back into the conversation.</p>
        <Link to="/register">
      <button className="btn btn-neutral">Register</button>
    </Link>      
      </div>
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input type="usernamtext" placeholder="Username" name='username' onChange={handleChange} className="input input-bordered" required />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input type="password" placeholder="password" name='password' onChange={handleChange} className="input input-bordered" required />
            <label className="label">
              <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
            </label>
          </div>
          <div className="form-control mt-6">
  {err && <p className="text-red-500">{err.message || err}</p>}
  <button onClick={handleLogin} className="btn btn-primary">Login</button>
</div>

        </form>
      </div>
    </div>
  </div>
  )
}

export default Login
