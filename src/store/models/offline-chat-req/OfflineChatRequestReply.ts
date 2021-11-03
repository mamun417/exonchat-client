import { Model } from "@vuex-orm/core";
import SocketSession from "src/store/models/SocketSession";
import OfflineChatRequest from "src/store/models/offline-chat-req/OfflineChatRequest";

export default class OfflineChatRequestReply extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = "offline_chat_request_replies";

    // List of all fields (schema) of the post model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields() {
        return {
            id: this.attr(null),

            message: this.attr(null),
            message_type: this.attr(null),
            offline_chat_req_id: this.attr(null),
            socket_session_id: this.attr(null),
            subscriber_id: this.attr(null),

            created_at: this.attr(null),
            updated_at: this.attr(null),

            socket_session: this.belongsTo(SocketSession, "socket_session_id"),
            offline_chat_req: this.belongsTo(OfflineChatRequest, "offline_chat_req_id"),
        };
    }
}
