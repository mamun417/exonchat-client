import { boot } from "quasar/wrappers";
import io from "socket.io-client";

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        socket: SocketIOClient.Socket;
    }
}

declare global {
    interface Window {
        socketInstance: any;
    }
}

const socket = io(process.env.API || "http://localhost:3000", {
    autoConnect: false,
});

export default boot(({ app }) => {
    // for use inside Vue files (Options API) through this.$socket and this.$api

    app.config.globalProperties.$socket = socket;

    window.socketInstance = socket;
});

export { socket };
