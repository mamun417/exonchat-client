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
                                    <template class="justify-center" v-for="n in 22" :key="n">
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
                                                                                        'lorem ipsum'
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

                    <!--input-->
                    <div
                        style="border-top: 1px solid rgba(0, 0, 0, 0.08)"
                        class="tw-w-full tw-py-2 tw-flex tw-mt-3 tw-bg-white tw-self-end tw-rounded tw-mb-1 tw-shadow-md"
                    >
                        <q-file
                            name="attachment-uploader"
                            ref="attachment_uploader"
                            class="hidden"
                            accept=".jpg, .jpeg, .png, .gif"
                            multiple
                            append
                        />

                        <div class="tw-flex tw-flex-col tw-justify-end">
                            <q-btn flat :color="globalColor" icon="attachment" :class="['tw-px-1']"></q-btn>
                        </div>
                        <div class="tw-flex tw-flex-col tw-justify-end">
                            <ec-emoji :class="['tw-px-1']" :color="globalColor" />
                        </div>

                        <div class="tw-flex-auto tw-px-3">
                            <q-input
                                ref="messageInput"
                                debounce="0"
                                placeholder="Write Message..."
                                :color="globalColor"
                                class="ec-msg-input"
                                :class="[`ec-msg-input-${uid}`]"
                                hide-bottom-space
                                autogrow
                                borderless
                                dense
                            >
                            </q-input>

                            <!--<div v-if="finalAttachments && finalAttachments.length" class="tw-mt-3 tw-mb-2">
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
                                    <q-tooltip class="bg-green" anchor="top middle" self="bottom middle" :offset="[10, 10]"
                                    >{{ attachmentObj.original_name }}
                                    </q-tooltip>
                                </q-avatar>
                            </div>-->
                        </div>
                        <div class="tw-flex tw-flex-col tw-justify-end">
                            <q-btn icon="send" flat :color="globalColor"></q-btn>
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

export default defineComponent({
    name: "DetailsOfflineChatReq",
    components: { EcEmoji, EcAvatar },
    data(): any {
        return {
            cardMaxHeight: "16rem",
        };
    },

    computed: {
        ...mapGetters({ globalBgColor: "setting_ui/globalBgColor", globalColor: "setting_ui/globalColor" }),
    },
});
</script>

<style scoped></style>
