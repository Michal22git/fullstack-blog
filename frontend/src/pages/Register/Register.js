import { useState } from "react"
import { useNavigate } from 'react-router-dom'

function Register() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const RegisterUser = async (e) => {
        e.preventDefault();
    
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
    
        try {
            const response = await fetch('/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });
    
            if (response.ok) {
                alert('Account created successfully!');
                navigate("/login")
            } else {
                const errorData = await response.json();
                if (errorData && errorData.errors) {
                    const errors = errorData.errors;
                    let errorMessage = '';
                    for (const key in errors) {
                        if (errors.hasOwnProperty(key)) {
                            errorMessage += `${key}: ${errors[key].join(', ')}\n`;
                        }
                    }
                    alert(`Registration failed:\n${errorMessage}`);
                } else {
                    alert(`Registration failed: ${errorData.detail || 'Unknown error'}`);
                }
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-form">
          <h2>Register Account</h2>
          <form onSubmit={RegisterUser}>
            <div>
              <input type="text" name="username" placeholder="username" value={formData.username} onChange={handleInputChange} required />
            </div>
            <div>
              <input type="email" name="email" placeholder="email" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div>
              <input type="password" name="password" placeholder="password" value={formData.password} onChange={handleInputChange} required />
            </div>
            <div>
              <input type="password" name="confirmPassword" placeholder="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
            </div>
            <button type="submit">Register</button>
          </form>
        </div>
    );
}

export default Register
