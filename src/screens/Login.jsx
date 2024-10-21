import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password })
    });

    const json = await response.json();

    if (response.ok) {
      localStorage.setItem('token', json.token); // Save token or user email as needed
      navigate("/home");
    } else {
      alert(json.message || "Invalid credentials");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div>
    
      <div className='container'>
        <form className='w-50 m-auto mt-5' onSubmit={handleSubmit}>
          <div className="m-3">
            <label htmlFor="email" className="form-label text-white">Email</label>
            <input type="email" className="form-control" name='email' value={credentials.email} onChange={onChange} required />
          </div>
          <div className="m-3">
            <label htmlFor="password" className="form-label text-white">Password</label>
            <input type="password" className="form-control" name='password' value={credentials.password} onChange={onChange} required />
          </div>
          <button type="submit" className="m-3 btn btn-success text-white">Login</button>
          <Link to="/signup" className="m-3 mx-1 btn btn-danger">Don't have an account?</Link>
        </form>
      </div>
    </div>
  );
}
