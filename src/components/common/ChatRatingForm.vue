<template>
    <div>
        <q-card class="tw-shadow-none">
            <q-card-section>
                <div class="tw-text-base tw-text-center tw-font-bold text-dark" :class="$helpers.colors().defaultText">
                    <div v-if="ratingForm.ratingTempValue === ''">Rate This Chat!</div>
                    <div v-else>
                        <div v-if="ratingForm.ratingTempValue === true">Good</div>
                        <div v-if="ratingForm.ratingTempValue === false">Bad</div>
                    </div>
                </div>
                <div class="tw-mt-2 tw-text-center tw-text-sm">
                    Please click on one of the options below to rate your experience.
                </div>
            </q-card-section>

            <q-card-section class="tw-pt-0">
                <div class="tw-flex tw-justify-center tw-gap-2 tw-mb-6 rating-icons">
                    <q-btn
                        @click="ratingForm.ratingTempValue = true"
                        text-color="green-10"
                        :color="ratingForm.ratingTempValue === true ? '' : 'green-1'"
                        class="rating-icon-bg"
                        size="xl"
                        unelevated
                        flat
                    >
                        <q-icon
                            class=""
                            :name="`${ratingForm.ratingTempValue === true ? 'fas' : 'far'} fa-thumbs-up`"
                        ></q-icon>
                    </q-btn>

                    <q-btn
                        @click="ratingForm.ratingTempValue = false"
                        :text-color="[ratingForm.ratingTempValue === false ? 'red-10' : 'green-10']"
                        :icon="`${ratingForm.ratingTempValue === false ? 'fas' : 'far'} fa-thumbs-down`"
                        :color="ratingForm.ratingTempValue === false ? '' : 'green-1'"
                        class="rating-icon-bg rating-icon-thumbs-down"
                        size="xl"
                        unelevated
                    />
                </div>

                <q-input
                    v-model="ratingForm.comment"
                    dense
                    label="Leave a comment"
                    class="full-width tw-mb-4"
                    :color="globalColor"
                    outlined
                >
                </q-input>

                <q-btn
                    @click="submitRating"
                    :disable="ratingForm.ratingTempValue === ''"
                    :color="ratingForm.ratingTempValue === '' ? 'green-1' : globalColor"
                    :text-color="ratingForm.ratingTempValue === '' ? 'green-6' : ''"
                    class="tw-mt-2 full-width"
                    style="padding: 0 20px"
                    no-caps
                    unelevated
                >
                    Submit Rating
                </q-btn>
            </q-card-section>
        </q-card>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "ChatRatingForm",
    data(): any {
        return {
            conv_id: "",
            ratingForm: {
                ratingTempValue: "",
                rating: "",
                comment: "",
            },
            ratingFormErrors: {},
            globalColor: "green-10",
        };
    },

    mounted() {
        setInterval(() => {
            this.$forceUpdate();
        }, 30000);

        this.conv_id = JSON.parse(localStorage.getItem("clientInitiateConvInfo") || "").conv_id;
    },

    computed: {
        conversationInfo(): any {
            return this.$store.getters["chat/conversationInfo"](this.conv_id);
        },

        // geEcClientSocketSesId(): any {
        //     return sessionStorage.getItem('ec_client_socket_ses_id');
        // },
    },

    methods: {
        submitRating() {
            this.ratingForm.conversation_id = this.conv_id;
            this.ratingForm.rating = this.ratingForm.ratingTempValue ? 5 : 1;

            window.socketSessionApi
                .post("ratings", this.ratingForm)
                .then((/*res: any*/) => {
                    // console.log(res.data);
                    this.$store.commit("chat/showRatingForm", false);
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

<style lang="scss">
.rating-icons {
    .q-btn {
        -webkit-text-stroke: 2px white;
    }
}

.rating-icon-bg {
    background-color: rgba(46, 104, 44, 0.06) !important;
}

.rating-icon-thumbs-down:hover {
    background: rgba(178, 0, 0, 0.05) !important;
    color: #b20000 !important;
}

//.q-btn {
//    &:hover {
//        .q-focus-helper {
//            background: unset !important;
//        }
//    }
//}
</style>
