import * as io from 'socket.io-client';
import variables from "../constants/config";

export const socket = io(variables.socket, { transports: ['websocket'], secure: true, reconnection: true  });