<template>
    <div>
        <div
            class="tw-grid tw-grid-cols-3 tw-gap-2 tw-h-full tw-overflow-hidden"
            :class="$helpers.colors().defaultText"
        >
            <div class="tw-col-span-2">
                <div class="tw-flex tw-flex-col tw-h-full">
                    <div>
                        <q-card class="tw-shadow-sm tw-text-center tw-mb-3">
                            <q-card-section class="row no-wrap items-center tw-p-0">
                                <q-item class="tw-w-full">
                                    <q-item-section>
                                        <div>Ticket Subject</div>
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
                                    <template class="justify-center" v-for="n in offlineChatRequestReplies" :key="n">
                                        <div class="">
                                            <div class="tw-pb-0 tw-my-4">
                                                <q-card
                                                    :class="['tw-shadow-sm']"
                                                    :style="`background-color: ${n % 2 === 0 ? '#f0f5f8' : ''}`"
                                                >
                                                    <q-card-section class="tw-px-0 tw-flex tw-py-3">
                                                        <div class="tw-flex-shrink-0 tw-flex tw-justify-center tw-w-20">
                                                            <ec-avatar size="lg" />
                                                        </div>

                                                        <div class="tw-pr-4 tw-text-base tw-w-full">
                                                            <div
                                                                class="tw-flex tw-justify-between tw-items-center tw-mb-2"
                                                            >
                                                                <div class="tw-flex tw-items-center tw-gap-2 tw-mr-4">
                                                                    <div
                                                                        :class="`tw-font-bold tw-capitalize text-${globalColor} tw-text-sm`"
                                                                    >
                                                                        Display Name
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
                                                                                        n.message
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

                                                                        <!--attachment-->
                                                                        <!--<div
                                                                                            v-if="
                                                                                                msgItem.attachments &&
                                                                                                msgItem.attachments.length
                                                                                            "
                                                                                            class="tw-my-3 tw-flex tw-flex-wrap tw-gap-3"
                                                                                        >
                                                                                            <div
                                                                                                v-for="attachment in msgItem.attachments"
                                                                                                :key="attachment.id"
                                                                                                style="height: 150px; min-width: 150px"
                                                                                                class="tw-shadow-lg tw-rounded tw-cursor-pointer tw-overflow-hidden"
                                                                                            >
                                                                                                <q-img
                                                                                                    height="100%"
                                                                                                    fit="cover"
                                                                                                    spinner-color="green"
                                                                                                    @click="
                                                                                                        attachmentPreview = attachment;
                                                                                                        attachmentPreviewModal = true;
                                                                                                    "
                                                                                                    :src="attachment.src"
                                                                                                >
                                                                                                    <q-tooltip
                                                                                                        :class="globalBgColor"
                                                                                                        anchor="bottom middle"
                                                                                                        :offset="[10, 10]"
                                                                                                        >{{ attachment.original_name }}
                                                                                                    </q-tooltip>

                                                                                                    <q-inner-loading
                                                                                                        :showing="
                                                                                                            attachment.status !== 'done'
                                                                                                        "
                                                                                                        color="white"
                                                                                                    />
                                                                                                </q-img>
                                                                                            </div>
                                                                                        </div>-->
                                                                    </div>

                                                                    <div class="tw-flex tw-items-center tw-gap-1">
                                                                        <div
                                                                            class="tw-whitespace-nowrap tw-text-xs"
                                                                            :class="$helpers.colors().dateTimeText"
                                                                        >
                                                                            Date Time
                                                                            <!--{{ getDateTime(msgItem.created_at) }}-->
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </q-card-section>
                                                </q-card>
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
                        class="tw-w-full tw-py-2 tw-flex tw-mt-3 tw-bg-white tw-self-end tw-rounded tw-mb-1 tw-shadow-md"
                    >
                        <q-file
                            v-model="attachments"
                            name="attachment-uploader"
                            ref="attachment_uploader"
                            class="hidden"
                            accept=".jpg, .jpeg, .png, .gif"
                            :max-files="attachmentConfig.maxFiles"
                            multiple
                            append
                            @update:model-value="attachmentUploaderHandle"
                        />

                        <div class="tw-flex tw-flex-col tw-justify-end">
                            <q-btn
                                flat
                                :color="globalColor"
                                icon="attachment"
                                class="tw-px-2"
                                @click="$refs.attachment_uploader.pickFiles($event)"
                            ></q-btn>
                        </div>
                        <div class="tw-flex tw-flex-col tw-justify-end">
                            <ec-emoji @clickEmoji="handleClickEmoji" class="tw-px-2" :color="globalColor" />
                        </div>

                        <div class="tw-flex-auto tw-px-3">
                            <!-- used keydown for instant catch n prevent -->
                            <q-input
                                ref="messageInput"
                                v-model="msg"
                                debounce="0"
                                placeholder="Write Message..."
                                :color="globalColor"
                                class="ec-msg-input"
                                :class="[`ec-msg-input-${uid}`]"
                                :autofocus="messageInputAutoFocus"
                                @keydown="keyDownHandle"
                                @keyup="keyUpHandle"
                                @paste="imageLoadOnPast"
                                @drop="imageLoadOnPast"
                                hide-bottom-space
                                autogrow
                                borderless
                                dense
                            />

                            <div v-if="finalAttachments && finalAttachments.length" class="tw-mt-3 tw-mb-2">
                                <q-avatar
                                    v-for="(attachmentObj, key) in finalAttachments"
                                    :key="key"
                                    size="80px"
                                    class="each-attachment shadow-3 tw-relative"
                                    :class="{ 'tw-mr-2': key !== finalAttachments.length - 1 }"
                                    rounded
                                    ><img class="cursor-pointer" :src="attachmentObj.src" />
                                    <div
                                        v-show="attachmentObj.status !== 'done'"
                                        class="tw-absolute tw-h-full tw-w-full tw-bg-gray-900 tw-opacity-25"
                                    ></div>
                                    <div
                                        v-show="attachmentObj.status !== 'done'"
                                        class="tw-absolute tw-flex tw-justify-items-center text-green tw-font-bold tw-text-xs tw-text-center tw-cursor-default"
                                    >
                                        {{ attachmentObj.status }}
                                    </div>
                                    <q-badge
                                        class="attachment-remove-btn hidden tw-cursor-pointer"
                                        floating
                                        color="red"
                                        @click="attachmentRemoveHandle(attachmentObj)"
                                    >
                                        <q-icon name="close" />
                                    </q-badge>
                                    <q-tooltip
                                        class="bg-green"
                                        anchor="top middle"
                                        self="bottom middle"
                                        :offset="[10, 10]"
                                        >{{ attachmentObj.original_name }}
                                    </q-tooltip>
                                </q-avatar>
                            </div>
                        </div>
                        <div class="tw-flex tw-flex-col tw-justify-end">
                            <q-btn
                                icon="send"
                                flat
                                :color="globalColor"
                                :disable="getSendBtnStatus"
                                @click="sendMessage"
                            ></q-btn>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <q-card class="tw-shadow-sm tw-text-center">
                    <q-card-section class="row no-wrap items-center tw-p-0">
                        <q-item class="tw-w-full">
                            <q-item-section>
                                <div>Details</div>
                            </q-item-section>
                        </q-item>
                    </q-card-section>
                </q-card>

                <q-scroll-area class="fit" :thumb-style="$helpers.getThumbStyle()">
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
                                        <q-item class="tw-text-xs tw-py-2" clickable dense>
                                            <q-item-section>
                                                <q-item-label>
                                                    Ticket ID: UWRP7
                                                    <span class="text-blue-5">Copy URL</span>
                                                </q-item-label>
                                            </q-item-section>
                                        </q-item>

                                        <q-item class="tw-text-xs tw-py-2" clickable dense>
                                            <q-item-section>
                                                <q-item-label> Created: 10 Oct 2021 </q-item-label>
                                            </q-item-section>
                                        </q-item>

                                        <q-item class="tw-text-xs tw-py-2" clickable dense>
                                            <q-item-section>
                                                <q-item-label> Last message: 10 Oct 2021 </q-item-label>
                                            </q-item-section>
                                        </q-item>

                                        <q-item class="tw-text-xs tw-py-2" clickable dense>
                                            <q-item-section>
                                                <q-item-label> Status: Open </q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <div class="tw-mb-4"></div>

                        <q-expansion-item
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
                                                        Abdullah Al Mammun
                                                    </div>
                                                    <div class="tw-text-sm">abdullah@example.com</div>
                                                </div>
                                                <div class="tw-float-right">
                                                    <div class="text-blue-5 tw-cursor-pointer">Change</div>
                                                </div>
                                            </q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

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
                                                <div>Support</div>
                                                <div class="tw-float-right">
                                                    <div class="text-blue-5 tw-cursor-pointer">Edit</div>
                                                </div>
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
                                            <ec-avatar size="lg"></ec-avatar>
                                        </q-item-section>

                                        <q-item-section class="tw-w-full">
                                            <q-item-label class="tw-flex tw-justify-between">
                                                <div>
                                                    <div class="text-capitalize tw-mr-1 text-weight-bold">
                                                        Abdullah Al Mammun
                                                    </div>
                                                    <div class="tw-text-sm">abdullah@example.com</div>
                                                </div>
                                                <div class="tw-float-right">
                                                    <div class="text-blue-5 tw-cursor-pointer">Change</div>
                                                </div>
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
                                    <q-list :class="$helpers.colors().defaultText" class="tw-text-xs">
                                        <q-item class="tw-flex tw-items-center tw-py-4" clickable dense>
                                            <div><span class="q-badge tw-rounded-full">Open</span> Test ticket</div>
                                        </q-item>
                                    </q-list>
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
import Message from "src/store/models/Message";
import OfflineChatRequest from "src/store/models/offline-chat-req/OfflineChatRequest";
import OfflineChatRequestReply from "src/store/models/offline-chat-req/OfflineChatRequestReply";

