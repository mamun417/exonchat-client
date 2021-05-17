import { store } from 'quasar/wrappers';
import { createStore } from 'vuex';

// import example from './module-example'
// import { ExampleStateInterface } from './module-example/state';
import socket from './socket';
import { SocketStateInterface } from './socket/state';

import auth from './auth';
import { AuthStateInterface } from './auth/state';

import ui from './ui';
import { UiStateInterface } from './ui/state';

import chat from './chat';
import { ChatStateInterface } from './chat/state';

import intent from './intent';
import { IntentStateInterface } from './intent/state';

import speech from './speech';
import { SpeechStateInterface } from './speech/state';

import department from './department';
import { DepartmentStateInterface } from './department/state';

import chat_template from './chat-template';
import { ChatTemplateStateInterface } from './chat-template/state';

import client_conversation from './client-conversation';
import { ClientConversationStateInterface } from './client-conversation/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export interface StateInterface {
    // Define your own store structure, using submodules if needed
    // example: ExampleStateInterface;
    // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
    auth: AuthStateInterface;
    socket: SocketStateInterface;
    chat: ChatStateInterface;
    ui: UiStateInterface;
    intent: IntentStateInterface;
    speech: SpeechStateInterface;
    department: DepartmentStateInterface;
    chat_template: ChatTemplateStateInterface;
    client_conversation: ClientConversationStateInterface;
}

export default store(function (/* { ssrContext } */) {
    const Store = createStore<StateInterface>({
        modules: {
            // example
            auth,
            socket,
            ui,
            chat,
            intent,
            speech,
            department,
            chat_template,
            client_conversation,
        },

        // enable strict mode (adds overhead!)
        // for dev mode and --debug builds only
        strict: !!process.env.DEBUGGING,
    });

    return Store;
});
