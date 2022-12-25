import { defineStore } from "pinia";
import { io } from "socket.io-client";
// const socket = io("http://localhost:1234");


export const socketIO = defineStore({
    id: "socketIO",
    state: () => ({
        socket: null,
    }),
    actions: {
       
        emit(event, data) {
            console.log("emit", event, data)
            this.socket.emit(event, data)
        },
        init() {
            console.log("init")
            this.socket = io("http://localhost:1234");
        }
    },
    getters: {
    }
});

export default socketIO;