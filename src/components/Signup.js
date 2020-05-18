import React, { Component } from 'react';
import { auth, db } from '../firebase';

class Signup extends Component {
    state = {
        email: '',
        password: '',
        fullname: '',
        confirmpassword: ''
    };

    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    randomstr = (length) => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const { email, password, name } = this.state;
        auth
            .createUserWithEmailAndPassword(email, password)
            .then((res) => {
                // this.props.history.push('/');
                console.log('Success!');
                console.log(res);
                return db.collection('users').doc(res.user.uid).set({ name });
            })
            .then(user => {
                console.log('DB ENTRY: ');
                console.log(user);
            })
            .catch((error) => {
                console.log('Error: ');
                console.log(error);
            });
    };
    render() {
        const { email, password, fullname, confirmpassword } = this.state;
        return (
            <>
                <div className="flex flex-row text-center justify-center mt-10 pt-10 md:mt-20 md:pt-0">
                    <div className="w-screen max-w-sm">
                        <p className="text-3xl font-bold text-gray-700">Sign up</p>
                        <form className="px-8 pt-6" onSubmit={this.handleSubmit}>
                            <div className="mb-4 text-left">
                                <label className="block text-gray-800 tracking-wide mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <input className="appearance-none border-2 border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-600 transition duration-300 ease-in-out" id="email" name="email" type="text" placeholder="john.doe@gmail.com" value={email} onChange={this.handleInputChange} autoComplete={this.randomstr(10)} />
                            </div>
                            <div className="mb-4 text-left">
                                <label className="block text-gray-800 tracking-wide mb-2" htmlFor="fullname">
                                    Name
                                </label>
                                <input className="appearance-none border-2 border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-600 transition duration-300 ease-in-out" id="fullname" name="fullname" type="text" placeholder="John Doe" value={fullname} onChange={this.handleInputChange} autoComplete={this.randomstr(10)} />
                            </div>
                            <div className="mb-4 text-left">
                                <label className="block text-gray-800 tracking-wide mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input className="appearance-none border-2 border-gray-400 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:border-indigo-600 transition duration-300 ease-in-out" id="password" name="password" type="password" placeholder="•••••••••••••••••••" value={password} onChange={this.handleInputChange} />
                            </div>
                            <div className="mb-4 text-left">
                                <label className="block text-gray-800 tracking-wide mb-2" htmlFor="confirmpassword">
                                    Confirm Password
                                </label>
                                <input className="appearance-none border-2 border-gray-400 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:border-indigo-600 transition duration-300 ease-in-out" id="confirmpassword" name="confirmpassword" type="password" placeholder="•••••••••••••••••••" value={confirmpassword} onChange={this.handleInputChange} />
                            </div>
                            <button className="transition duration-500 ease-in-out text-lg bg-indigo-600 mb-5 w-full hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none" type="button">
                                Sign Up
                            </button>
                        </form>
                        <p className="text-center border-t pt-3 mx-5 border-gray-400 text-gray-500 text-xs">
                            Copyright &copy;{new Date().getFullYear()}. All rights reserved.
                        </p>
                    </div>
                </div>
            </>
        );
    }
}
export default Signup;