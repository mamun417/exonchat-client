import { Model } from "@vuex-orm/core";
import OfflineChatRequestReply from "src/store/models/offline-chat-req/OfflineChatRequestReply";

export default class OfflineChatRequest extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = "offline_chat_requests";

    // List of all fields (schema) of the post model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields() {
        return {
            id: this.attr(null),

            email: this.attr(null),
            identifier: this.attr(null),
            info: this.attr(null),
            message: this.attr(null),
            name: this.attr(null),
            priority: this.attr(null),
            status: this.attr(null),
            subject: this.attr(null),
            tags: this.attr(null),

            created_at: this.attr(null),
            updated_at: this.attr(null),

            assigned_user: this.attr(null),
            chat_department: this.attr(null),
            offline_chat_req_replies: this.hasMany(OfflineChatRequestReply, "offline_chat_req_id"),
        };
    }
}
