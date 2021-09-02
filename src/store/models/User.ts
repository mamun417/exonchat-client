import { Model } from "@vuex-orm/core";

export default class User extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = "users";

    // List of all fields (schema) of the post model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields() {
        return {
            id: this.attr(null),

            email: this.attr(null),
            active: this.attr(null),
            online_status: this.attr(null),
            init_location: this.attr(null),
            // add relation later
            user_meta: this.attr(null),

            created_at: this.attr(null),
            updated_at: this.attr(null),
        };
    }
}
