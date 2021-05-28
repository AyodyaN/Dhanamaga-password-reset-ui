import headerLogo from './images/danamaga.png';
import './App.css';
import React from 'react';
import axios from 'axios';

function Welcome() {
  return (
    <h2>Please Reset your password here.</h2>
  );
}

function Header() {
  return (
    <div className="header">
      <img src={headerLogo} className="App-logo" alt="logo" />
    </div>
  );
}
    
function ResponsePage(isSucess) {
  return (
    isSucess.status ?
      <>
      <p className="success-message"><h2>Password Changed!</h2>
      <h4>Your password has been changed successfully.</h4></p>
      </>
      :
      <p><h2 className="error-message">Something went wrong! Please send again reset link from dhanamaga app.</h2></p>
  )
}
    
function Footer() {
  return (
  <div className="footer">
    <p className="App-link">Contact Us : <a href="https://dhanamaga.lk/" target="_blank">www.dhanamaga.lk</a></p>
    <p className="App-copyright">© Copyright 2021 Dhanamaga</p>
  </div>
  );
}

function App() {
  let [token, setTokenData] = React.useState('');
  let [password, setPasswordData] = React.useState('');
  let [confirmPassword, setConfirmPasswordData] = React.useState('');
  let [isPasswordMatch, matchPassword] = React.useState(true);
  let [passResponse, matchResponse] = React.useState({});
  let [isResponse, checkResponse] = React.useState(false);
  let [isValidInputField1, validInputField1] = React.useState(false);
  let [isValidInputField2, validInputField2] = React.useState(false);

  React.useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    setTokenData(urlParams.get('token'));
    SetDisable(false, false);
  }, [])

  function SetDisable(value1, value2) {
    if (value1 === true) {
      return false
    } else if (value2 === true) {
      return false
    } else {
      return true
    }
  }

  async function SetShowForm(token, password, confirmPassword) {
    if (!password || !confirmPassword) {
      SetDisable(false, false);
      matchPassword(true);
    } else if (password !== confirmPassword) {
      matchPassword(false);
    } else {  
      const resetObject = {
        code: token,
        password: password,
        passwordConfirmation: confirmPassword,
      }
      
      axios.post(`http://139.59.106.255:1337/auth/reset-password`, resetObject)
      .then(response => {
        matchResponse(response);
        checkResponse(true);
      })
      .catch(error => {
        matchResponse(error);
        checkResponse(true);
      });
    }
  }

  return (
    <div className="App">
      <Header />
      <div className="App-body">
        {isResponse === false ? 
        <>
        <Welcome /> 
        <div className="reset-panel">
          <div className="reset-form">
          <input className="new-password" id="input-1" name="new_password" type="password" placeholder="New Password" onChange={e => {setPasswordData(e.target.value); validInputField1(true)}}/><br></br>
          <input className="new-password" id="input-2" name="new_password" type="password" placeholder="Confirm Password" onChange={e => {setConfirmPasswordData(e.target.value); validInputField2(true)}}/><br></br>
          { isPasswordMatch === false ? <label className="info-label">New password and confirm password do not match!</label> : ''}
          <div><button className="reset-button" disabled={SetDisable(isValidInputField1, isValidInputField2)} onClick={() => SetShowForm(token, password, confirmPassword, matchPassword, matchResponse, checkResponse)}>Reset</button></div>
          </div> 
        </div>
        </>
        : ResponsePage(passResponse)}
      </div>
      <Footer />
    </div>
  );
}

export default App;
