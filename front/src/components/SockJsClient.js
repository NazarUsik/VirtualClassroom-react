import React from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs'
import {getCookie} from './utils'


class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.send;
    }

    handleMessageChange(event) {
        this.props.onMessageChange(event.target.value);
    }

    handleMessageSubmit(event) {
        event.preventDefault();
        this.props.onMessageSubmit();
    }

    render() {
        return (
            <div className="ch-block">
                <h1>Classroom logs</h1>

                <ul id="messageArea">
                    {
                        this.props.messages.map((msg, index) => {
                            return (
                                <li>{msg} {index}</li>
                            )
                        })
                    }
                </ul>

                <div id="control-panel">
                    <form onSubmit={this.handleMessageSubmit}>
                        <input type="text" placeholder="Type a message..." onChange={this.handleMessageChange}/>
                        <button>Search</button>
                    </form>
                </div>

            </div>
        );
    }
}

class SockClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            send: false,
            sock: null,
            stomp: null,
            username: ''
        };

        this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onConnected = this.onConnected.bind(this);

        const sock = new SockJS('https://localhost:8080/ws');

        sock.onopen = () => {
            this.state.username = getCookie('student_name');

            console.log('connection to server open');

            this.state.stomp = Stomp.over(sock);
            this.state.stomp.connect({}, this.onConnected, this.onError);

            this.onConnected()
        };

        sock.onmessage = (e) => {
            this.state.messages.push(e.data);
        };

        // this.sock = sock;
        this.state.sock = sock;
    }

    handleMessageChange(message) {
        this.setState({send: false});
        this.state.messages.push(message);
    }

    handleMessageSubmit() {
        this.setState({send: true});
        this.sendMessage()
    }

    onError(error) {
        const textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
        this.state.messages.push(textContent.fontcolor('red'));
    }

    onConnected() {
        const msg = JSON.stringify({sender: this.state.username, type: 'JOIN'});
        // Subscribe to the Public Topic
        this.state.stomp.subscribe('/topic/publicChatRoom', this.onMessageReceived(msg));

        // Tell your username to the server
        this.state.stomp.send("/api/chat.addUser", {}, msg);

    }

    onMessageReceived(msg) {
        const message = JSON.parse(msg.body);

        let messageElement;

        if (message.type === 'JOIN') {
            messageElement = message.sender + ' joined!';
        } else if (message.type === 'LEAVE') {
            messageElement = message.sender + ' left!';
        } else {
            messageElement = message.sender + ":" + message.content;
        }

        this.state.messages.push(messageElement);
    }


    sendMessage() {
        const messageInput = this.state.messages[this.state.messages.length - 1].trim();

        if (messageInput && this.state.stomp) {

            const chatMessage = {
                sender: this.state.username,
                content: messageInput,
                type: 'CHAT'
            };

            this.state.stomp.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        }
    }

    render() {
        return (
            <div className="inner-chat">
                <Chat
                    messages={this.state.messages}
                    onMessageChange={this.handleMessageChange}
                    onMessageSubmit={this.handleMessageSubmit}
                    send={this.state.send}/>
            </div>
        );
    }
}

//
// class SockJsClient extends React.Component {
//
//     constructor(props) {
//         super(props);
//
//         this.state = {
//             message: '',
//             sock: null,
//             stomp: null,
//             username: ''
//         };
//
//         const sock = new SockJS('https://localhost:8080/ws');
//
//         sock.onopen = () => {
//             this.setState({username: getCookie('student_name')});
//
//             console.log('connection to server open');
//
//             this.setState({stomp: Stomp.over(sock)});
//             this.state.stomp.connect({}, onConnected, onError);
//         };
//
//         sock.onmessage = (e) => {
//             this.setState({message: e.data});
//         };
//
//         // this.sock = sock;
//         this.setState({sock: sock})
//     }
//
//
//     onSubmit(event) {
//         event.preventDefault();
//     }
//
//     onChange(event) {
//         this.setState({message: event.target.value});
//     }
//
//     componentDidMount() {
//         this.msg_form.addEventListener('submit', sendMessage, true);
//         this.rh_form.addEventListener('submit', raisedHand, true);
//     }
//
//     render() {
//         return (
//             <div id="chat-container">
//                 <div className="chat-header">
//                     <h3>Classroom Chat</h3>
//                 </div>
//
//                 <hr/>
//
//                 <div id="connecting" ref={(node) => {
//                     this.connecting = node
//                 }}>Connecting...
//                 </div>
//                 <ul id="messageArea" ref={(node) => {
//                     this.msg_arena = node
//                 }}>
//                 </ul>
//                 <div id="control-panel">
//                     <form id="messageForm" name="messageForm" ref={(node) => {
//                         this.msg_form = node
//                     }}>
//                         <div className="input-message">
//                             <input type="text" id="message" ref={(node) => {
//                                 this.msg_input = node
//                             }}
//                                    autoComplete="off" placeholder="Type a message..."/>
//                             <button type="submit">Send</button>
//                         </div>
//                     </form>
//                     <form id="raisedHand" ref={(node) => {
//                         this.rh_form = node
//                     }}>
//                         <button type="submit">raised a hand</button>
//                     </form>
//                 </div>
//             </div>
//         );
//     }
// }
//
// export function raisedHand(event) {
//     const messageContent = 'raised a hand!';
//     if (messageContent && event.state.stomp) {
//         const chatMessage = {
//             sender: event.state.username,
//             content: messageContent,
//             type: 'CHAT'
//         };
//         event.state.stomp.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
//     }
//     event.preventDefault();
// }
//
//
// function
//

export default SockClient;