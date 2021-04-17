import React from 'react'
import './Input.css';
const input = ({message,setMessage,sendMessage}) => {
    return (
        <form action="" onSubmit={sendMessage}
        className="form">
                <input type="text" 
                placeholder="Type a message"
                className="input"
                value={message}
                onChange={event=>setMessage(event.target.value)}
                onKeyPress={event=>event.key==='Enter'?sendMessage(event):null}

                />
                <button className="sendButton">Send Message</button>
            </form>
    )
}

export default input
