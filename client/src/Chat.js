import { useState, useRef } from "react";

function Chat() {
    const [value, setValue] = useState("");
    const [username, setUsername] = useState("");
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const socket = useRef();

    const connect = () => {
        socket.current = new WebSocket("ws://localhost:5000");
        socket.current.onopen = () => {
            setConnected(true);
            const message = {
                event: "connection",
                username,
                id: Date.now(),
            };
            socket.current.send(JSON.stringify(message));
        };
        socket.current.onmessage = ({ data }) => {
            const message = JSON.parse(data);
            setMessages((prev) => [...prev, message]);
        };
        socket.current.onclose = () => {
            console.log("Connection closed.");
        };
        socket.current.onerror = () => {
            console.log("Error occured.");
        };
    };

    const sendMessage = () => {
        const message = {
            event: "message",
            message: value,
            username,
            id: Date.now(),
        };
        socket.current.send(JSON.stringify(message));
        setValue("");
    };

    if (!connected) {
        return (
            <>
                Log in
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                    }}
                >
                    <div>
                        <input
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                            type="text"
                            placeholder="Enter your name"
                        />
                        <button onClick={connect}>Enter chat</button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            WebSocket Chat
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                }}
            >
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    type="text"
                    placeholder="Message"
                />
                <button style={{}} onClick={sendMessage}>
                    Send Message
                </button>
            </div>
            <div>
                {messages.map((message) => {
                    return (
                        <div key={message.id}>
                            {message.event === "connection" ? (
                                <div>User {message.username} connected</div>
                            ) : (
                                <div>
                                    {message.username}: {message.message}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default Chat;
