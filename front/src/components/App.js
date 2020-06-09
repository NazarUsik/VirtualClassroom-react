import React from 'react';
import ReactDOM from 'react-dom'
import axios from 'axios';
import Table from 'react-bootstrap/lib/Table'
import {Button} from "react-bootstrap";
import '../css/App.css'
import Login from "./login/Login";
import SockJsClient, {raisedHand, sendMessage} from './SockJsClient'

import {onLogout, getCookie} from './utils'

const api = '/api/';

export default class App extends React.Component {

    state = {
        students: [],
        message: [],
        student_id: 0,
        student_name: ''
    };

    constructor(props) {
        super(props);
        this.state = {students: [], message: [], student_id: 0, student_name: ''};
        this.setStudents = this.setStudents.bind(this);
    }

    componentDidMount() {
        this.setCookiesStudent(this);
        this.setStudents(this);
    }

    setCookiesStudent(event) {
        let stud_id = getCookie("student_id");

        if (event.state.student_name == null || event.state.student_id === 0) {

            if (stud_id == null || stud_id.length <= 0) {
                ReactDOM.render(
                    <Login/>, document.getElementById('container')
                );
            } else {
                event.setStudent(event, stud_id);
            }

        }

        if (stud_id != null && stud_id.length > 0) {
            event.setStudent(event, stud_id);

            ReactDOM.render(
                <Button onClick={onLogout} variant="outline-success">Logout</Button>
                , document.getElementById('container')
            );

        }
    }


    setStudents(event) {

        axios.get(api + 'students')
            .then(response => {
                const students = response.data;
                event.setState({students});
            });
    }

    setStudent(event, id) {
        axios.get(api + 'student/' + id)
            .then(response => {
                const student = response.data;
                event.setState({student_id: id, student_name: student.name});
            });
    }

    render() {
        // ReactDOM.render(<SockJsClient/>, document.getElementById('chat'));

        return (
            <div>
                <Table responsive striped bordered hover className={'tab'}>
                    <thead>
                    <tr>
                        <th className='name-col'>Name</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.students.map((student) => {
                            return (
                                <tr>
                                    <td className='name-col'>{student.name}</td>
                                    <td></td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </Table>
                <p style={{display: 'inline'}}>Hello : </p> <p style={{display: 'inline'}}
                                                               id={'username'}>{this.state.student_name}</p>
            </div>
        );
    }
}
