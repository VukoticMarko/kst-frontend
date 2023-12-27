import axios from "axios";
import React, { useEffect, useState } from "react";
import './account.css'

function Account() {

    const accessToken = localStorage.getItem('accessToken')
    const [user, setUser] = useState({})

    useEffect(() => {

        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:3000/auth/me', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            });
            const data = response.data;
            setUser(data)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      }, []);

    return (
        <div>
            <div className="account-container">
                <p className="account-text" style={{marginTop: '80px'}}><b>You are registered as {user.roles}.</b></p>
                <p className="account-text"><b>Name: {user.firstname}</b></p>
                <p className="account-text"><b>Surname: {user.lastname}</b></p>
                <p className="account-text"><b>Email: {user.email}</b></p>
                <p className="account-text"><b>For any change in your personal information, contact service Administrators.</b></p>
            </div>
        </div>

    )

} 

export default Account;