import { Model } from "@vuex-orm/core";

import SocketSession from "src/store/models/SocketSession";

export default class ConversationSession extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = "conversation_sessions";

    // List of all fields (schema) of the post model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields() {
        return {
            id: this.attr(null),

            conversation_id: this.attr(null),
            socket_session_id: this.attr(null),

            socket_session: this.belongsTo(SocketSession, "socket_session_id"),

            draft_message: this.attr(null),
            type: this.attr(null),
            joined_at: this.attr(null),
            left_at: this.attr(null),
            left_reason: this.attr(null),
            closed_reason: this.attr(null),
            last_msg_seen_time: this.attr(null),

            created_at: this.attr(null),
            updated_at: this.attr(null),
        };
    }
}
