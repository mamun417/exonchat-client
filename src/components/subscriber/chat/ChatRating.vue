<template>
    <div>
        <q-card>
            <q-card-section>
                <div class="tw-text-xl tw-text-center">Rate Chat</div>
            </q-card-section>

            <q-card-actions align="around">
                <q-btn
                    @click="ratingForm.ratingTempValue = true"
                    color="green"
                    icon="thumb_up"
                    label="Good"
                    :flat="!ratingForm.ratingTempValue"
                />
                <q-btn
                    @click="ratingForm.ratingTempValue = false"
                    color="red"
                    icon="thumb_down"
                    label="Bad"
                    :flat="ratingForm.ratingTempValue"
                />

                <q-input v-model="ratingForm.comment" dense label="Your Comment" color="green" class="tw-py-5">
                    <template v-slot:prepend>
                        <q-icon name="insert_comment" size="xs" color="green" />
                    </template>
                </q-input>

                <q-btn
                    @click="submitRating"
                    :disable="ratingForm.ratingTempValue === ''"
                    dense
                    color="green"
                    class="full-width tw-my-2"
                    no-caps
                >
                    Submit Rate
                </q-btn>
            </q-card-actions>
        </q-card>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ChatRating',
    data(): any {
        return {
            conv_id: '',
            ratingForm: {
                ratingTempValue: '',
                rating: '',
                comment: '',
            },
            ratingFormErrors: {},
        };
    },

    mounted() {
        this.conv_id = JSON.parse(localStorage.getItem('clientInitiateConvInfo') || '').conv_id;
    },

    computed: {
        conversationInfo(): any {
            return this.$store.getters['chat/conversationInfo'](this.conv_id);
        },
    },

    methods: {
        // getConvStateStatusMessage() {
        //     if (this.conversationInfo) {
        //         return `${
        //             this.conversationInfo.socket_session.user
        //                 ? this.conversationInfo.socket_session.user.user_meta.display_name
        //                 : this.conversationInfo.socket_session.init_name
        //         } ${this.conversationInfo.state} ${this.$helpers.fromNowTime(this.conversationInfo.created_at)}`;
        //     }
        // },

        submitRating() {
            this.ratingForm.conversation_id = this.conv_id;
            this.ratingForm.rating = this.ratingForm.ratingTempValue ? 5 : 1;

            window.socketSessionApi
                .post('ratings', this.ratingForm)
                .then((res: any) => {
                    console.log(res.data);
                    this.$emit('ratedByClient', res.data);
                })
                .catch((err: any) => {
                    console.log(err.response.data);
                    this.submitRatingErrorHandle(err);
                });
        },

        submitRatingErrorHandle(err: any) {
            if (this.$_.isObject(err.response.data.message)) {
                this.ratingFormErrors = err.response.data.message;
            } else {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },
    },
});
</script>

<style scoped></style>
