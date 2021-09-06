import { Model } from "@vuex-orm/core";
import ConversationSession from "src/store/models/ConversationSession";
import Message from "src/store/models/Message";
import ChatDepartment from "src/store/models/ChatDepartment";

export default class Conversation extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = "conversations";

    // List of all fields (schema) of the post model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields() {
        return {
            id: this.attr(null),
            users_only: this.attr(null),
            type: this.attr(null),

            chat_department_id: this.attr(null),

            created_at: this.attr(null),
            closed_at: this.attr(null),

            chat_department: this.belongsTo(ChatDepartment, "chat_department_id"),

            conversation_sessions: this.hasMany(ConversationSession, "conversation_id"),
            messages: this.hasMany(Message, "conversation_id"),
        };
    }
}
