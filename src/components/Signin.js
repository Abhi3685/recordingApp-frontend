import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { useHistory } from 'react-router-dom';

const randomstr = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function Signin() {
    const [state, setState] = useState({
        email: '',
        password: ''
    });
    const { email, password } = state;
    const history = useHistory();

    function handleInputChange(event) {
        var newState = { ...state };
        newState[event.target.name] = event.target.value;
        setState(newState);
    }

    function handleSubmit() {
        const { email, password } = state;
        auth
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
                localStorage.setItem("UUID", res.user.uid);
                let userRef = db.collection('users').doc(res.user.uid);
                return userRef.get();
            })
            .then(doc => {
                if (!doc.exists) console.log('No such document!');
                else history.push('/');
            })
            .catch((error) => {
                alert(error);
            });
    }

    return (
        <div className="flex flex-row text-center justify-center mt-20 pt-10 md:mt-40 md:pt-0">
            <div className="w-screen max-w-sm">
                <p className="text-3xl font-bold text-gray-700">Sign in</p>
                <form className="px-8 pt-6">
                    <div className="mb-4 text-left">
                        <label className="block text-gray-800 tracking-wide mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input className="appearance-none border-2 border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-600 transition duration-300 ease-in-out" id="email" name="email" type="text" placeholder="john.doe@gmail.com" value={email} onChange={handleInputChange} autoComplete={randomstr(10)} />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-gray-800 tracking-wide mb-2" htmlFor="password">
                            Password
                        </label>
                        <input className="appearance-none border-2 border-gray-400 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:border-indigo-600 transition duration-300 ease-in-out" id="password" name="password" type="password" placeholder="•••••••••••••••••••" value={password} onChange={handleInputChange} />
                    </div>
                    <button onClick={handleSubmit} className="transition duration-500 ease-in-out text-lg bg-indigo-600 mb-5 w-full hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none" type="button">
                        Sign In
                    </button>
                </form>
                <button className="w-full font-bold text-sm mb-10 focus:outline-none">
                    <i className="fa fa-lock mr-3"></i>
                    Forgot Password?
                </button>
                <p className="text-center border-t pt-3 mx-5 border-gray-400 text-gray-500 text-xs">
                    Copyright &copy;{new Date().getFullYear()}. All rights reserved.
                </p>
            </div>
        </div>
    );
}
export default Signin;