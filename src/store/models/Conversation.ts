import { Model } from "@vuex-orm/core";
import ConversationSession from "src/store/models/ConversationSession";
import Message from "src/store/models/Message";
import ChatDepartment from "src/store/models/ChatDepartment";
import helpers from "boot/helpers/helpers";
import * as _l from "lodash";

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
            closed_by: this.attr(null),
            closed_reason: this.attr(null),

            conversation_rating: this.attr(null),

            chat_department: this.belongsTo(ChatDepartment, "chat_department_id"),

            conversation_sessions: this.hasMany(ConversationSession, "conversation_id"),
            messages: this.hasMany(Message, "conversation_id"),
        };
    }

    // client's conversation + socket_session = postgres_table(conversation_session)
    get clientConversationSession() {
        const conversation: any = this.$query()
            .where("id", this.id)
            .with("conversation_sessions", (conversationSessionQuery) => {
                conversationSessionQuery
                    .whereHas("socket_session", (socketSessionQuery) => {
                        socketSessionQuery.where("user_id", null).where("is_facebook_page", false);
                    })
                    .with("socket_session");
            })
            .first();

        return conversation?.conversation_sessions.length ? conversation.conversation_sessions[0] : {};
    }

    // client's socket_session
    get clientSocketSession() {
        return this.clientConversationSession.socket_session;
    }

    // user to user chat other person
    get userToUserChatOtherPerson() {
        const conversation: any = this.$query()
            .where("id", this.id)
            .where("users_only", true)
            .where("type", "user_to_user_chat")
            .with("conversation_sessions", (conversationSessionQuery) => {
                conversationSessionQuery
                    .where("socket_session_id", (value: any) => value !== helpers.getMySocketSessionId())
                    .with("socket_session.user");
            })
            .first();

        return conversation?.conversation_sessions?.length ? conversation.conversation_sessions[0] : {};
    }

    // connected users including me
    get connectedUsers() {
        const conversation: any = this.$query()
            .where("id", this.id)
            .with("conversation_sessions", (conversationSessionQuery) => {
                conversationSessionQuery
                    .whereHas("socket_session", (socketSessionQuery) => {
                        socketSessionQuery.where("user_id", (value: any) => !!value);
                    })
                    .with("socket_session.user");
            })
            .first();

        return conversation?.conversation_sessions?.length ? conversation.conversation_sessions : [];
    }

    // use only in agent panel
    get myConversationSession() {
        const conversation: any = this.$query()
            .where("id", this.id)
            .with("conversation_sessions", (conversationSessionQuery) => {
                conversationSessionQuery
                    .where("socket_session_id", helpers.getMySocketSessionId())
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
                    .where("socket_session_id", (value: any) => value !== helpers.getMySocketSessionId())
                    .where(
                        "created_at",
                        (value: any) =>
                            new Date(value).getTime() >
                            new Date(this.myConversationSession.last_msg_seen_time).getTime()
                    );
            })
            .first();

        return conversation?.messages.length || 0;
    }

    get getOthersLastMessageSeenTime() {
        const conversation: any = this.$query()
            .where("id", this.id)
            .with("conversation_sessions", (conversationSessionQuery) => {
                conversationSessionQuery
                    .where("socket_session_id", (value: any) => value !== helpers.getMySocketSessionId())
                    .orderBy("last_msg_seen_time", "desc");
            })
            .first();

        return conversation?.conversation_sessions.length
            ? _l.sortBy(conversation.conversation_sessions, "last_msg_seen_time")[0].last_msg_seen_time || 0
            : 0;
    }

    get chatDepartment() {
        const conversation: any = this.$query().where("id", this.id).with("chat_department").first();

        return conversation?.chat_department || {};
    }
}
