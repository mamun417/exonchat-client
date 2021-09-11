import { store } from "quasar/wrappers";
import { InjectionKey } from "vue";
import { createStore, Store as VuexStore, useStore as vuexUseStore } from "vuex";

// import example from './module-example'
// import { ExampleStateInterface } from './module-example/state';
import socket from "./socket";
import { SocketStateInterface } from "./socket/state";

import auth from "./auth";
import { AuthStateInterface } from "./auth/state";

import setting_ui from "./setting/ui";
import { SettingUiStateInterface } from "./setting/ui/state";

import setting_profile from "./setting/profile";
import { SettingProfileInterface } from "./setting/profile/state";

import setting_app from "./setting/app";
import { SettingAppInterface } from "./setting/app/state";

import setting_chat from "./setting/chat";
import { SettingChatInterface } from "./setting/chat/state";

import chat from "./chat";
import { ChatStateInterface } from "./chat/state";

import intent from "./intent";
import { IntentStateInterface } from "./intent/state";

import speech from "./speech";
import { SpeechStateInterface } from "./speech/state";

import department from "./department";
import { DepartmentStateInterface } from "./department/state";

import chat_template from "./chat-template";
import { ChatTemplateStateInterface } from "./chat-template/state";

import client_conversation from "./client-conversation";
import { ClientConversationStateInterface } from "./client-conversation/state";

import chat_history from "./chat-history";
import { ChatHistoryStateInterface } from "./chat-history/state";

import offline_chat_req from "./offline-chat-req";
import { OfflineChatReqStateInterface } from "./offline-chat-req/state";

import user_invitation from "./user-invitation";
import { UserInvitationStateInterface } from "./user-invitation/state";

import user from "./user";
import { UserStateInterface } from "./user/state";

import visitor from "./visitor";
import { VisitorsStateInterface } from "./visitor/state";

import ticket from "./ticket";
import { TicketStateInterface } from "src/store/ticket/state";

import VuexORM from "@vuex-orm/core";

import Conversation from "./models/Conversation";
import ConversationSession from "src/store/models/ConversationSession";
import SocketSession from "src/store/models/SocketSession";
import Message from "src/store/models/Message";
import User from "src/store/models/User";
import ChatDepartment from "src/store/models/ChatDepartment";
import MessageAttachment from "src/store/models/MessageAttachment";

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
    setting_ui: SettingUiStateInterface;
    setting_profile: SettingProfileInterface;
    setting_app: SettingAppInterface;
    setting_chat: SettingChatInterface;
    intent: IntentStateInterface;
    speech: SpeechStateInterface;
    department: DepartmentStateInterface;
    chat_template: ChatTemplateStateInterface;
    client_conversation: ClientConversationStateInterface;
    chat_history: ChatHistoryStateInterface;
    offline_chat_req: OfflineChatReqStateInterface;
    visitor: VisitorsStateInterface;
    user_invitation: UserInvitationStateInterface;
    user: UserStateInterface;
    ticket: TicketStateInterface;
}

// provide typings for `this.$store`
declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $store: VuexStore<StateInterface>;
    }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<StateInterface>> = Symbol("vuex-key");

// Create a new instance of Database.
const database = new VuexORM.Database();

// Register Models to Database.
database.register(Conversation);
database.register(ConversationSession);
database.register(SocketSession);
database.register(ChatDepartment);
database.register(Message);
database.register(MessageAttachment);
database.register(User);

export default store(function (/* { ssrContext } */) {
    const Store = createStore<StateInterface>({
        modules: {
            // example
            auth,
            socket,

            setting_ui,
            setting_profile,
            setting_app,
            setting_chat,

            chat,
            intent,
            speech,
            department,

            chat_template,
            visitor,

            client_conversation,
            chat_history,
            offline_chat_req,

            user_invitation,
            user,
            ticket,
        },

        plugins: [VuexORM.install(database)],

        // enable strict mode (adds overhead!)
        // for dev mode and --debug builds only
        strict: !!process.env.DEBUGGING,
    });

    return Store;
});

export function useStore() {
    return vuexUseStore(storeKey);
}
