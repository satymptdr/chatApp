import React from 'react'
import Message from '../message/Message'; //importing msg component
import STB from 'react-scroll-to-bottom';
import './Messages.css';
const Messages = ({messages, user_id}) => {
    return (
        <STB className="messages">
            
            {/* {JSON.stringify(messages)} */}
            {/* fecthing msg with loop */}
            {messages.map((message,i)=>(
                <Message key={message._id} message={message}
                current_uid={user_id}/>
            ))} 
        </STB>
    ) 
}

export default Messages
