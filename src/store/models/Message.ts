import { Model } from "@vuex-orm/core";
import Conversation from "src/store/models/Conversation";
import SocketSession from "src/store/models/SocketSession";
import ConversationSession from "src/store/models/ConversationSession";
import MessageAttachment from "src/store/models/MessageAttachment";
import helpers from "boot/helpers/helpers";

export default class Message extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = "messages";

    id!: string;
    conversation_id!: string;
    socket_session_id!: string | null;

    // List of all fields (schema) of the post model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields() {
        return {
            id: this.attr(null),

            conversation_id: this.attr(null),
            socket_session_id: this.attr(null),

            msg: this.attr(null),
            extra_msg_data: this.attr(null),
            message_type: this.attr(null),
            sender_type: this.attr(null),
            info: this.attr(null),

            other_service_id: this.attr(null),

            attachment_ids: this.attr([]),

            created_at: this.attr(null),
            updated_at: this.attr(null),

            conversation: this.belongsTo(Conversation, "conversation_id"),
            socket_session: this.belongsTo(SocketSession, "socket_session_id"),

            attachments: this.hasManyBy(MessageAttachment, "attachment_ids"),
        };
    }

    get isClientMsg() {
        const message: any = this.$query()
            .where("id", this.id)
            .whereHas("socket_session", (socketSessionQuery) => {
                socketSessionQuery.where("user_id", null);
            })
            .first();

        return !!message?.id;
    }

    // use it only on agent panel
    get isMyMsg() {
        // const message: any = this.$query()
        //     .where("id", this.id)
        //     .where("socket_session_id", this.$store().getters["auth/profile"]?.socket_session?.id)
        //     .first();
        //
        // return !!message?.id;

        // use upper block if error happens
        return this.socket_session_id === helpers.getMySocketSessionId();
    }

    get isAgentMsg() {
        return !this.isClientMsg;
    }

    get conversationData() {
        return Conversation.find(this.conversation_id);
    }

    // its for additional query or relation manage
    get conversationSessionModel() {
        return ConversationSession.query().where("conversation_id", this.conversation_id);
    }

    // its for only conversationSession data
    get conversationSession() {
        return this.conversationSessionModel.first();
    }
}
