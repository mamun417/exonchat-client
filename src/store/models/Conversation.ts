import Fields, { Model } from "@vuex-orm/core";
import ConversationSession from "src/store/models/ConversationSession";
import Message from "src/store/models/Message";
import ChatDepartment from "src/store/models/ChatDepartment";

export default class Conversation extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = "conversations";

    id!: string;

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

    get test() {
        return { a: this };
    }

    get clientConversationSession() {
        const conversation: any = this.$query()
            .where("id", this.id)
            .with("conversation_sessions", (conversationSessionQuery) => {
                conversationSessionQuery
                    .whereHas("socket_session", (socketSessionQuery) => {
                        socketSessionQuery.where("user_id", null);
                    })
                    .with("socket_session");
            })
            .first();

        return conversation?.conversation_sessions.length ? conversation.conversation_sessions[0] : {};
    }

    get myConversationSession() {
        const conversation: any = this.$query()
            .where("id", this.id)
            .with("conversation_sessions", (conversationSessionQuery) => {
                conversationSessionQuery
                    .where("socket_session_id", this.$store().getters["auth/profile"].socket_session.id)
                    .with("socket_session.user");
            })
            .first();

        return conversation?.conversation_sessions.length ? conversation.conversation_sessions[0] : {};
    }

    get myUnseenMessageCount() {
        const conversation: any = this.$query()
            .where("id", this.id)
            .with("messages", (messageQuery) => {
                messageQuery
                    .where("message_type", "message")
                    .where(
                        "socket_session_id",
                        (value: any) => value !== this.$store().getters["auth/profile"].socket_session.id
                    )
                    .where(
                        "created_at",
                        (value: any) => new Date(value).getTime() > this.myConversationSession.last_msg_seen_time
                    )
                    .with("socket_session");
            })
            .first();

        return conversation?.messages.length || 0;
    }
}
