import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../UserContext';
import { Link, useParams } from 'react-router-dom'
import io from 'socket.io-client';
import Messages from './messages/Messages';
import Input from './input/Input';
import './Chat.css';

// import { set } from 'mongoose';
let socket;
const Chat = () => {
    const ENDPT = 'localhost:5000';

    const { user, setUser } = useContext(UserContext);
    let { room_id, room_name } = useParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]); //creating msg at client side
    useEffect(() => {
        socket = io(ENDPT)
        socket.emit('join', { name: user.name, room_id, user_id: user._id })
    }, [])
    useEffect(() => {
        socket.on('message', message => {
            setMessages([...messages, message])
        }) //appending new msg to msg list
    }, [messages])
    useEffect(() => {
        socket.emit('get-messages-history', room_id)
        socket.on('output-messages', messages => {
            setMessages(messages)
        })
    }, [])
    const sendMessage = event => {
        event.preventDefault();
        if (message) {
            console.log(message);
            socket.emit('sendMessage', message, room_id, () => setMessage(''))
        }
    }
    return (
        <div className="outerContainer">
            <div className="container">

                {/* Importing msg component  */}
                <Messages messages={messages} user_id={user._id} />
                <Input
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                />
            </div>
        </div>
    )
}

export default Chat
