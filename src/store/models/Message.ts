import { Model } from "@vuex-orm/core";
import Conversation from "src/store/models/Conversation";
import SocketSession from "src/store/models/SocketSession";

export default class Message extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = "messages";

    // List of all fields (schema) of the post model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields() {
        return {
            id: this.attr(null),

            conversation_id: this.attr(null),
            socket_session_id: this.attr(null),

            msg: this.attr(null),
            message_type: this.attr(null),
            sender_type: this.attr(null),
            info: this.attr(null),
            attachments: this.attr([]),

            created_at: this.attr(null),
            updated_at: this.attr(null),

            conversation: this.belongsTo(Conversation, "conversation_id"),
            socket_session: this.belongsTo(SocketSession, "socket_session_id"),
        };
    }
}
