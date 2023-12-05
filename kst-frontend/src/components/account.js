import React from "react";


function Account( { name, surname, college }) {

    return (

        <div className="account-container">
            <p className="account-text"><b>Name: </b> { name }</p>
            <p className="account-text"><b>Surname: </b> { surname }</p>
            <p className="account-text"><b>College: </b> { college }</p>
        </div>


    )

} 

export default Account;