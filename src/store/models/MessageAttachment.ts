import { Model } from "@vuex-orm/core";
import Conversation from "src/store/models/Conversation";
import SocketSession from "src/store/models/SocketSession";
import ConversationSession from "src/store/models/ConversationSession";

export default class MessageAttachment extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = "message_attachments";

    id!: string;

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

            created_at: this.attr(null),
            updated_at: this.attr(null),
        };
    }
}
