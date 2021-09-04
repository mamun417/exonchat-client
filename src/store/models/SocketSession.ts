import { Model } from "@vuex-orm/core";
import User from "src/store/models/User";

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
            use_for: this.attr(null),

            user: this.hasOne(User, "user_id"),

            created_at: this.attr(null),
            updated_at: this.attr(null),
        };
    }
}
