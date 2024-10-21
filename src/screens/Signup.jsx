import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


export default function Signup() {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", geolocation: "" });
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  let navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Prompt user to enter location instead of auto-fetching
    const userLocation = prompt("Please enter your location:");
    if (userLocation) {
      setAddress(userLocation);
      setCredentials({ ...credentials, geolocation: userLocation });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/createuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name: credentials.name, 
          email: credentials.email, 
          password: credentials.password, 
          location: credentials.geolocation 
        })
      });

      const json = await response.json();
      if (json.success) {
        localStorage.setItem('token', json.authToken);
        navigate("/login");
      } else {
        throw new Error(json.error || "Enter Valid Credentials");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ backgroundImage: 'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', backgroundSize: 'cover', height: '100vh' }}>
    
      <div className='container'>
        <form className='w-50 m-auto mt-5 border bg-dark border-success rounded' onSubmit={handleSubmit}>
          <div className="m-2">
            <h1 className='text-center text-light'>Sign Up</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <label htmlFor="name" className="form-label text-light">Name</label>
              <input type="text" className="form-control" id="name" name="name" value={credentials.name} onChange={onChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-light">Email address</label>
              <input type="email" className="form-control" id="email" name="email" value={credentials.email} onChange={onChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label text-light">Password</label>
              <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="geolocation" className="form-label text-light">Location</label>
              <input type="text" className="form-control" id="geolocation" name="geolocation" value={address} readOnly required />
              <button type="button" className="btn btn-success mt-2" onClick={handleClick} disabled={loading}>
                {loading ? 'Getting Location...' : 'Set Location'}
              </button>
            </div>
            <button type="submit" className="btn btn-success">Submit</button>
            <Link to="/login" className="text-light d-block mt-2">Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
