import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css'

function Auth() {
    const [bgImage, setBgImage] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoginForm, setIsLoginForm] = useState(true);

    const handleChangeTheme = () => {
        setBgImage(!bgImage);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!email) {
            newErrors.email = "Please enter your Email";
            isValid = false;
        }

        if (!password) {
            newErrors.password = "Please enter your Password";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }
    // Email Validate
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const handleEmailChange = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
        if (errors.email && newEmail) {
            const newErrors = { ...errors };
            delete newErrors.email;
            setErrors(newErrors);
        }
        // check email for correctness
        if (newEmail && !isValidEmail(newEmail)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: 'Invalid email. Please enter the correct email.',
            }));
        }
    };
    
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        if (errors.password && event.target.value) {
            const newErrors = { ...errors };
            delete newErrors.password;
            setErrors(newErrors);
        }
    };
    // Firebase Auth
    firebase.initializeApp({
        apiKey: "AIzaSyCDZ4RhqDZH-bNwIw9mtRx-EqfjjUFnnS0",
        authDomain: "kanban-board-8a292.firebaseapp.com",
        projectId: "kanban-board-8a292",
        storageBucket: "kanban-board-8a292.appspot.com",
        messagingSenderId: "820080090059",
        appId: "1:820080090059:web:3a10079efaf5e4cbf2b44e"
    });
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            if (isLoginForm) {
                firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        // Processing of successful authorization
                        const user = userCredential.user;
                        const db = firebase.firestore();
                        db.collection("users").doc(user.uid).get().then((doc) => {
                            if (doc.exists) {
                                const userData = doc.data();
                                console.log("User data:", userData);
                                // navigate("/board", { userData: userData })
                                navigate("/board", { state: { userId: user.uid } }, {state : {userData: userData}})
                            } else {
                                console.log("User data not found");
                                alert('Invalid email or password')
                            }
                        });
                    })
                    .catch((error) => {
                        // Error processing
                        console.error(error);
                    });
        
            } else {
                firebase
                    .auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then(async(userCredential) => {
                        // Processing of successful registration
                        const user = userCredential.user;
                        const db = firebase.firestore();
                        await db.collection("users").doc(user.uid).set({
                            email: email,
                            password: password,
                            columnCount: 1,
                            board_1: [],
                            board_2: [],
                            board_3: [],
                            board_4: [],
                        });
                        navigate("/")
                        window.location.reload()
                    })
                    .catch((error) => {
                        // Error processing
                        console.error(error);
                    });
                
            }
        }
    }
    const handleFormToggle = () => {
        setIsLoginForm(!isLoginForm);
    }


return (
    <div className={bgImage ? ("wrapper light-mode") : ("wrapper dark-mode")}>
        <div className="main-title">
            <Link to="/" className='main-title__link'>
                <img src="https://cdn-icons-png.flaticon.com/512/9177/9177875.png" alt="" /><span>Your Kanban Board</span>
            </Link>
            <button className='main-title__change-bg-btn' onClick={handleChangeTheme}>
                {bgImage ? (<img src="https://cdn-icons-png.flaticon.com/512/3982/3982196.png" alt="" />)
                : (<img src="https://cdn-icons-png.flaticon.com/512/3917/3917817.png" alt="" />)}
            </button>
        </div>
          <div className="container auth-container">
            <div className="auth-body">
                {isLoginForm ? (
                  <form onSubmit={handleSubmit} className="form form-reg">
                      <h2>Sign In</h2>
                  <div className="form-group">
                          <input
                            className="form-input"
                            type="email"
                              value={email}
                              placeholder="Email"
                            onChange={handleEmailChange}
                                />
                        {errors.email && (
                            <span className="label-error">{errors.email}</span>
                        )}
                  </div>
                  <div className="form-group">
                            <input
                                className="form-input"
                                type="password"
                              value={password}
                              placeholder="Password"
                                onChange={handlePasswordChange}
                                />
                            {errors.password && (
                                <span className="label-error">{errors.password}</span>
                            )}
                  </div>
                      <button className="form-button form-button__main" type="submit">Sigh In</button>
                      <div className="form__another">
                        <span>You have no account yet?</span>
                        <button onClick={handleFormToggle} className="form-button form-button__second" type="submit">Sigh Up</button>
                        </div>
                </form>
                ) : (
                  <form onSubmit={handleSubmit} className="form form-reg">
                      <h2>Sign Up</h2>
                  <div className="form-group">
                          <input
                            className="form-input"
                            type="email"
                            value={email}
                            placeholder="Email"
                            onChange={handleEmailChange}
                            />
                            {errors.email && (
                            <span className="label-error">{errors.email}</span>
                        )}
                  </div>
                  <div className="form-group">
                            <input
                                className="form-input"
                                type="password"
                                value={password}
                                placeholder="Password"
                                onChange={handlePasswordChange}
                            />
                            {errors.password && (
                            <span className="label-error">{errors.password}</span>
                        )}
                  </div>
                      <button className="form-button form-button__main" type="submit">Sigh Up</button>
                        <div className="form__another">
                            <span>Already have an account?</span>
                            <button onClick={handleFormToggle} className="form-button form-button__second" type="submit">Sigh In</button>
                        </div>
                  </form>
                )}
            </div>
        </div>
    </div>
  );
}

export default Auth;