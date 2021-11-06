<template>
    <div>
        <div class="tw-grid tw-grid-cols-3 tw-h-full tw-overflow-hidden" :class="$helpers.colors().defaultText">
            <div class="tw-col-span-2">
                <div class="tw-flex tw-flex-col tw-h-full">
                    <div class="tw-border-b">
                        <q-card class="tw-shadow-none tw-text-center">
                            <q-card-section class="row no-wrap items-center tw-p-0">
                                <q-item class="tw-w-full">
                                    <q-item-section>
                                        <div class="tw-flex tw-items-center tw-gap-2">
                                            <div class="tw-whitespace-nowrap tw-cursor-pointer">
                                                <div
                                                    class="tw-flex tw-items-center tw-gap-2"
                                                    @click="$router.push({ name: 'offline-chat-req' })"
                                                >
                                                    <q-icon name="keyboard_backspace" size="sm" />
                                                    <div class="tw-text-xs">Back</div>
                                                </div>
                                            </div>
                                            <div class="tw-text-md tw-text-center tw-w-full">
                                                {{ offlineChatRequest?.subject }}
                                            </div>
                                        </div>
                                    </q-item-section>
                                </q-item>
                            </q-card-section>
                        </q-card>
                    </div>

                    <q-scroll-area
                        ref="msgScrollArea"
                        class="tw-px-0 tw-flex-grow tw-text-xs"
                        style="height: 1px"
                        :thumb-style="$helpers.getThumbStyle()"
                        :content-style="{}"
                    >
                        <q-infinite-scroll
                            ref="myInfiniteScrollArea"
                            :scroll-target="$refs.msgScrollArea"
                            :offset="250"
                            :debounce="2000"
                            reverse
                        >
                            <template v-slot:default>
                                <div class="tw-relative tw-z-10">
                                    <template
                                        class="justify-center"
                                        v-for="reply in offlineChatRequestReplies"
                                        :key="reply.id"
                                    >
                                        <!--<pre>{{ reply }}</pre>-->
                                        <div v-if="reply.message_type === 'message'" class="">
                                            <div class="tw-pb-0 tw-my-4">
                                                <q-card
                                                    :class="['tw-shadow-sm']"
                                                    :style="`background-color: ${
                                                        checkOwnMessage(reply) ? '#f0f5f8' : ''
                                                    }`"
                                                >
                                                    <q-card-section class="tw-px-0 tw-flex tw-items-center tw-py-3">
                                                        <div class="tw-flex-shrink-0 tw-flex tw-justify-center tw-w-20">
                                                            <ec-avatar
                                                                :image_src="
                                                                    reply.socket_session?.user?.user_meta?.attachment
                                                                        ?.src
                                                                "
                                                                :name="
                                                                    reply.socket_session?.user?.user_meta?.display_name
                                                                "
                                                                :email="reply.socket_session?.user?.email"
                                                                size="xl"
                                                            />
                                                        </div>
                                                        <!--<pre>{{ pre }}</pre>-->
                                                        <div class="tw-pr-4 tw-text-base tw-w-full">
                                                            <div
                                                                class="tw-flex tw-justify-between tw-items-center tw-mb-2"
                                                            >
                                                                <div class="tw-flex tw-items-center tw-gap-2 tw-mr-4">
                                                                    <div
                                                                        :class="`tw-font-bold tw-capitalize text-${globalColor} tw-text-sm`"
                                                                    >
                                                                        {{
                                                                            reply.socket_session?.user
                                                                                ? reply.socket_session?.user?.user_meta
                                                                                      ?.display_name
                                                                                : offlineChatRequest.name
                                                                        }}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div :class="$helpers.colors().defaultText">
                                                                <div
                                                                    class="tw-flex tw-justify-between tw-gap-2 tw-my-2"
                                                                >
                                                                    <div>
                                                                        <div class="tw-text-sm">
                                                                            <pre
                                                                                v-html="
                                                                                    $helpers.makeCLickAbleLink(
                                                                                        reply.message
                                                                                    )
                                                                                "
                                                                                class="tw-whitespace-normal"
                                                                                style="
                                                                                    font-family: inherit;
                                                                                    word-break: break-word;
                                                                                    white-space: break-spaces;
                                                                                "
                                                                            ></pre>
                                                                        </div>
                                                                    </div>

                                                                    <div class="tw-flex tw-items-center tw-gap-1">
                                                                        <div
                                                                            class="tw-whitespace-nowrap tw-text-xs"
                                                                            :class="$helpers.colors().dateTimeText"
                                                                        >
                                                                            {{
                                                                                $helpers.myDate(
                                                                                    reply.created_at,
                                                                                    "MMM DD, Y h:mm a"
                                                                                )
                                                                            }}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </q-card-section>
                                                </q-card>
                                            </div>
                                        </div>
                                        <div v-else class="tw-py-2 tw-px-4 tw-flex tw-justify-between">
                                            <div>
                                                <b class="tw-capitalize">{{
                                                    reply.socket_session?.user?.user_meta?.display_name
                                                }}</b>
                                                change status
                                                <!--from {{ reply.message.split("_")[1] }}-->
                                                to
                                                {{ reply.message.split("_")[2] }}
                                            </div>
                                            <div
                                                class="tw-whitespace-nowrap tw-text-xs"
                                                :class="$helpers.colors().dateTimeText"
                                            >
                                                {{ $helpers.myDate(reply.created_at, "MMM DD, Y h:mm a") }}
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </template>
                        </q-infinite-scroll>

                        <!--<q-scroll-observer :debounce="200" @scroll="scrollObserverHandle" />-->
                    </q-scroll-area>

                    <div
                        style="border-top: 1px solid rgba(0, 0, 0, 0.08)"
                        class="tw-w-full tw-py-2 tw-mt-3 tw-bg-white tw-self-end tw-rounded tw-mb-1 tw-shadow-md"
                    >
                        <div class="tw-flex-auto tw-px-3">
                            <!-- used keydown for instant catch n prevent -->
                            <q-input
                                type="textarea"
                                ref="messageInput"
                                v-model="msg"
                                debounce="0"
                                placeholder="Write Message..."
                                :color="globalColor"
                                class="ec-msg-input"
                                :class="[`ec-msg-input-${uid}`]"
                                :autofocus="messageInputAutoFocus"
                                hide-bottom-space
                                rows="3"
                                borderless
                            />
                        </div>
                        <div class="tw-flex tw-justify-between">
                            <div class="tw-flex">
                                <ec-emoji @clickEmoji="handleClickEmoji" class="tw-px-2" :color="globalColor" />
                            </div>

                            <div class="tw-flex tw-items-center tw-justify-end tw-w-full">
                                <div class="tw-whitespace-nowrap">Ticket status</div>
                                <q-select
                                    v-model="ticket_status"
                                    style="max-width: 120px"
                                    :options="['Open', 'Pending', 'Solved', 'Spam']"
                                    class="tw-ml-2 tw-w-full"
                                    outlined
                                    dense
                                />
                                <q-btn icon="send" flat :color="globalColor" @click="sendMessage" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="tw-border-l">
                <q-card class="tw-shadow-none tw-text-center tw-border-b">
                    <q-card-section class="row no-wrap items-center tw-p-0">
                        <q-item class="tw-w-full">
                            <q-item-section>
                                <div class="tw-text-md">Details</div>
                            </q-item-section>
                        </q-item>
                    </q-card-section>
                </q-card>

                <q-scroll-area class="fit tw-px-3" :thumb-style="$helpers.getThumbStyle()">
                    <q-list class="tw-px-1 tw-pr-3 tw-py-3" :class="$helpers.colors().defaultText">
                        <q-expansion-item
                            label="TICKET INFO"
                            dense
                            default-opened
                            :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                            class="tw-shadow"
                            expand-icon-class="hidden"
                        >
                            <q-card>
                                <q-card-section class="tw-px-0 tw-py-0 tw-overflow-auto">
                                    <q-list class="tw-break-all">
                                        <q-item class="tw-text-xs tw-py-2" dense>
                                            <q-item-section>
                                                <q-item-label>
                                                    Ticket ID: {{ offlineChatRequest.identifier }}
                                                    <span
                                                        class="text-blue-5 tw-cursor-pointer"
                                                        @click="copyCurrentUrl"
                                                        >{{ urlCopySuccess ? "Copied" : "Copy URL" }}</span
                                                    >
                                                </q-item-label>
                                            </q-item-section>
                                        </q-item>

                                        <q-item class="tw-text-xs tw-py-2" dense>
                                            <q-item-section>
                                                <q-item-label>
                                                    Created At:
                                                    {{
                                                        $helpers.myDate(
                                                            offlineChatRequest?.created_at,
                                                            "MMM DD, Y h:mm a"
                                                        )
                                                    }}
                                                </q-item-label>
                                            </q-item-section>
                                        </q-item>

                                        <q-item
                                            v-if="offlineChatRequestReplies?.length"
                                            class="tw-text-xs tw-py-2"
                                            dense
                                        >
                                            <q-item-section>
                                                <q-item-label>
                                                    Last message:
                                                    {{
                                                        $helpers.myDate(
                                                            offlineChatRequestReplies[
                                                                offlineChatRequestReplies.length - 1
                                                            ].created_at,
                                                            "MMM DD, Y h:mm a"
                                                        )
                                                    }}
                                                </q-item-label>
                                            </q-item-section>
                                        </q-item>

                                        <q-item class="tw-text-xs tw-py-2" dense>
                                            <q-item-section>
                                                <q-item-label>
                                                    Status:
                                                    <q-badge
                                                        :style="{
                                                            backgroundColor: getOfflineChatReqStatusBgColor(
                                                                offlineChatRequest
                                                            ),
                                                        }"
                                                    >
                                                        {{ offlineChatRequest?.status }}
                                                    </q-badge>
                                                </q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <div class="tw-mb-4"></div>

                        <!--<q-expansion-item
                            label="ASSIGNEE"
                            dense
                            default-opened
                            :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                            class="tw-shadow"
                            expand-icon-class="hidden"
                        >
                            <q-card>
                                <q-card-section class="tw-px-0 tw-py-0 tw-overflow-auto">
                                    <q-item>
                                        <q-item-section avatar>
                                            <ec-avatar size="lg"></ec-avatar>
                                        </q-item-section>

                                        <q-item-section class="tw-w-full">
                                            <q-item-label class="tw-flex tw-justify-between">
                                                <div>
                                                    <div class="text-capitalize tw-mr-1 text-weight-bold">
                                                        Abdullah Al Mamun
                                                    </div>
                                                    <div class="tw-text-sm">abdullah@example.com</div>
                                                </div>
                                                &lt;!&ndash;<div class="tw-float-right">
                                                    <div class="text-blue-5 tw-cursor-pointer">Change</div>
                                                </div>&ndash;&gt;
                                            </q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>-->

                        <div class="tw-mb-4"></div>

                        <q-expansion-item
                            label="DEPARTMENT"
                            dense
                            default-opened
                            :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                            class="tw-shadow"
                            expand-icon-class="hidden"
                        >
                            <q-card>
                                <q-card-section class="tw-px-0 tw-py-0 tw-overflow-auto">
                                    <q-item>
                                        <q-item-section>
                                            <div class="tw-flex tw-justify-between">
                                                <div>
                                                    {{ offlineChatRequest.chat_department?.display_name }}
                                                </div>
                                                <!--<div class="tw-float-right">
                                                    <div class="text-blue-5 tw-cursor-pointer">Edit</div>
                                                </div>-->
                                            </div>
                                        </q-item-section>
                                    </q-item>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <div class="tw-mb-4"></div>

                        <q-expansion-item
                            label="REQUESTER"
                            dense
                            default-opened
                            :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                            class="tw-shadow"
                            expand-icon-class="hidden"
                        >
                            <q-card>
                                <q-card-section class="tw-px-0 tw-py-0 tw-overflow-auto">
                                    <q-item>
                                        <q-item-section avatar>
                                            <ec-avatar
                                                :name="offlineChatRequest.name"
                                                :email="offlineChatRequest.email"
                                            />
                                        </q-item-section>

                                        <q-item-section class="tw-w-full">
                                            <q-item-label class="tw-flex tw-justify-between">
                                                <div>
                                                    <div class="text-capitalize tw-mr-1 text-weight-bold">
                                                        {{ offlineChatRequest.name }}
                                                    </div>
                                                    <div class="tw-text-sm">{{ offlineChatRequest.email }}</div>
                                                </div>
                                                <!--<div class="tw-float-right">
                                                    <div class="text-blue-5 tw-cursor-pointer">Change</div>
                                                </div>-->
                                            </q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <div class="tw-mb-4"></div>

                        <q-expansion-item
                            label="RECENT TICKETS"
                            dense
                            default-opened
                            :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                            class="tw-shadow"
                            expand-icon-class="hidden"
                        >
                            <q-card>
                                <q-card-section
                                    class="tw-px-0 tw-py-0 tw-overflow-auto"
                                    :style="{ maxHeight: cardMaxHeight }"
                                >
                                    <q-list
                                        v-if="recentTickets.length"
                                        :class="$helpers.colors().defaultText"
                                        class="tw-text-xs"
                                    >
                                        <q-item
                                            v-for="(recentTicket, key) in recentTickets"
                                            :key="key"
                                            @click="
                                                $router.push({
                                                    name: 'offline-chat-req.view',
                                                    params: { id: recentTicket.id },
                                                })
                                            "
                                            class="tw-flex tw-items-center tw-py-2"
                                            :class="`${index !== 0 ? 'custom-border-top' : ''}`"
                                            clickable
                                            dense
                                        >
                                            <div>
                                                <q-badge
                                                    :style="{
                                                        backgroundColor: getOfflineChatReqStatusBgColor(recentTicket),
                                                    }"
                                                >
                                                    {{ recentTicket?.status }}
                                                </q-badge>

                                                {{ recentTicket.subject }}
                                            </div>
                                        </q-item>
                                    </q-list>
                                    <div v-else class="text-center tw-py-2 text-grey-7">No recent tickets found</div>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>
                    </q-list>
                </q-scroll-area>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import EcAvatar from "components/common/EcAvatar.vue";
import EcEmoji from "components/common/EcEmoji.vue";
import * as _l from "lodash";
import OfflineChatRequest from "src/store/models/offline-chat-req/OfflineChatRequest";
import OfflineChatRequestReply from "src/store/models/offline-chat-req/OfflineChatRequestReply";

export default defineComponent({
    name: "DetailsOfflineChatReq",
    components: { EcEmoji, EcAvatar },
    data(): any {
        return {
            recentTickets: [],
            scrollToBottomInterval: "",
            offline_chat_req_id: this.$route.params["id"],
            msg: "",
            ticket_status: "Pending",
            tempMsgId: "",
            cardMaxHeight: "16rem",
            messageInputAutoFocus: true,
            urlCopySuccess: false,
        };
    },

    computed: {
        ...mapGetters({ globalBgColor: "setting_ui/globalBgColor", globalColor: "setting_ui/globalColor" }),

        offlineChatRequest(): any {
            return OfflineChatRequest.query().where("id", this.offline_chat_req_id).first() || {};
        },

        offlineChatRequestReplies(): any {
            const offlineChatRequest: any = OfflineChatRequest.query()
                .where("id", this.offline_chat_req_id)
                .with("offline_chat_req_replies", (query) => {
                    query.orderBy("created_at");
                })
                .with(["offline_chat_req_replies.socket_session", "offline_chat_req_replies.socket_session.user"])
                .first();

            return offlineChatRequest?.offline_chat_req_replies || [];
        },
    },

    mounted() {
        this.getReplies();
        this.scrollToPosition();
    },

    methods: {
        getReplies() {
            this.$store.dispatch("offline_chat_req/getReplies", { offline_chat_req_id: this.offline_chat_req_id });
        },

        getRecentTickets() {
            window.api
                .get("offline-chat-requests/recent-chat-requests", {
                    params: {
                        client_email: this.offlineChatRequest.email,
                        except_chat_id: this.offline_chat_req_id,
                    },
                })
                .then((res: any) => {
                    this.recentTickets = res.data;
                });
        },

        handleClickEmoji($event: any) {
            this.msg += $event;
            this.$refs.messageInput.focus();
        },

        async sendMessage() {
            this.msg = this.msg.trim();

            // if (!this.msg) return;

            const messageTypes = ["message", "ticket_status"];

            for (const messageType of messageTypes) {
                this.createTempMsgId();

                let dynamicData: any = {};

                if (messageType === "message" && this.msg) {
                    dynamicData = {
                        offline_chat_req_id: this.offline_chat_req_id,
                        message: this.msg,
                        message_type: "message",
                    };
                } else if (messageType === "ticket_status") {
                    dynamicData = {
                        offline_chat_req_id: this.offline_chat_req_id,
                        message: `changeTicketStatusFrom_${
                            this.offlineChatRequest.status
                        }_${this.ticket_status.toLowerCase()}`,
                        message_type: "log",
                        ticket_status: this.ticket_status.toLowerCase(),
                    };
                }

                if (Object.keys(dynamicData).length) {
                    await this.insertMessageToModel(dynamicData);

                    await this.insertMessageToDB(dynamicData, messageType);

                    this.tempMsgId = "";
                }
            }
        },

        insertMessageToModel(dynamicData: any) {
            OfflineChatRequestReply.insert({
                data: {
                    id: this.tempMsgId,
                    socket_session_id: this.$helpers.getMySocketSessionId(),
                    created_at: new Date().toISOString(),
                    ...dynamicData,
                },
            }).then(() => {
                if (dynamicData.message_type === "log") {
                    this.scrollToPosition();
                }
            });
        },

        insertMessageToDB(dynamicData: any, messageType: any) {
            if (messageType === "message") {
                this.msg = "";
            }

            window.api
                .post("offline-chat-requests/reply", { ...dynamicData, temp_msg_id: this.tempMsgId })
                .then((res: any) => {
                    if (res.data.temp_msg_id) {
                        OfflineChatRequestReply.delete(res.data.temp_msg_id);
                    }

                    OfflineChatRequestReply.insert({ data: res.data });
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },

        scrollToPosition(position = 1) {
            const msgScrollArea = this.$refs.msgScrollArea;

            this.scrollToBottomInterval = setInterval(() => {
                console.log("scroll to bottom");
                console.log(this.offlineChatRequestReplies.length);

                if (msgScrollArea && this.offlineChatRequestReplies.length) {
                    msgScrollArea.setScrollPercentage("vertical", position, 100);

                    // setTimeout(() => {
                    clearInterval(this.scrollToBottomInterval);
                    // }, 100);
                }
            }, 300);
        },

        createTempMsgId() {
            if (!this.tempMsgId) {
                this.tempMsgId = `temp_msg_id_${this.$helpers.getTempId()}`;
            }

            return this.tempMsgId;
        },

        checkOwnMessage(message: any) {
            return message.socket_session_id === this.$helpers.getMySocketSessionId();
        },

        getOfflineChatReqStatusBgColor(offlineChatReq: any) {
            return offlineChatReq.status === "open"
                ? "rgb(67, 132, 245)"
                : offlineChatReq.status === "pending"
                ? "rgb(66, 77, 87)"
                : offlineChatReq.status === "solved"
                ? "rgb(44, 176, 106)"
                : "rgb(221, 226, 230)"; // spam
        },

        copyCurrentUrl() {
            const dummy = document.createElement("input"),
                url = window.location.href;

            document.body.appendChild(dummy);
            dummy.value = url;
            dummy.select();
            document.execCommand("copy");
            document.body.removeChild(dummy);

            this.urlCopySuccess = true;

            setTimeout(() => {
                this.urlCopySuccess = false;
            }, 3000);
        },
    },

    watch: {
        offlineChatRequest: {
            handler: function () {
                this.getRecentTickets();
            },
            deep: true,
            immediate: true,
        },
    },
});
</script>

<style scoped></style>
