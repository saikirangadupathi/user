import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { auth, googleProvider, facebookProvider, twitterProvider } from './firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import LocationPicker from './LocationPicker';
import Modal from 'react-modal';
import RecyclingSymbol from './recycling.png'; // Adjust the path accordingly
import BackgroundImage from './greenCyclelogo.png';
import SplashScreenVideo from './recycleScreen.mp4';
import GoogleIcon from './google.png';

Modal.setAppElement('#root'); // Required for accessibility

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupDob, setSignupDob] = useState('');
  const [signupContact, setSignupContact] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000); // Adjust the timeout duration as needed
    return () => clearTimeout(timer);
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://recycle-backend-lflh.onrender.com/api/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid credentials');
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error signing in with provider', error);
    }
  };

  const handleSignup = async () => {
    const age = new Date().getFullYear() - new Date(signupDob).getFullYear();
    // Generate a unique ID based on the current date and time
    const generateUniqueId = () => {
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 10000);
      return `user${timestamp}${randomNum}`;
    };
    const greenPoints = '0';
    const wallet = '0';

    const userId = generateUniqueId();

    const user = {
      id: userId,
      name: signupName,
      age: age.toString(),
      contactNumber: signupContact,
      loginCredentials: [{ username: signupUsername, password: signupPassword }],
      greenpoints: '0',
      wallet: '0'
    };

    try {
      const response = await axios.post('https://recycle-backend-lflh.onrender.com/signup', user);
      if (response.status === 201) {
        alert('Signup successful! Please log in.');
        setIsSignupModalOpen(false);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Signup failed');
    }
  };

  if (isLoading) {
    return (
      <SplashScreen>
        <video autoPlay muted>
          <source src={SplashScreenVideo} type="video/mp4" />
        </video>
      </SplashScreen>
    );
  }

  if (isAuthenticated) {
    return <LocationPicker />;
  }

  return (
    <Container>
      <Form>
        <UsernameInput
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Username"
        />
        <PasswordInput
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
        />
        <LoginButton onClick={handleLogin}>Login</LoginButton>
        <Or>or</Or>
        <SocialLoginButton onClick={() => handleSocialLogin(googleProvider)}>
          <img src= {GoogleIcon} alt="Google" /> Google
        </SocialLoginButton>
        <SignupBar onClick={() => setIsSignupModalOpen(true)}>Sign up</SignupBar>
      </Form>

      <Modal isOpen={isSignupModalOpen} onRequestClose={() => setIsSignupModalOpen(false)} style={customStyles}>
        <ModalContent>
          <h2>Sign Up</h2>
          <SignupInput
            type="text"
            value={signupUsername}
            onChange={(e) => setSignupUsername(e.target.value)}
            placeholder="Username"
          />
          <SignupInput
            type="password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            placeholder="Password"
          />
          <SignupInput
            type="text"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            placeholder="Name"
          />
          <SignupInput
            type="date"
            value={signupDob}
            onChange={(e) => setSignupDob(e.target.value)}
            placeholder="Date of Birth"
          />
          <SignupInput
            type="text"
            value={signupContact}
            onChange={(e) => setSignupContact(e.target.value)}
            placeholder="Contact Number"
          />
          <SignupButton onClick={handleSignup}>Sign Up</SignupButton>
        </ModalContent>
      </Modal>
      <div id="recaptcha-container"></div>
    </Container>
  );
};

export default Login;

const SplashScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #5e348b;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100vh;
  background-image: url(${BackgroundImage});
  background-size: cover;
  background-position: center;
  padding: 20px;
`;

const Form = styled.div`
  background-color: white;
  padding: 40px 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin-bottom: 100px;
`;

const UsernameInput = styled.input`
  width: 100%;
  padding: 15px;
  border-radius: 30px;
  border: none;
  margin-bottom: 20px;
  font-size: 16px;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 15px;
  border-radius: 30px;
  border: none;
  margin-bottom: 20px;
  font-size: 16px;
`;

const LoginButton = styled.button`
  width: 100%;
  background-color: #8ce08a;
  color: black;
  padding: 15px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  margin-bottom: 5px;
  font-size: 16px;
`;

const Or = styled.p`
  color: white;
  margin-bottom: 20px;
  font-size: 16px;
`;

const SocialLoginButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: whitesmoke;
  color: black;
  padding: 15px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 16px;
  img {
    margin-right: 10px;
  }
`;

const SignupBar = styled.p`
  color: black;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  border-radius: 30px;
  background-color: whitesmoke;
  padding: 15px;
  border: 1px  ;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const SignupInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #cccccc;
  font-size: 16px;
`;

const SignupButton = styled.button`
  width: 100%;
  background-color: #32cd32;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '400px',
    borderRadius: '20px',
    padding: '20px',
  },
};
