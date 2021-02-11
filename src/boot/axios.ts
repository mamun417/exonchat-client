import { boot } from 'quasar/wrappers';
import io from 'socket.io-client';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        socket: SocketIOClient.Socket;
    }
}

const socket = io('http://localhost:3000', {
    autoConnect: true,
});

export default boot(({ app }) => {
    // for use inside Vue files (Options API) through this.$socket and this.$api

    app.config.globalProperties.$socket = socket;
});

export { socket };
