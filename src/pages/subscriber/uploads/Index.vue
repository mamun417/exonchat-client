<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">My Uploads</div>
            <q-btn color="green" icon="add" label="Assign" @click="assignAgentModal = true"></q-btn>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <div class="tw-flex">
                    <q-input placeholder="Search" dense />
                    <q-space />
                    <q-btn color="green" label="Filter" no-caps flat />
                </div>

                <div class="tw-mt-5">
                    <div class="tw-grid tw-grid-cols-5 tw-gap-3">
                        <div
                            v-for="(file, key) in uploadedFiles"
                            class="ec-each-file tw-relative tw-shadow-lg tw-rounded"
                            style="max-height: 250px"
                            :key="key"
                        >
                            <q-img :src="file.src" style="min-height: 180px" fit="contain" />
                            <div class="tw-p-3">
                                <div class="text-green tw-text-md tw-font-bold">{{ file.original_name }}</div>
                                <div class="tw-flex text-grey-8 tw-text-xs tw-font-bold tw-mt-2">
                                    <div>{{ file.created_at }}</div>
                                    <q-space />
                                    <div>{{ file.size ? file.size / 1024 : 0 }} kb</div>
                                </div>
                            </div>

                            <q-btn
                                icon="more_horiz"
                                color="green"
                                class="ec-each-file-more-option tw-absolute tw-hidden tw-top-2 tw-right-2"
                                unelevated
                                dense
                            >
                                <q-menu anchor="bottom right" self="top right">
                                    <q-list class="text-green-8" style="min-width: 180px">
                                        <q-item clickable v-close-popup
                                            ><q-item-section avatar class="tw-pr-2 tw-min-w-0">
                                                <q-icon name="open_in_full" />
                                            </q-item-section>
                                            <q-item-section>Full Image</q-item-section>
                                        </q-item>
                                        <q-item clickable v-close-popup
                                            ><q-item-section avatar class="tw-pr-2 tw-min-w-0">
                                                <q-icon name="forward_to_inbox" />
                                            </q-item-section>
                                            <q-item-section>Forward To</q-item-section>
                                        </q-item>
                                        <q-separator />
                                        <q-item clickable v-close-popup
                                            ><q-item-section avatar class="tw-pr-2 tw-min-w-0">
                                                <q-icon name="data_usage" />
                                            </q-item-section>
                                            <q-item-section>Show Usage</q-item-section>
                                        </q-item>
                                        <q-item clickable v-close-popup>
                                            <q-item-section avatar class="tw-pr-2 tw-min-w-0">
                                                <q-icon name="download" />
                                            </q-item-section>
                                            <q-item-section>Download</q-item-section>
                                        </q-item>
                                        <q-separator />
                                        <q-item clickable @click="deleteFile(file)" v-close-popup>
                                            <q-item-section avatar class="tw-pr-2 tw-min-w-0">
                                                <q-icon name="delete" color="orange-8" />
                                            </q-item-section>
                                            <q-item-section class="text-orange-8">Delete</q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-menu></q-btn
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import * as _l from 'lodash';

export default defineComponent({
    data(): any {
        return {
            uploadedFiles: [],
        };
    },
    setup() {
        return {};
    },

    mounted() {
        this.getUploadedFiles();
    },
    methods: {
        getUploadedFiles() {
            window.api
                .get('attachments')
                .then(async (res: any) => {
                    console.log(res.data);
                    this.uploadedFiles = res.data;

                    for (const file of this.uploadedFiles) {
                        if (!file.src) {
                            try {
                                file.loading = false;
                                const imgRes = await this.$socketSessionApi.get(`attachments/${file.id}`, {
                                    responseType: 'arraybuffer',
                                });

                                file.src = URL.createObjectURL(
                                    new Blob([imgRes.data], { type: imgRes.headers['content-type'] })
                                );
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }
                })
                .catch((e: any) => {
                    console.log(e);
                });
        },

        deleteFile(file: any) {
            this.$socketSessionApi
                .get(`attachments/${file.id}/user-control`)
                .then((res: any) => {
                    console.log(res);

                    _l.remove(this.uploadedFiles, (a: any) => a.id === file.id);
                })
                .catch((e: any) => {
                    console.log(e);
                });
        },
    },
});
</script>

<style lang="scss">
.ec-each-file {
    &:hover {
        .ec-each-file-more-option {
            display: block;
        }
    }
}
</style>
