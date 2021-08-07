<template>
    <div>
        <q-card class="tw-shadow-sm">
            <q-card-section class="tw-pb-2">
                <div class="tw-text-base tw-text-center tw-font-medium" :class="$helpers.colors().defaultText">
                    Rate This Chat
                </div>
            </q-card-section>
            <q-card-actions align="around">
                <q-btn
                    @click="ratingForm.ratingTempValue = true"
                    color="green"
                    icon="thumb_up"
                    label="Good"
                    size="sm"
                    :flat="!ratingForm.ratingTempValue"
                />
                <q-btn
                    @click="ratingForm.ratingTempValue = false"
                    color="red"
                    icon="thumb_down"
                    label="Bad"
                    size="sm"
                    :flat="ratingForm.ratingTempValue"
                />

                <q-input
                    v-model="ratingForm.comment"
                    dense
                    label="Your Comment"
                    color="blue-grey"
                    class="tw-py-3 full-width"
                >
                    <template v-slot:prepend>
                        <q-icon name="insert_comment" size="xs" color="blue-grey" />
                    </template>
                </q-input>

                <q-btn
                    @click="submitRating"
                    :disable="ratingForm.ratingTempValue === ''"
                    dense
                    color="blue-grey"
                    class="full-width tw-mt-2"
                    no-caps
                    unelevated
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
    name: 'ChatRatingForm',
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
        setInterval(() => {
            this.$forceUpdate();
        }, 30000);

        this.conv_id = JSON.parse(localStorage.getItem('clientInitiateConvInfo') || '').conv_id;
    },

    computed: {
        conversationInfo(): any {
            return this.$store.getters['chat/conversationInfo'](this.conv_id);
        },

        // geEcClientSocketSesId(): any {
        //     return localStorage.getItem('ec_client_socket_ses_id');
        // },
    },

    methods: {
        submitRating() {
            this.ratingForm.conversation_id = this.conv_id;
            this.ratingForm.rating = this.ratingForm.ratingTempValue ? 5 : 1;

            window.socketSessionApi
                .post('ratings', this.ratingForm)
                .then((res: any) => {
                    console.log(res.data);
                    this.$store.commit('chat/showRatingForm', false);
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
