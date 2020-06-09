import React from 'react'
import ReactDOM from 'react-dom'
import Form from './Form'

const inputs = [{
    name: "username",
    placeholder: "username",
    type: "text"
}, {
    type: "submit",
    value: "Login",
    className: "btn"
}];

const props = {name: 'loginForm', method: 'POST', action: 'api/login', inputs: inputs};

const params = new URLSearchParams(window.location.search);

ReactDOM.render(<Form {...props} error={params.get('error')}/>, document.getElementById('container'));

class Login extends React.Component {


    render() {
        return (
            <Form {...props} error={params.get('error')}/>
        );
    }
}

export default Login