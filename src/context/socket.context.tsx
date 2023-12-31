import { useContext, createContext, useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config/default';
import {EntryUserInfo} from '../types/EntryUserInfo';
// import EVENTS from "../config/events";

interface Context {
    socket: Socket,
    setUsername: Function
    entryList?: EntryUserInfo[],
    setMessages: Function
}

//SOCKET_URLの中身のところに接続を要求
export const socket = io(SOCKET_URL);

const SocketContext = createContext<Context>({
    socket, 
    setUsername: () => false ,
    setMessages: () => false
});

function SocketProvider(props: any) {
    const [messages, setMessages] = useState([]);

    return (
        <SocketContext.Provider value={{ socket, messages, setMessages }} {...props} />
    );
}

export const useSockets = () => useContext(SocketContext);
export default SocketProvider;
