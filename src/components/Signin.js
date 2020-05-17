import React, { Component } from 'react';
import firebase from '../firebase';

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
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((user) => {
                // this.props.history.push('/');
                console.log('Success!');
                console.log(user);
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
                <h1>Login</h1>
                <form onSubmit={this.handleSubmit}>
                    <input name="email" placeholder="Email" value={email} onChange={this.handleInputChange} />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={this.handleInputChange}
                    />
                    <input type="submit" value="Submit" />
                </form>
            </>
        );
    }
}
export default Signin;