export default defineComponent({
    name: "DetailsOfflineChatReq",
    components: { EcEmoji, EcAvatar },
    data(): any {
        return {
            offline_chat_req_id: this.$route.params["id"],
            msg: "",
            tempMsgId: "",
            cardMaxHeight: "16rem",
            attachments: [],
            finalAttachments: [],
            showFileErrorMsg: false,
            showFileErrorMsgInterval: "",
            attachmentConfig: {
                maxFileSize: 1024 * 1024 * 5, // 5 MB
                maxFiles: 5,
            },
            messageInputAutoFocus: true,
        };
    },

    computed: {
        ...mapGetters({ globalBgColor: "setting_ui/globalBgColor", globalColor: "setting_ui/globalColor" }),

        offlineChatRequestReplies() {
            const offlineChatRequest: any = OfflineChatRequest.query()
                .where("id", this.offline_chat_req_id)
                .with("offline_chat_req_replies")
                .first();

            return offlineChatRequest?.offline_chat_req_replies;
        },
    },

    mounted() {
        this.getReplies();
    },

    methods: {
        getReplies() {
            this.$store.dispatch("offline_chat_req/getReplies", { offline_chat_req_id: this.offline_chat_req_id });
        },

        attachmentUploaderHandle(val: any) {
            this.$refs.messageInput.focus();

            const tempMsgId = this.createTempMsgId();

            val.forEach((img: any) => {
                if (!this.attachmentValidation(img)) {
                    return;
                }

                // prevent same image load
                const notPreviousLoaded =
                    _l.findIndex(this.finalAttachments, { original_name: img.name, size: img.size }) === -1;

                if (notPreviousLoaded) {
                    const tempAttachmentId = `temp_attachment_id_${this.$helpers.getTempId()}`;

                    this.pushToFinalAttachment(tempAttachmentId, img);

                    let formData = this.makeAttachmentFormData(img, tempAttachmentId, tempMsgId);

                    this.$socketSessionApi
                        .post("attachments", formData)
                        .then((res: any) => {
                            const attachment: any = res.data.data[0];

                            const finalAttachment = _l.find(this.finalAttachments, {
                                original_name: img.name,
                                size: img.size,
                            });

                            if (finalAttachment) {
                                finalAttachment.status = "done";
                                finalAttachment.attachment_uploaded_id = attachment.attachment_info.id;
                            }

                            this.updateAttachmentModelStatus(attachment, "done");

                            this.sendMessageAfterAllAttachmentUploaded(attachment, tempMsgId);
                        })
                        .catch((e: any) => {
                            console.log(e);
                        });
                } else {
                    // console.log(`file ${img.name} already added`);
                }
            });
        },

        attachmentValidation(img: any) {
            const IMAGE_MIME_REGEX = /^image\/(p?jpeg|gif|png|jpg)$/i;

            const checkImagMaxSize = img.size > this.attachmentConfig.maxFileSize;

            if (!IMAGE_MIME_REGEX.test(img.type) || checkImagMaxSize) {
                clearInterval(this.showFileErrorMsgInterval);

                this.showFileErrorMsg = true;

                this.showFileErrorMsgInterval = setInterval(() => {
                    this.showFileErrorMsg = false;
                }, 10000);

                return false;
            }

            return true;
        },

        makeAttachmentFormData(img: any, tempAttachmentId: any, tempMsgId: any) {
            let formData = new FormData();
            formData.append("attachments", img, img.name);
            formData.append("attachment_temp_id", tempAttachmentId);
            formData.append("msg_temp_id", tempMsgId);

            return formData;
        },

        pushToFinalAttachment(tempAttachmentId: string, img: any) {
            this.finalAttachments.push({
                id: tempAttachmentId,
                temp_id: tempAttachmentId,
                original_name: img.name,
                size: img.size,
                status: "pending",
                src: URL.createObjectURL(img),
                created_at: new Date().getTime(),
                updated_at: new Date().getTime(),
            });
        },

        handleClickEmoji($event: any) {
            this.msg += $event;
            this.$refs.messageInput.focus();
        },

        keyDownHandle(e: any) {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();

                if (!this.chatTemplate) {
                    this.sendMessage();
                }
            }
        },
        keyUpHandle(e: any) {
            // prevent only enter so that before send new line does not show
            if (this.chatPanelType !== "client" && e.key === "/" && !this.beforeKeyUpInputVal) {
                this.chatTemplate = true;
            }

            /// when backspace press this.msg is empty
            if (!this.msg && e.key === "Backspace") {
                this.chatTemplate = false;
            }

            if (this.chatTemplate) {
                if (!["ArrowUp", "ArrowDown", "Enter", "Escape"].includes(e.key)) {
                    this.chatTemplateSearchHandle(e.target.value.slice(1));
                }
            }

            // e.target.value is the previous state
            this.beforeKeyUpInputVal = e.target.value;
        },

        imageLoadOnPast(e: any) {
            const isTextPast = e.clipboardData?.getData("text") || e.dataTransfer?.getData("text");

            // prevent default only for file (past/drop)
            if (!isTextPast) e.preventDefault();

            let files = e.dataTransfer?.files || e.clipboardData?.files || [];

            this.attachmentUploaderHandle([...files]);
        },

        attachmentRemoveHandle(attachmentObj: any) {
            const localCopy = _l.cloneDeep(attachmentObj);

            _l.remove(
                this.finalAttachments,
                (a: any) => a.original_name === attachmentObj.original_name && a.size === attachmentObj.size
            );

            _l.remove(
                this.attachments,
                (a: any) => a.name === attachmentObj.original_name && a.size === attachmentObj.size
            );

            if (localCopy.id) {
                this.$socketSessionApi.delete(`attachments/${localCopy.id}`);
            }
        },

        getSendBtnStatus(): any {
            return !!this.finalAttachments.length && _l.findIndex(this.finalAttachments, (att: any) => !att.id);
        },

        sendMessage(): any {
            this.msg = this.msg.trim();

            if (!this.finalAttachments.length && !this.msg.length) {
                return false;
            }

            this.createTempMsgId();

            console.log(this.msg);

            // const dynamicBody =
            //     this.chatPanelType === "user"
            //         ? { conv_id: this.conv_id, temp_id: this.tempMsgId }
            //         : { temp_id: this.tempMsgId };

            // const dynamicSocket = this.socket || this.$socket;

            // send not typing from here also before send emit so that typing flicker goes
            // dynamicSocket.emit(`ec_is_typing_from_${this.chatPanelType}`, {
            //     conv_id: this.conv_id,
            //     msg: "",
            //     status: "not_typing",
            // });

            OfflineChatRequestReply.insert({
                data: {
                    id: this.tempMsgId,
                    message: this.msg,
                    message_type: "message",
                    offline_chat_req_id: this.offline_chat_req_id,
                    socket_session_id: this.$helpers.getMySocketSessionId(),
                    created_at: new Date().toISOString(),
                },
            }).then(() => {
                this.tempMsgId = null;

                this.scrollToPosition();
            });

            // const pendingEntry = this.finalAttachments.find((attachment: any) => attachment.status !== "done");

            // if (!this.finalAttachments.length || !pendingEntry) {
            //     dynamicSocket.emit(`ec_msg_from_${this.chatPanelType}`, {
            //         ...dynamicBody,
            //         msg: this.msg,
            //         attachments: _l.map(this.finalAttachments, "attachment_uploaded_id"),
            //     });
            // }

            window.api
                .post("offline-chat-requests/reply", {
                    offline_chat_req_id: this.offline_chat_req_id,
                    message: this.msg,
                })
                .then((res: any) => {
                    console.log(res.data);
                })
                .catch((err: any) => {
                    console.log(err);
                });

            this.msg = "";
            this.attachments = [];
            this.finalAttachments = [];
        },

        scrollToPosition(position = 1) {
            const msgScrollArea = this.$refs.msgScrollArea;

            // waiting for dom render
            setTimeout(() => {
                if (msgScrollArea) {
                    // console.log("scroll to ", position);

                    // this.$store.dispatch("chat/updateConvMessagesAutoScrollToBottom", {
                    //     conv_id: this.conv_id,
                    //     auto_scroll_to_bottom: position === 1,
                    //     last_position: 1,
                    // });

                    msgScrollArea.setScrollPercentage("vertical", position, 100);

                    // if (position === 1) {
                    //     clearTimeout(this.updateLastMsgSeenTimeTimer);
                    //
                    //     // check if user on page then update. for now do it
                    //     this.updateLastMsgSeenTimeTimer = setTimeout(() => this.updateLastMsgSeenTime(), 1200);
                    // }
                }
            }, 100);
        },

        createTempMsgId() {
            if (!this.tempMsgId) {
                this.tempMsgId = `temp_msg_id_${this.$helpers.getTempId()}`;
            }

            return this.tempMsgId;
        },
    },
});
</script>

<style scoped></style>
