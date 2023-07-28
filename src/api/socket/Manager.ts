import Socket from '@/api/socket/index';

let socket: Socket|null = null;
let channelToken: string|null = null;
export const joinRooms = (token?: string) => {
    if (typeof token === 'undefined' && channelToken) {
        token = channelToken;
    }

    if (token){
        if (socket === null) {
            socket = new Socket(token);
        } else {
            socket.reconnect();
            socket.joinRooms(token);
        }
        channelToken = token;
    }
}

export const disconnect = () => {
    if (socket){
        socket.disconnect();
    }
    channelToken = null;
}