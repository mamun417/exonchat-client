import { Model } from "@vuex-orm/core";
import Conversation from "src/store/models/Conversation";

export default class ChatDepartment extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = "chat_departments";

    // List of all fields (schema) of the post model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields() {
        return {
            id: this.attr(null),

            tag: this.attr(null),
            description: this.attr(null),
            display_name: this.attr(null),
            active: this.attr(null),

            created_at: this.attr(null),
            updated_at: this.attr(null),

            conversations: this.hasMany(Conversation, "chat_department_id"),
        };
    }
}
