import { Model } from "@vuex-orm/core";
import User from "src/store/models/User";
import ConversationSession from "src/store/models/ConversationSession";
import Message from "src/store/models/Message";

export default class SocketSession extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = "socket_sessions";

    // List of all fields (schema) of the post model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields() {
        return {
            id: this.attr(null),

            init_name: this.attr(null),
            init_email: this.attr(null),
            init_ip: this.attr(null),
            init_location: this.attr(null),
            init_user_agent: this.attr(null),
            user_info: this.attr(null),
            use_for: this.attr(null),
            use_for_id: this.attr(null),
            user_id: this.attr(null),
            is_facebook_page: this.attr(false),

            conversation_sessions: this.hasMany(ConversationSession, "socket_session_id"),
            user: this.belongsTo(User, "user_id"),
            messages: this.hasMany(Message, "socket_session_id"),

            created_at: this.attr(null),
            updated_at: this.attr(null),
        };
    }
}
