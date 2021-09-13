import { Model } from "@vuex-orm/core";

export default class MessageAttachment extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = "message_attachments";

    id!: string;
    loaded!: boolean;
    src!: any;

    // List of all fields (schema) of the post model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields() {
        return {
            id: this.attr(null),

            ext: this.attr(null),
            original_name: this.attr(null),
            size: this.attr(null),
            info: this.attr(null),
            loaded: this.attr(false),
            src: this.attr(null),

            created_at: this.attr(null),
            updated_at: this.attr(null),
        };
    }
}
