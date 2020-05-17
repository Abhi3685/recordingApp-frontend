import React, { Component } from 'react';
import { auth, db } from '../firebase';

class Signin extends Component {
    state = {
        email: '',
        password: ''
    };

    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const { email, password } = this.state;
        auth
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
                // this.props.history.push('/');
                console.log('Success!');
                console.log(res);

                let userRef = db.collection('users').doc(res.user.uid);
                userRef.get()
                    .then(doc => {
                        if (!doc.exists) {
                            console.log('No such document!');
                        } else {
                            console.log('Document data:', doc.data());
                        }
                    })
                    .catch(err => {
                        console.log('Error getting document', err);
                    });
            })
            .catch((error) => {
                console.log('Error: ');
                console.log(error);
            });
    };
    render() {
        const { email, password } = this.state;
        return (
            <>
                <nav class="flex items-center justify-between flex-wrap bg-indigo-600 p-6 mb-20">
                    <div class="flex items-center flex-shrink-0 text-white mr-6">
                        <svg class="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" /></svg>
                        <span class="font-semibold text-xl tracking-tight">Tailwind CSS</span>
                    </div>
                    <div class="block lg:hidden">
                        <button class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
                            <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
                        </button>
                    </div>
                    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                        <div class="text-sm lg:flex-grow">
                            <a href="#responsive-header" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                                Docs
                            </a>
                            <a href="#responsive-header" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                                Examples
                            </a>
                        </div>
                        <div>
                            <a href="#" class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Download</a>
                        </div>
                    </div>
                </nav>

                <div className="flex flex-row text-center justify-center">
                    <div className="lg:w-3/12 md:w-5/12">
                        <p className="text-3xl font-bold text-gray-700">Sign in</p>
                        <form className="px-8 py-6" onSubmit={this.handleSubmit}>
                            <div className="mb-4 text-left">
                                <label className="block text-gray-800 tracking-wide mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <input className="appearance-none border-2 border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="email" type="text" placeholder="john.doe@gmail.com" value={email} onChange={this.handleInputChange} />
                            </div>
                            <div className="mb-4 text-left">
                                <label className="block text-gray-800 tracking-wide mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input className="appearance-none border-2 border-gray-400 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none" id="password" type="password" placeholder="•••••••••••••••••••" value={password} onChange={this.handleInputChange} />
                            </div>
                            <button type="submit" className="transition duration-500 ease-in-out text-lg bg-indigo-600 mb-5 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none" type="button">
                                Sign In
                            </button>
                            <button className="w-full font-bold text-sm">
                                <i className="fa fa-lock mr-3"></i>
                                Forgot Password?
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
export default Signin;