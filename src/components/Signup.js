import React, { Component } from 'react';
import { auth, db } from '../firebase';

class Signup extends Component {
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
            .createUserWithEmailAndPassword(email, password)
            .then((res) => {
                // this.props.history.push('/');
                console.log('Success!');
                console.log(res);
                return db.collection('users').doc(res.user.uid).set({ name: 'myname here' });
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
        const { email, password } = this.state;
        return (
            <>
                <h1>Register</h1>
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
export default Signup;