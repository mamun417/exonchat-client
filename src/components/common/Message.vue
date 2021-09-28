<template>
    <q-scroll-area
        @scroll="scrollInfo = $event"
        ref="msgScrollArea"
        class="tw-px-0 tw-flex-grow tw-text-xs"
        style="height: 1px"
        :thumb-style="$helpers.getThumbStyle()"
        :content-style="{}"
    >
        <!--        debounce is for load spam-->
        <q-infinite-scroll
            ref="myInfiniteScrollArea"
            :scroll-target="$refs.msgScrollArea"
            @load="handleInfiniteScrollLoad"
            :offset="250"
            :debounce="2000"
            reverse
        >
            <template v-slot:default>
                <!--load prev conv btn-->
                <div
                    v-if="
                        Object.keys(clientPreviousChats[this.conv_id] || []).length &&
                        (!conversationInfo.prev_loaded_ids?.length ||
                            conversationInfo.prev_loaded_ids.length !==
                                Object.keys(clientPreviousChats[this.conv_id]).length) &&
                        !canCallMessageApi &&
                        !gettingNewMessages &&
                        !mini_mode &&
                        isAgentChatPanel &&
                        !conversationData.users_only &&
                        !conversationData.closed_at
                    "
                    class="tw-text-center tw-pr-2 tw-mb-4"
                    :class="{ 'tw-ml-16': mini_mode, 'tw-ml-20': !mini_mode }"
                >
                    <q-btn @click="loadPreviousChat" class="bg-blue-grey tw-text-white" size="sm" no-caps flat>
                        Load Previous Chat
                        <q-icon name="history" class="tw-ml-1" />
                    </q-btn>
                </div>

                <slot name="scroll-area-top-section"></slot>

                <div
                    v-if="gettingNewMessages"
                    class="tw-flex tw-justify-center tw-items-center tw-my-3 tw-gap-2 tw-pr-2"
                    :class="{ 'tw-ml-16': mini_mode, 'tw-ml-20': !mini_mode }"
                >
                    <q-spinner-hourglass size="xs" color="blue-grey" />
                    <div class="tw-text-sm" :class="`text-${globalColor}-6`">Loading History...</div>
                </div>

                <div class="tw-relative tw-z-10">
                    <template v-for="(message, index) in messages" :key="message.id" class="justify-center">
                        <div class="">
                            <div v-if="message.message_type === 'log'" class="tw-flex tw-items-center tw-py-2">
                                <!--dot circle-->
                                <div
                                    v-if="isAgentChatPanel"
                                    class="tw-flex-shrink-0 tw-flex tw-items-center tw-justify-center"
                                    :class="{ 'tw-w-16': mini_mode, 'tw-w-20': !mini_mode }"
                                >
                                    <i
                                        class="fa fa-circle"
                                        :class="`text-${globalColor}-6`"
                                        :style="`font-size: 4px`"
                                        aria-hidden="true"
                                    ></i>
                                </div>

                                <!--state info-->
                                <div
                                    class="tw-flex tw-items-center tw-w-full"
                                    :class="{
                                        'tw-justify-between tw-text-sm': isAgentChatPanel,
                                        'tw-justify-center tw-text-xs': !isAgentChatPanel,
                                        'tw-pr-4': !mini_mode,
                                    }"
                                >
                                    <div class="text-center tw-cursor-default">
                                        <template v-if="message.msg === 'initiate'">
                                            <span
                                                :class="`tw-mr-1 tw-break-none tw-font-medium tw-capitalize text-${globalColor}`"
                                            >
                                                Chat Initiated
                                            </span>
                                        </template>

                                        <template v-else-if="message.msg === 'chat_inactive'">
                                            <span :class="`tw-mr-1 tw-break-none ${$helpers.colors().defaultText}`">
                                                Chat is idle due to inactivity
                                            </span>
                                        </template>

                                        <template v-else-if="message.msg && message.msg.split('_')[0] === 'transfer'">
                                            <span :class="`tw-mr-1 tw-break-none ${$helpers.colors().defaultText}`">
                                                {{ transferMsgMaker(message) }}
                                            </span>
                                        </template>

                                        <template
                                            v-else-if="
                                                message.msg === 'closed' &&
                                                message.conversationData.closed_reason &&
                                                !message.conversationData.closed_by_id
                                            "
                                        >
                                            <span :class="`tw-mr-1 tw-break-none ${$helpers.colors().defaultText}`">
                                                {{ message.conversationData.closed_reason }}
                                            </span>
                                        </template>

                                        <template v-else>
                                            <span
                                                v-if="
                                                    !(
                                                        !isAgentChatPanel &&
                                                        getConvStateStatusMessage(message).state === 'closed'
                                                    )
                                                "
                                                :class="`tw-mr-1 tw-break-none tw-font-medium tw-capitalize text-${globalColor}`"
                                            >
                                                {{ getConvStateStatusMessage(message).name }}
                                            </span>
                                            <span :class="$helpers.colors().defaultText">
                                                {{
                                                    !isAgentChatPanel &&
                                                    getConvStateStatusMessage(message).state === "closed"
                                                        ? `Chat Ended By ${
                                                              getConvStateStatusMessage(message).name
                                                          } at ${getDateTime(message.created_at)}`
                                                        : `${getConvStateStatusMessage(message).state_message} ${
                                                              getConvStateStatusMessage(message).end_message
                                                          }`
                                                }}
                                            </span>
                                        </template>
                                    </div>

                                    <div
                                        v-if="isAgentChatPanel"
                                        :class="{
                                            'tw-text-xxs': mini_mode,
                                            'tw-text-xs': !mini_mode,
                                            [$helpers.colors().dateTimeText]: true,
                                        }"
                                    >
                                        {{ getDateTime(message.created_at) }}
                                    </div>
                                </div>
                            </div>

                            <!--                            speaking with -->
                            <div
                                v-if="
                                    message.message_type === 'log' &&
                                    chatPanelType === 'client' &&
                                    message.socket_session?.user &&
                                    message.msg === 'joined' &&
                                    speakingWithMessage?.id === message.id
                                "
                                class="tw-flex tw-items-center tw-justify-center tw--mt-2"
                            >
                                <div class="tw-text-center tw-mt-4">
                                    <ec-avatar
                                        :image_src="speakingWithMessage.socket_session?.user.user_meta.src"
                                        :name="speakingWithMessage.socket_session?.user.user_meta.display_name"
                                        :email="speakingWithMessage.socket_session?.user.email"
                                    >
                                    </ec-avatar>
                                    <div
                                        class="tw-mt-2 tw-text-sm tw-mb-4 tw-cursor-default"
                                        :class="$helpers.colors().defaultText"
                                    >
                                        You are currently speaking to
                                        {{
                                            $_.upperFirst(
                                                speakingWithMessage.socket_session?.user.user_meta.display_name
                                            )
                                        }}
                                    </div>
                                </div>
                            </div>

                            <!--                            message-->
                            <div v-if="message.message_type === 'message'" class="tw-pb-0 tw-my-4">
                                <q-card
                                    :class="[
                                        mini_mode ? 'tw-shadow-none' : 'tw-shadow-sm',
                                        isAgentChatPanel ? '' : 'ec-widget-message-card-container',
                                    ]"
                                    :style="
                                        checkOwnMessage(message)
                                            ? `background-color: ${
                                                  isAgentChatPanel ? '#f0f5f8' : 'rgba(46, 104, 44, 0.04)'
                                              }`
                                            : ''
                                    "
                                >
                                    <q-card-section class="tw-px-0 tw-flex tw-py-3" :class="{ 'tw-py-2': mini_mode }">
                                        <div
                                            class="tw-flex-shrink-0 tw-flex tw-justify-center"
                                            :class="{ 'tw-w-16': mini_mode, 'tw-w-20': !mini_mode }"
                                        >
                                            <ec-avatar
                                                :size="mini_mode ? 'lg' : 'xl'"
                                                :image_src="
                                                    msgSenderInfo(message).type === 'ai'
                                                        ? 'fas fa-robot'
                                                        : msgSenderInfo(message).src
                                                "
                                                :name="msgSenderInfo(message).img_alt_name"
                                                :is_icon="msgSenderInfo(message).type === 'ai'"
                                                :email="msgSenderInfo(message).email"
                                                class=""
                                            >
                                                <!--<q-tooltip class="">{{ msgSenderInfo(message, index).email }}</q-tooltip>-->
                                            </ec-avatar>
                                        </div>
                                        <div class="tw-pr-4 tw-text-base tw-w-full">
                                            <div
                                                class="tw-flex tw-justify-between tw-items-center"
                                                :class="{ 'tw-mb-2': mini_mode, 'tw-mb-3': !mini_mode }"
                                            >
                                                <div class="tw-flex tw-items-center tw-gap-2 tw-mr-4">
                                                    <div
                                                        :class="`tw-font-bold tw-capitalize text-${globalColor} tw-text-sm`"
                                                    >
                                                        {{ msgSenderInfo(message).display_name }}
                                                    </div>
                                                    <div v-if="!isAgentToAgentConversation && isAgentChatPanel">
                                                        <div
                                                            class="tw-rounded-sm tw-text-xxs tw-px-1 tw-uppercase"
                                                            :class="{
                                                                '': msgSenderInfo(message).type === 'client',
                                                            }"
                                                            style="border: 1px solid"
                                                            :style="{
                                                                backgroundColor:
                                                                    msgSenderInfo(message).type === 'client'
                                                                        ? '#f0f5f8'
                                                                        : '#00568b',
                                                                borderColor:
                                                                    msgSenderInfo(message).type === 'client'
                                                                        ? '#cddee8'
                                                                        : '#003658',
                                                                color:
                                                                    msgSenderInfo(message).type === 'client'
                                                                        ? '#333'
                                                                        : '#fff',
                                                            }"
                                                        >
                                                            {{
                                                                msgSenderInfo(message).type === "agent"
                                                                    ? "staff"
                                                                    : msgSenderInfo(message).type
                                                            }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div :class="$helpers.colors().defaultText">
                                                <div
                                                    v-for="(msgItem, index) of message.messageArray"
                                                    :key="index"
                                                    class="tw-flex tw-justify-between tw-gap-2 tw-my-2"
                                                >
                                                    <div>
                                                        <div class="tw-text-sm">
                                                            <pre
                                                                v-html="$helpers.makeCLickAbleLink(msgItem.msg)"
                                                                class="tw-whitespace-normal"
                                                                style="
                                                                    font-family: inherit;
                                                                    word-break: break-word;
                                                                    white-space: break-spaces;
                                                                "
                                                            ></pre>
                                                        </div>

                                                        <!--attachment-->
                                                        <div
                                                            v-if="msgItem.attachments && msgItem.attachments.length"
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
                                                                        :showing="attachment.status !== 'done'"
                                                                        color="white"
                                                                    />
                                                                </q-img>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="tw-flex tw-items-center tw-gap-1">
                                                        <div
                                                            class="tw-whitespace-nowrap"
                                                            :class="{
                                                                'tw-text-xxs': mini_mode,
                                                                'tw-text-xs': !mini_mode,
                                                                [$helpers.colors().dateTimeText]: true,
                                                            }"
                                                        >
                                                            {{ getDateTime(msgItem.created_at) }}
                                                        </div>

                                                        <q-icon
                                                            v-if="msgItem.isMyMsg"
                                                            :name="messageStatusIconName(msgItem)"
                                                            :color="messageStatusIconColor(msgItem)"
                                                            size="12px"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </q-card-section>
                                </q-card>
                            </div>

                            <!-- keep this block here cz it will show after the last message-->
                            <div
                                v-if="
                                    isAgentChatPanel &&
                                    index !== 0 &&
                                    messages.length !== index + 1 &&
                                    message.conversation_id !== messages[index + 1].conversation_id
                                "
                                class="tw-flex tw-items-center tw-py-4"
                            >
                                <!--dot circle-->
                                <div
                                    class="tw-flex-shrink-0 tw-flex tw-items-center tw-justify-center"
                                    :class="{ 'tw-w-16': mini_mode, 'tw-w-20': !mini_mode }"
                                >
                                    <i
                                        class="fa fa-circle"
                                        :class="`text-${globalColor}-6`"
                                        :style="`font-size: 4px`"
                                        aria-hidden="true"
                                    ></i>
                                </div>

                                <!--state info-->
                                <div
                                    class="tw-flex tw-items-center tw-w-full"
                                    :class="{
                                        'tw-justify-center tw-text-sm': true,
                                        'tw-pr-4': !mini_mode,
                                    }"
                                >
                                    <div class="tw-flex tw-flex-col tw-w-full">
                                        <q-separator class="tw-my-0" />
                                    </div>
                                    <div
                                        :class="`text-center tw-mr-1 tw-break-none tw-capitalize tw-px-2 ${
                                            $helpers.colors().defaultText
                                        }`"
                                    >
                                        <div>
                                            Previous Chat
                                            <span
                                                class="tw-font-medium tw-cursor-pointer"
                                                :class="`text-${globalColor}`"
                                                @click="
                                                    $router.push({
                                                        name: 'chats',
                                                        params: { conv_id: message.conversation_id },
                                                    })
                                                "
                                                >{{ message.conversation_id }}</span
                                            >
                                        </div>
                                    </div>
                                    <div class="tw-flex tw-flex-col tw-w-full">
                                        <q-separator class="tw-my-0" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!--typing state-->
                    <div>
                        <div
                            v-for="(typing, index) in typingState"
                            :key="index"
                            class="tw-flex tw-items-center tw-py-2"
                        >
                            <div
                                class="tw-flex-shrink-0 tw-flex tw-items-center tw-justify-center"
                                :class="{ 'tw-w-16': mini_mode, 'tw-w-20': !mini_mode }"
                            >
                                <q-spinner-dots color="blue-grey-8" size="1.4em" />
                            </div>

                            <div :class="$helpers.colors().defaultText">
                                <div>
                                    <span
                                        :class="`tw-mr-1 tw-break-none tw-font-medium tw-capitalize text-${globalColor}`"
                                    >
                                        {{ msgSenderInfo(typing).display_name }}
                                    </span>
                                    <span>is typing</span>
                                </div>
                                <div :class="$helpers.colors().defaultText">
                                    <div class="tw-text-sm" style="word-break: break-word">
                                        {{ typing.msg }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!--long border up to bottom-->
                    <div
                        v-if="isAgentChatPanel"
                        class="tw-absolute tw-top-0 tw-h-full tw--z-1"
                        :class="{ 'tw-left-10': !mini_mode, 'tw-left-8': mini_mode }"
                    >
                        <div class="tw-flex tw-h-full">
                            <div class="tw-border-l-2 tw-border-gray-300 tw-h-full" style="margin-left: -1px"></div>
                            <!--                                <div class="tw-border-l-2 tw-h-full"></div>-->
                        </div>
                    </div>
                </div>

                <div
                    v-if="conversationData.conversation_rating && chatPanelType === 'user'"
                    class="text-center tw-py-2"
                    :class="$helpers.colors().defaultText"
                >
                    <div :class="[mini_mode ? 'tw-text-xs' : 'tw-text-sm']">
                        <div>
                            Chat rated by {{ conversationData.clientSocketSession.init_name }}
                            {{ getDateTime(conversationData.conversation_rating.created_at) }}
                        </div>
                        <div v-if="conversationData.conversation_rating.comment" style="word-break: break-word">
                            “{{ conversationData.conversation_rating.comment }}”
                        </div>
                        <div class="tw-mt-2">
                            <div>Chat rating</div>
                            <div>
                                <q-btn
                                    size="sm"
                                    :color="conversationData.conversation_rating.rating === 5 ? 'green' : 'red'"
                                    :icon="
                                        conversationData.conversation_rating.rating === 5 ? 'thumb_up' : 'thumb_down'
                                    "
                                    :label="conversationData.conversation_rating.rating === 5 ? 'Good' : 'Bad'"
                                    outline
                                    class="tw-mt-1"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <slot name="scroll-area-last-section"> </slot>
            </template>
        </q-infinite-scroll>

        <q-scroll-observer :debounce="200" @scroll="scrollObserverHandle" />
    </q-scroll-area>

    <div v-if="showFileErrorMsg" class="text-orange-8 tw--mb-2 tw-mt-1 tw-text-xs">
        Valid file type: jpg, jpeg, gif, png and File size max: 5 MB.
    </div>

    <div
        style="border-top: 1px solid rgba(0, 0, 0, 0.08)"
        v-if="showSendMessageInput"
        class="tw-w-full tw-py-2 tw-flex tw-mt-3 tw-bg-white tw-self-end tw-rounded"
        :class="[mini_mode ? 'tw-shadow-smt' : 'tw-shadow-md']"
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
                :color="chatPanelType === 'user' ? globalColor : clientPanelGlobalColor"
                icon="attachment"
                :class="[mini_mode ? 'tw-px-1' : 'tw-px-2']"
                :dense="mini_mode"
                @click="$refs.attachment_uploader.pickFiles($event)"
            ></q-btn>
        </div>
        <div class="tw-flex tw-flex-col tw-justify-end">
            <ec-emoji
                @clickEmoji="handleClickEmoji"
                :class="[mini_mode ? 'tw-px-1' : 'tw-px-2']"
                :dense="mini_mode"
                :mini_box="mini_mode || chatPanelType === 'client'"
                :color="chatPanelType === 'user' ? globalColor : clientPanelGlobalColor"
            />
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
                :class="[`ec-msg-input-${uid}`, mini_mode ? 'ec-mini-mode-msg-input' : '']"
                :autofocus="messageInputAutoFocus"
                @keydown="keyDownHandle"
                @keyup="keyUpHandle"
                @focus="inputFocusHandle"
                @blur="inputBlurHandle"
                @paste="imageLoadOnPast"
                @drop="imageLoadOnPast"
                hide-bottom-space
                autogrow
                borderless
                dense
            >
                <q-menu
                    v-if="chatPanelType !== 'client'"
                    anchor="top left"
                    self="bottom left"
                    class="chat_template_box"
                    style="max-height: 500px; box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05)"
                    :style="{ maxWidth: `${msgInputWidth}px` }"
                    :offset="[15, 0]"
                    :ref="`ec_template_dom_${uid}`"
                    :class="[`ec_template_dom_${uid}`, 'tw-mr-2']"
                    v-model="chatTemplate"
                    @show="chatTemplateShowHandle"
                    @hide="chatTemplateHideHandle"
                    no-parent-event
                    no-focus
                    fit
                >
                    <div
                        class="chat_template_box_header tw-text-xs tw-tracking-wide tw-px-4 tw-py-4 tw-font-medium"
                        :class="[`text-${globalColor}`]"
                    >
                        Predefined Replies
                    </div>
                    <q-separator style="background-color: rgba(0, 87, 143, 0.1)" />
                    <q-list v-if="mappedChatTemplates.length" separator style="min-width: 300px">
                        <q-item
                            v-for="(template, key) in mappedChatTemplates"
                            :key="key"
                            :active="template.is_focused"
                            active-class="chat_template_selected_item"
                            class=""
                            @click="chatTemplateSelectHandle(key)"
                            @keyup.enter.exact="chatTemplateSelectHandle(key)"
                            clickable
                        >
                            <q-item-section>
                                <q-item-label>
                                    <div class="tw-flex tw-items-center tw-gap-3">
                                        <div class="tw-text-sm tw-font-medium tw-whitespace-nowrap">
                                            /{{ template.tag }}
                                        </div>
                                        <div
                                            class="tw-text-xs tw-overflow-hidden tw-whitespace-nowrap tw-overflow-ellipsis"
                                            :class="$helpers.colors().defaultText"
                                        >
                                            {{ template.content }}
                                        </div>
                                    </div>
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                    <div v-else class="tw-p-4 text-orange">No Result Found!</div>
                </q-menu>

                <q-resize-observer
                    ref="messageInputResizeObserver"
                    :debounce="200"
                    @resize="messageInputResizeObserver"
                />
            </q-input>

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
                    <q-tooltip class="bg-green" anchor="top middle" self="bottom middle" :offset="[10, 10]"
                        >{{ attachmentObj.original_name }}
                    </q-tooltip>
                </q-avatar>
            </div>
        </div>
        <div class="tw-flex tw-flex-col tw-justify-end">
            <q-btn
                icon="send"
                flat
                :color="chatPanelType === 'user' ? globalColor : clientPanelGlobalColor"
                :dense="mini_mode"
                :disable="getSendBtnStatus"
                @click="sendMessage"
            ></q-btn>
        </div>
    </div>

    <div
        v-if="chatPanelType === 'user' && !showSendMessageInput && conversationData.id && !mini_mode"
        class="text-center tw-pt-3"
    >
        <div class="tw-flex tw-justify-center tw-gap-2">
            <q-btn
                @click="acceptChat(conversationData.id)"
                v-if="
                    !conversationData.users_only &&
                    !conversationData.closed_at &&
                    (!conversationStatusForMe || conversationStatusForMe !== 'joined')
                "
                :label="conversationData.connectedUsers.length ? 'Join Chat' : 'Accept Chat'"
                :color="globalColor"
                unelevated
                no-caps
            />

            <send-transcript
                v-if="canSendTranscript && (conversationConnectedUsers.length || conversationData.closed_at)"
                :conv_id="conv_id"
            />

            <q-btn
                @click="
                    $router.push({
                        name: 'chat-interaction',
                    })
                "
                label="Close Panel"
                :color="globalColor"
                unelevated
                no-caps
            />
        </div>
    </div>

    <attachment-view-modal
        v-if="attachmentPreviewModal"
        :attachment-preview="attachmentPreview"
        @hide="attachmentPreviewModal = false"
    />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import Conversation from "src/store/models/Conversation";

import * as _l from "lodash";
import moment from "moment";
import EcAvatar from "./EcAvatar.vue";
import EcEmoji from "components/common/EcEmoji.vue";
import SendTranscript from "components/common/SendTranscript.vue";
import SocketSession from "src/store/models/SocketSession";
import Message from "src/store/models/Message";
import AttachmentViewModal from "components/subscriber/message/attachment/AttachmentViewModal.vue";
import MessageAttachment from "src/store/models/MessageAttachment";
import ConversationSession from "src/store/models/ConversationSession";
import { date } from "quasar";

export default defineComponent({
    name: "Message",
    components: { AttachmentViewModal, SendTranscript, EcEmoji, EcAvatar },
    props: {
        conv_id: {
            type: String,
        },
        ses_id: {
            type: String,
        },

        socket: {
            type: Object,
            default: null,
        },
        mini_mode: {
            type: Boolean,
            default: false,
        },
    },

    setup() {
        //     const messageInputAutoFocus = inject('messageInputAutoFocus');
        const messageInputAutoFocus = true;

        return {
            messageInputAutoFocus,
        };
    },

    data(): any {
        return {
            ecGetClientSesIdStatusInterval: "",
            chatActiveStatus: true,
            uid: new Date().getTime().toString(), // user convid insted. not from url

            firstTimeMessageLoaded: false,
            gettingNewMessages: false, // we could also use conv's loading state but it's will be a disaster here
            newMessagesMayBeLoaded: false,
            canCallMessageApi: true,
            canSendNextMsg: true,

            convId: "",
            confirm: false,
            convState: "",

            msg: "",
            tempMsgId: "",
            typingInstance: null,
            msgInputFocused: false,
            gotoBottomBtnShow: false,
            typingHandler: {
                typing: false,
            },
            notTypingEmitted: {},
            msgInputWidth: 50,

            attachments: [],
            finalAttachments: [],

            attachmentPreview: null,
            attachmentPreviewModal: false,

            chatTemplate: false,
            chatTemplateLoading: true,
            chatTemplates: [],
            chatTemplateInputVal: "",
            beforeKeyUpInputVal: "",
            getChatTemplateTimer: "",

            usersAvatarLoading: false,

            scrollInfo: {},
            scrollCheckInterval: null,
            updateLastMsgSeenTimeTimer: null,

            scrollbarCanHandleScrollEvent: false,

            lastTopVerticalPosition: 0,

            timeToShowSpeakingInfo: false,
            clientPanelGlobalColor: "green-10",
            showFileErrorMsg: false,
            showFileErrorMsgInterval: "",
            attachmentConfig: {
                maxFileSize: 1024 * 1024 * 5, // 5 MB
                maxFiles: 5,
            },
            forceUpdateInterval: "",
        };
    },

    mounted() {
        this.getDraft();

        this.forceUpdateInterval = setInterval(() => {
            this.$forceUpdate();
        }, 30000);

        this.fireSocketListeners();
        this.emitSocketEvents();

        this.$emitter.on("message_inserted_or_updated", (res: any) => {
            if (res.conv_id === this.conv_id) {
                setTimeout(() => this.scrollToPosition(), 300);
            }
        });

        window.onbeforeunload = (e: any) => {
            this.saveDraft();
        };
    },

    beforeUnmount() {
        clearInterval(this.ecGetClientSesIdStatusInterval);
        clearInterval(this.forceUpdateInterval);

        if (this.chatPanelType === "user" && !this.conversationData.users_only) {
            this.$socket.removeEventListener("ec_get_client_ses_id_status_res");
        }

        this.$emitter.off(`new_message_from_client_${this.conv_id}`);
        this.$emitter.off(`new_message_from_user_${this.conv_id}`);
    },

    computed: {
        ...mapGetters({
            globalBgColor: "setting_ui/globalBgColor",
            globalColor: "setting_ui/globalColor",
            profile: "auth/profile",
            clientPreviousChats: "chat/previousConversations",
        }),

        chatPanelType(): any {
            return this.$route.name === "client-web-chat" ? "client" : "user";
        },

        conversationModel(): any {
            return Conversation.query().where("id", this.conv_id);
        },

        conversationData(): any {
            // if || {} empty object raise error for accessing models getter then manage null
            return this.conversationModel.first() || {};
        },

        conversationInfo(): any {
            return this.$store.getters["chat/conversationInfo"](this.conv_id);
        },

        conversationStatusForMe(): any {
            return this.$store.getters["chat/conversationStatusForMe"](this.conv_id, this.ses_id);
        },

        myConversationSession(): any {
            return this.conversationData.myConversationSession;
        },

        othersLastMessageSeenTime(): any {
            return new Date(this.conversationData.getOthersLastMessageSeenTime).getTime();
        },

        messages(): any {
            // note: next work
            // loop with the current & prev_loaded ids or with the orm

            const messages: Array<any> = [];

            const conversationIds: any = this.conversationInfo.prev_loaded_ids
                ? _l.cloneDeep(this.conversationInfo.prev_loaded_ids)
                : [];

            conversationIds.push(this.conv_id);

            conversationIds.forEach((conv: any) => {
                const tempConv: any = Conversation.query()
                    .where("id", conv)
                    .with("messages", (messageQuery: any) => {
                        messageQuery.with(["socket_session.user.user_meta", "attachments"]).orderBy("created_at");
                    })
                    .first();

                if (tempConv?.messages.length) {
                    for (const msgObj of tempConv.messages) {
                        const tempMsgObj: any = msgObj;

                        if (
                            tempMsgObj.message_type === "log" &&
                            tempMsgObj.msg === "initiate" &&
                            !this.isAgentChatPanel
                        ) {
                            continue;
                        }

                        if (
                            messages.length &&
                            tempMsgObj.message_type === "message" &&
                            _l.last(messages).message_type === "message" &&
                            _l.last(messages).socket_session_id === tempMsgObj.socket_session_id
                        ) {
                            const lastTempMessage = _l.last(messages);

                            lastTempMessage.messageArray.push(tempMsgObj);
                        } else {
                            tempMsgObj.messageArray = [tempMsgObj];

                            messages.push(tempMsgObj);
                        }
                    }
                }
            });

            // first sort_by conversation id so that partial same time conversations msg can't overlap with each other.
            // its nearly not possible cz client normally wont chat from different browser at the same time
            // but what if client email temp emails and they are same
            return _l.sortBy(messages, [
                (msg: any) => msg.conversation_id,
                (msg: any) => moment(msg.created_at).format("x"),
            ]);
        },

        typingState(): any {
            const states = this.$store.getters["chat/typingState"](this.conv_id);

            return states.filter((state: any) => state.status === "typing");
        },

        getSendBtnStatus(): any {
            return !!this.finalAttachments.length && _l.findIndex(this.finalAttachments, (att: any) => !att.id);
        },

        isAgentToAgentConversation(): any {
            return this.conversationData.users_only;
        },

        showSendMessageInput(): any {
            return this.conversationStatusForMe === "joined" || this.isAgentToAgentConversation;
        },

        mappedChatTemplates(): any {
            const mappedChatTemplates = this.chatTemplates.map((chatTemplate: any, index: any) => {
                // set content
                if (chatTemplate.intent) {
                    chatTemplate.content =
                        chatTemplate.intent.intent_action.type === "static"
                            ? chatTemplate.intent.intent_action.content
                            : "";

                    chatTemplate.loading = chatTemplate.intent.intent_action.type !== "static";
                }

                chatTemplate.is_focused = index === 0;

                return chatTemplate;
            });

            if (!mappedChatTemplates.length) {
                return [
                    // {
                    //     tag: "No Result! Append in message box",
                    //     content: `/${this.chatTemplateInputVal}`,
                    //     is_focused: true,
                    // },
                ];
            }

            return mappedChatTemplates;
        },

        // return user who first join the conversation
        speakingWithMessage(): any {
            if (this.conversationData.id) {
                return _l.find(
                    this.messages || [],
                    (msg: any) => msg.message_type === "log" && msg.msg === "joined" && msg.socket_session.user
                );
            }

            return {};
        },

        ecGetClientSesIdStatusWatch(): any {
            return [this.conv_id, this.conversationData.clientConversationSession];
        },

        canGoToBottom(): any {
            return (
                !this.conversationInfo.hasOwnProperty("scroll_info") ||
                (this.conversationInfo.scroll_info?.last_position === 1 &&
                    this.conversationInfo.scroll_info?.auto_scroll_to_bottom)
            );
        },

        isAgentChatPanel(): any {
            return this.chatPanelType === "user";
        },

        conversationConnectedUsers(): any {
            return this.$store.getters["chat/conversationConnectedUsers"](this.conv_id);
        },

        canSendTranscript(): any {
            const sortedAgents = _l.sortBy(
                this.conversationConnectedUsers.filter(
                    (conversationConnectedUser: any) => !conversationConnectedUser.left_at
                ),
                (convSes: any) => moment(convSes.joined_at).format("x")
            );

            return !!(sortedAgents.length && sortedAgents[0].socket_session_id === this.profile?.socket_session?.id);
        },
    },

    methods: {
        scrollObserverHandle(info: any) {
            // go up, assume that scroll happened manually so update

            // check this.scrollInfo.verticalPercentage !== 1 cz up fires even if vertical position is 1
            // delta is for move from bottom height. sometime scroll moves by typing or multiple msg
            if (
                info.direction === "up" &&
                this.scrollInfo.verticalPercentage !== 1 &&
                (!info.directionChanged || (info.directionChanged && info.delta.top < -30))
            ) {
                this.$store.dispatch("chat/updateConvMessagesAutoScrollToBottom", {
                    conv_id: this.conv_id,
                    auto_scroll_to_bottom: false,
                    last_position: this.scrollInfo.verticalPercentage,
                });
            }

            // later percentage check by other parameters also for fine tune
            if (info.direction === "up" && this.scrollInfo.verticalPercentage < 0.1) {
                if (this.canCallMessageApi && !this.gettingNewMessages && this.$refs.myInfiniteScrollArea) {
                    this.scrollInfo = this.$refs.msgScrollArea.getScroll(); // it will update scroll info so without scroll no load new data

                    this.$refs.myInfiniteScrollArea.resume();
                    this.$refs.myInfiniteScrollArea.trigger();
                }
            }

            if (info.direction === "down" && this.scrollInfo.verticalPercentage === 1) {
                this.scrollToPosition(1, true); // by passing true no need to update scroll position to state
            }
        },
        messageInputResizeObserver(size: any) {
            this.msgInputWidth = size.width;
        },

        messageStatusIconName(msg: any) {
            if (msg.id.includes("temp_msg_id")) {
                return "schedule";
            }

            return "done_all";
        },

        messageStatusIconColor(msg: any) {
            if (this.othersLastMessageSeenTime > new Date(msg.created_at).getTime()) {
                return "green-6";
            }

            return "grey-6";
        },

        emitSocketEvents() {
            //
        },

        fireSocketListeners() {
            if (this.chatPanelType === "user" && !this.conversationData.users_only) {
                this.$socket.on("ec_get_client_ses_id_status_res", (res: any) => {
                    // custom event fire for messageTopSection
                    this.$emitter.emit("ec_get_client_ses_id_status_res", res);

                    // console.log('from ec_get_client_ses_id_status_res', res);
                });
            }

            this.$emitter.on(`new_message_from_client_${this.conv_id}`, () => {
                if (this.chatPanelType === "user" && !this.conversationData.users_only) {
                    this.emitEcGetClientSesIdStatus();
                }

                // this.scrollToPosition();
            });

            this.$emitter.on(`new_message_from_user_${this.conv_id}`, () => {
                // this.scrollToPosition();
            });
        },

        ecGetClientSesIdStatusEvent() {
            if (this.chatPanelType === "user" && !this.conversationData.users_only) {
                this.emitEcGetClientSesIdStatus();

                this.ecGetClientSesIdStatusInterval = setInterval(() => {
                    this.emitEcGetClientSesIdStatus();
                }, 10000);
            }
        },

        emitEcGetClientSesIdStatus() {
            this.$socket.emit("ec_get_client_ses_id_status", {
                client_ses_id: this.conversationData.clientSocketSession.id,
            });
        },

        handleInfiniteScrollLoad(index: any, done: any) {
            console.log("handleInfiniteScrollLoad");
            // it's calling only first time by load event
            // immediately we call done so that spam turns off.
            // keep in mind after done(true) scroll won't trigger without resume call
            // we have to do like these cz it's default behaviour is not working
            done(true);
            this.getNewMessages();
        },

        handleClickEmoji($event: any) {
            this.msg += $event;
            this.$refs.messageInput.focus();
        },

        // this func will get initial messages if not
        // keep in mind there will be a scenario when we know the conv_id but nothing in conversationInfo
        // at that time this function is very imp
        getNewMessages() {
            if (!this.gettingNewMessages) {
                this.gettingNewMessages = true;

                this.$store
                    .dispatch("chat/getConvMessages", {
                        convId: this.conv_id,
                        client_page: !this.isAgentChatPanel,
                    })
                    .then((res: any) => {
                        // console.log({ res });
                        if (!res.data.conversation.data.messages?.length) {
                            // if no data turn off new msg load
                            this.canCallMessageApi = false;
                        }
                    })
                    .catch(() => {
                        this.$router.push({ name: "chat-interaction" });
                    })
                    .finally(() => {
                        // delay api call for prevent spamming
                        setTimeout(() => {
                            this.firstTimeMessageLoaded = true;
                            this.gettingNewMessages = false;
                        }, 1000);
                    });
            }
        },

        checkOwnMessage(message: any) {
            return message.socket_session_id === this.ses_id;
        },

        msgSenderInfo(msg: any) {
            // const prevMsg = this.messages[index - 1];

            if (!msg.socket_session_id) {
                return {
                    display_name: "AI",
                    img_alt_name: "AI",
                    type: "ai",
                };
            }

            const isMyMsg =
                (this.chatPanelType !== "user" && !msg.socket_session.user) ||
                (this.chatPanelType === "user" && msg.isMyMsg); // msg.isMyMsg only for agent panel

            if (msg.socket_session.user) {
                return {
                    display_name: isMyMsg ? "You" : msg.socket_session.user.user_meta.display_name,
                    img_alt_name: msg.socket_session.user.user_meta.display_name,
                    email: msg.socket_session.user.email,
                    src: msg.socket_session.user.user_meta.src || null,
                    type: "agent",
                };
            }

            return {
                display_name: isMyMsg ? "You" : msg.socket_session.init_name,
                img_alt_name: msg.socket_session.init_name,
                email: msg.socket_session.init_email,
                type: "client",
            };
        },

        getConvStateStatusMessage(message: any) {
            if (!message.socket_session) return {};

            let name = message.socket_session?.user
                ? message.socket_session.user.user_meta?.display_name
                : message.socket_session?.init_name;

            let isOwn = false;

            if (
                this.chatPanelType === "user" &&
                message.socket_session.user &&
                message.socket_session.user.id === this.profile.id
            ) {
                name = "You";
                isOwn = true;
            }

            if (this.chatPanelType === "client" && !message.socket_session.user) {
                name = "You";
                isOwn = true;
            }

            const endMaker =
                message.msg === "closed"
                    ? `| ${message.socket_session.user ? "Agent" : "Client"} Ended chat ${
                          message.conversationSession.closed_reason || ""
                      }`
                    : "";

            return {
                name: name,
                state: message.msg,
                state_message: `${message.msg} the chat`,
                end_message: !isOwn ? endMaker : "",
                user_type: message.socket_session.user ? "agent" : "client",
            };
        },

        transferMsgMaker(msg: any) {
            const transferToSocketSessionId = msg.msg.split("_")[1];

            const transferToSocketSession: any = SocketSession.query()
                .where("id", transferToSocketSessionId)
                .with("user")
                .first();

            return `${msg.socket_session?.user?.user_meta?.display_name} transferred the chat to ${transferToSocketSession?.user?.user_meta?.display_name}`;
        },

        inputFocusHandle() {
            this.typingHandler = setInterval(() => {
                const tempMsg = this.msg;
                const dynamicSocket = this.socket || this.$socket;

                if (tempMsg?.trim()) {
                    this.notTypingEmitted = false;

                    dynamicSocket.emit(`ec_is_typing_from_${this.chatPanelType}`, {
                        conv_id: this.conv_id,
                        msg: this.chatPanelType === "user" ? "" : this.msg.trim(),
                        status: "typing",
                    });
                } else {
                    if (!this.notTypingEmitted) {
                        this.notTypingEmitted = true;

                        dynamicSocket.emit(`ec_is_typing_from_${this.chatPanelType}`, {
                            conv_id: this.conv_id,
                            msg: "",
                            status: "not_typing",
                        });
                    }
                }
            }, 1000);
        },
        inputBlurHandle() {
            const dynamicSocket = this.socket || this.$socket;
            dynamicSocket.emit(`ec_is_typing_from_${this.chatPanelType}`, {
                conv_id: this.conv_id,
                msg: "",
                status: "not_typing",
            });
            clearInterval(this.typingHandler);
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

        getChatTemplates(keyword = "") {
            this.chatTemplateLoading = true;
            let payload: any = {};

            if (keyword) {
                payload.keyword = keyword;
            }

            this.$store.dispatch("chat_template/getChatTemplates", payload).then((res: any) => {
                this.chatTemplates = res.data;

                this.chatTemplateLoading = false;

                // when get completes
                this.$refs[`ec_template_dom_${this.uid}`].$forceUpdate(); // it will try to match dynamic height
            });
        },
        chatTemplateShowHandle() {
            this.getChatTemplates();
            document.body.addEventListener("keyup", this.chatTemplateArrowKeyUpDownHandle);

            this.chatTemplateDomPositionUpdate();
        },
        chatTemplateHideHandle() {
            document.body.removeEventListener("keyup", this.chatTemplateArrowKeyUpDownHandle);
        },
        chatTemplateArrowKeyUpDownHandle(e: any) {
            if (this.mappedChatTemplates.length) {
                const currentFocusedTemplate = _l.findIndex(this.mappedChatTemplates, ["is_focused", true]);
                if (["ArrowUp", "ArrowDown"].includes(e.key)) {
                    const upOrDown = e.key === "ArrowDown" ? 1 : -1;

                    if (
                        currentFocusedTemplate === this.mappedChatTemplates.length - 1 ||
                        currentFocusedTemplate === -1
                    ) {
                        this.mappedChatTemplates[0].is_focused = true;
                    } else if (currentFocusedTemplate === 0 && e.key === "ArrowUp") {
                        this.mappedChatTemplates[this.mappedChatTemplates.length - 1].is_focused = true;
                    } else {
                        this.mappedChatTemplates[currentFocusedTemplate + upOrDown].is_focused = true;
                    }

                    if (this.mappedChatTemplates.length > 1 && currentFocusedTemplate !== -1) {
                        this.mappedChatTemplates[currentFocusedTemplate].is_focused = false;
                    }
                }

                if (e.key === "Enter") {
                    this.chatTemplateSelectHandle(currentFocusedTemplate);
                }
            }
        },
        chatTemplateSelectHandle(key: any) {
            if (key !== -1) {
                //if has intent handle loader wait then add content
                this.msg = this.mappedChatTemplates[key].content;
            }

            this.chatTemplate = false;
        },
        chatTemplateSearchHandle(value: any) {
            // clear before backspace check so that one api call save's
            clearTimeout(this.getChatTemplateTimer);

            this.getChatTemplateTimer = setTimeout(() => {
                this.getChatTemplates(value);
            }, 200);
        },
        chatTemplateDomPositionUpdate() {
            // this method will fix the menu position when content changes its height
            // for now quasar is not updating position when its open from top
            const msgInputElm: any = document.getElementsByClassName(`ec-msg-input-${this.uid}`)[0];
            const bodyHeight = document.body.getBoundingClientRect().height;
            const msgInputBottomPos = msgInputElm.getBoundingClientRect().bottom;

            const templateDom: any = document.getElementsByClassName(`ec_template_dom_${this.uid}`)[0];

            templateDom.style.top = "unset";
            templateDom.style.bottom = `${bodyHeight - msgInputBottomPos + 50}px`;
        },

        sendMessage(): any {
            this.msg = this.msg.trim();

            if (!this.finalAttachments.length && !this.msg.length) {
                return false;
            }

            this.createTempMsgId();

            const dynamicBody =
                this.chatPanelType === "user"
                    ? { conv_id: this.conv_id, temp_id: this.tempMsgId }
                    : { temp_id: this.tempMsgId };

            const dynamicSocket = this.socket || this.$socket;

            // send not typing from here also before send emit so that typing flicker goes
            dynamicSocket.emit(`ec_is_typing_from_${this.chatPanelType}`, {
                conv_id: this.conv_id,
                msg: "",
                status: "not_typing",
            });

            Message.insert({
                data: {
                    id: this.tempMsgId,
                    msg: this.msg,
                    message_type: "message",
                    conversation_id: this.conv_id,
                    socket_session_id: this.$helpers.getMySocketSessionId(),
                    created_at: new Date().toISOString(),
                    attachments: this.finalAttachments,
                },
            }).then(() => {
                this.tempMsgId = null;

                this.scrollToPosition();
            });

            const pendingEntry = this.finalAttachments.find((attachment: any) => attachment.status !== "done");

            if (!this.finalAttachments.length || !pendingEntry) {
                dynamicSocket.emit(`ec_msg_from_${this.chatPanelType}`, {
                    ...dynamicBody,
                    msg: this.msg,
                    attachments: _l.map(this.finalAttachments, "attachment_uploaded_id"),
                });
            }

            this.msg = "";
            this.attachments = [];
            this.finalAttachments = [];
        },

        scrollToPosition(position = 1, forceBottom = false) {
            if (this.conversationData.closed_at) return; // no need to scroll bottom if conv is closed or chat history
            if (!this.canGoToBottom && !forceBottom) return;

            const msgScrollArea = this.$refs.msgScrollArea;

            // waiting for dom render
            setTimeout(() => {
                if (msgScrollArea) {
                    // console.log("scroll to ", position);

                    this.$store.dispatch("chat/updateConvMessagesAutoScrollToBottom", {
                        conv_id: this.conv_id,
                        auto_scroll_to_bottom: position === 1,
                        last_position: 1,
                    });

                    msgScrollArea.setScrollPercentage("vertical", position, 100);

                    if (position === 1) {
                        clearTimeout(this.updateLastMsgSeenTimeTimer);

                        // check if user on page then update. for now do it
                        this.updateLastMsgSeenTimeTimer = setTimeout(() => this.updateLastMsgSeenTime(), 1200);
                    }
                }
            }, 100);
        },

        createTempMsgId() {
            if (!this.tempMsgId) {
                this.tempMsgId = `temp_msg_id_${this.$helpers.getTempId()}`;
            }

            return this.tempMsgId;
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

        updateAttachmentModelStatus(attachment: any, status: string) {
            // remove this data after received the msg event. how i dont know
            // if not remove then no worry but it will eat resource
            if (attachment.temp_id) {
                MessageAttachment.update({
                    where: attachment?.temp_id,
                    data: {
                        attachment_uploaded_id: attachment.attachment_info.id,
                        status,
                    },
                });
            }
        },

        // when submit multiple attachment, after all attachment successfully upload emit the event (ec_msg_from_user/ec_msg_from_client)
        // when multiple attachment with text, text will be sent after uploaded the all attachment
        sendMessageAfterAllAttachmentUploaded(attachment: any, tempMsgId: string) {
            if (attachment.msg_temp_id) {
                const msgObj: any = Message.query().where("id", attachment.msg_temp_id).with("attachments").first();

                if (msgObj && msgObj.attachments && msgObj.attachments.length) {
                    const pendingEntry = msgObj.attachments.find((attachment: any) => attachment.status !== "done");

                    if (!pendingEntry) {
                        const dynamicSocket = this.socket || this.$socket;
                        const dynamicBody =
                            this.chatPanelType === "user"
                                ? { conv_id: this.conv_id, temp_id: tempMsgId }
                                : { temp_id: tempMsgId };

                        // here msg will be empty so get msg from msgObj
                        dynamicSocket.emit(`ec_msg_from_${this.chatPanelType}`, {
                            ...dynamicBody,
                            msg: msgObj.msg,
                            attachments: _l.map(msgObj.attachments, "attachment_uploaded_id"),
                        });
                    }
                }
            }
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

        async updateLastMsgSeenTime() {
            // urgent check needed
            // must check if seen need to update or not
            const lastMsgSeenTime = moment().format();
            const mySocketSesId = this.$helpers.getMySocketSessionId();

            // check for undefined issue
            if (
                this.myConversationSession &&
                this.myConversationSession.joined_at &&
                !this.myConversationSession.left_at &&
                this.conversationData.myUnseenMessageCount > 0
            ) {
                console.log("update seen");

                this.$store.commit("chat/updateConversation", {
                    conv_id: this.conv_id,
                    last_msg_seen_time: lastMsgSeenTime,
                    socket_session_id: mySocketSesId,
                });

                // we could use conversation/:conv_id/update-last-message-seen-time
                await window.socketSessionApi.post(
                    `conversations/update-last-message-seen-time/conversation-session/${this.myConversationSession.id}`
                );
            }
        },

        getDateTime(date: any) {
            return this.$helpers.myDate(date, `${this.isAgentChatPanel ? "MMM DD, Y" : ""} h:mm a`);
        },

        acceptChat(convId: any) {
            this.$socket.emit("ec_join_conversation", {
                conv_id: convId,
            });

            // check chat conversation id

            this.$router.push({ name: "chats", params: { conv_id: convId } });
        },

        loadPreviousChat() {
            const prevConvsById = this.clientPreviousChats[this.conv_id];

            // first check if this conv has previous chats
            // each conv can contain his prev conv.
            // currently prev check is for closed chat
            if (prevConvsById) {
                // take one prev by filtering without loaded ones
                const previousConvIdsArray: any = _l
                    .sortBy(Object.values(prevConvsById), (conv: any) => moment(conv.created_at).format("x"))
                    .reverse()
                    .filter(
                        (conv: any) =>
                            !this.conversationInfo.prev_loaded_ids?.length ||
                            !this.conversationInfo.prev_loaded_ids.includes(conv.id)
                    );

                if (previousConvIdsArray.length) {
                    this.canCallMessageApi = true;

                    this.$store.commit("chat/updateConversation", {
                        conv_id: this.conv_id,
                        prev_loaded_id: previousConvIdsArray[0].id, // send this one to store so that we know this was loaded
                    });

                    this.getNewMessages();
                }
            }
        },

        imageLoadOnPast(e: any) {
            const isTextPast = e.clipboardData?.getData("text") || e.dataTransfer?.getData("text");

            // prevent default only for file (past/drop)
            if (!isTextPast) e.preventDefault();

            let files = e.dataTransfer?.files || e.clipboardData?.files || [];

            this.attachmentUploaderHandle([...files]);
        },

        getDraft() {
            window.socketSessionApi
                .get(`conversations/get-draft/${this.conv_id}`)
                .then((res: any) => {
                    if (res.data.draft_message) {
                        ConversationSession.update({ where: res.data.id, data: res.data });
                        this.msg = res.data.draft_message;
                    }
                })
                .catch((err: any) => {
                    console.log(err.response);
                });
        },

        saveDraft() {
            if (!this.showSendMessageInput) return;

            const msg = this.msg;

            const bodyData: any = {};

            // now only support for text
            if (msg || this.finalAttachments.length) {
                bodyData.draft_message = msg;
            }

            window.socketSessionApi
                .post(`conversations/save-draft/${this.conv_id}`, bodyData)
                .then((res: any) => {
                    ConversationSession.update({ where: res.data.id, data: res.data });

                    this.msg = "";
                    console.log(res.data);
                })
                .catch((err: any) => {
                    console.log(err.response);
                });
        },
    },

    watch: {
        conversationData: {
            handler: function () {
                // console.log('conversationData watcher started');
                if (this.conversationData.id && this.conversationData.closed_at) {
                    clearInterval(this.ecGetClientSesIdStatusInterval);
                }
            },
            deep: true,
            immediate: true,
        },

        conv_id: {
            handler: function (newVal, oldVal) {
                if (this.conv_id && this.mini_mode && newVal !== oldVal && this.$refs.myInfiniteScrollArea) {
                    this.$refs.myInfiniteScrollArea.poll();

                    this.scrollToPosition(1, true);
                }

                // if need remove mini mode check
                if (this.conv_id && newVal !== oldVal && !this.mini_mode) {
                    this.$store.dispatch("chat/getPreviousConversations", {
                        before_conversation_id: this.conv_id,
                    });
                }
            },
            immediate: true,
        },

        typingState: {
            handler: function () {
                this.scrollToPosition();
            },
            deep: true,
        },

        ecGetClientSesIdStatusWatch: {
            handler: function () {
                if (
                    this.conversationData?.id &&
                    !this.conversationData.closed_at &&
                    !this.conversationData.users_only &&
                    this.conversationData.clientSocketSession.id &&
                    !this.ecGetClientSesIdStatusInterval
                ) {
                    this.ecGetClientSesIdStatusEvent();
                }
            },
            deep: true,
            immediate: true,
        },
    },

    unmounted() {
        this.$store.dispatch("chat/updateConvMessagesAutoScrollToBottom", {
            conv_id: this.conv_id,
            auto_scroll_to_bottom: true,
            last_position: 1,
        });

        clearInterval(this.scrollCheckInterval);

        this.saveDraft();
    },
});
</script>

<style lang="scss">
.q-infinite-scroll {
    .tw-z-10 div:first-child {
        .ec-widget-message-card-container {
            margin-top: 0;
        }
    }
}

.each-attachment {
    &:hover {
        .attachment-remove-btn {
            display: inline-flex !important;
        }
    }
}

.attachment-preview {
    img {
        width: min-content;
        margin: auto;
    }
}

.ec-msg-input.q-textarea {
    .q-field__control-container {
        padding: 0;
    }
}

.mini-mode-message-text-container {
    .q-message-text {
        padding: 5px;

        &:last-child {
            min-height: 40px;
        }
    }
}

.chat_template_box {
    .q-list--separator {
        .q-item-type:not(:first-child) {
            border-top: 1px solid rgba(0, 87, 143, 0.1);
        }
    }

    .chat_template_selected_item,
        //.chat_template_box_header
    {
        background-color: rgba(0, 87, 143, 0.06);
    }

    .q-item-type:hover .q-focus-helper {
        background: rgba(0, 87, 143, 0.06) !important;
        opacity: unset !important;

        &:before {
            opacity: unset;
            background: unset;
        }
    }
}
</style>
