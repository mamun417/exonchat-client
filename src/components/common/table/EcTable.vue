<template>
    <q-table :rows="rows" :columns="columns" row-key="name" :pagination="{ rowsPerPage: 0 }" hide-pagination flat>
        <template v-if="!hideSearch" v-slot:top-left>
            <q-input dense debounce="300" placeholder="Search" color="green">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
        </template>

        <template v-slot:top-right>
            <slot name="filter">
                <!-- when you use this call updateUrlPath frpm the paren by selecteing its ref -->
            </slot>
        </template>

        <!--<intent-list></intent-list>-->

        <template v-slot:header="props">
            <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                    <!-- if you want to change a header col style or anything just call -->
                    <!-- <template v-slot:header-cell-colname="slotProps" >your div {{slotProps.col.name}}</template> -->
                    <!-- slotProps will contain col so for the name slotProps.col.name -->
                    <slot :name="`header-cell-${col.name}`" :col="col">
                        <div class="text-italic text-green tw-font-bold tw-text-xxs">{{ col.label }}</div>
                    </slot>
                </q-th>
            </q-tr>
        </template>

        <template v-slot:body="props">
            <q-tr :props="props" :class="props.row.id === selectedRowId ? 'tw-bg-amber-100' : ''">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <!--                    <div class="text-red-14">-->
                    <!--                        <pre>{{ col.name }}</pre>-->
                    <!--                    </div>-->
                    <!-- if you want you can change status or any by following rules -->
                    <slot :name="`cell-${col.name}`" :row="props.row">
                        <template v-if="col.name === statusColumnName">
                            <!-- make data/row key to status and make value & change col field to status also or ignore -->
                            <!-- you can make this component -->
                            <q-badge :color="statusSuccessValues.includes(props.row[col.name]) ? 'green' : 'orange'">
                                {{ $_.upperFirst(props.row[col.name]) }}
                            </q-badge>
                        </template>
                        <template v-else-if="col.name === 'action'">
                            <!-- you can make this cpmponent also -->
                            <slot name="action-at-start" :row="props.row">
                                <!-- use btns or anything at start position -->
                                <!-- you will get row data by writing -->
                                <!-- <template v-slot:action-at-start="slotProps.row" -->
                            </slot>

                            <edit-btn @click="$emit('handleEdit', props.row)" />

                            <slot name="action-at-middle" :row="props.row">
                                <!-- use btns or anything at start position -->
                                <!-- you will get row data by writing -->
                                <!-- <template v-slot:action-at-last="slotProps.row" -->
                            </slot>
                            <!-- delete modal component use here and pass reloadData func -->
                            <!-- make sure reloadData func is common in parent also so that -->
                            <!-- future filter, serach, pagination n data reload can happen -->
                            <delete-btn @click="$emit('handleDelete', props.row)" />

                            <slot name="action-at-end" :row="props.row">
                                <!-- use btns or anything at start position -->
                                <!-- you will get row data by writing -->
                                <!-- <template v-slot:action-at-last="slotProps.row" -->
                            </slot>
                        </template>
                        <template v-else>
                            <!-- if a col name is has design same across all then -->
                            <!-- if check [names].includes(name) then show this component -->
                            <div v-if="bodyCelTemplate.hasOwnProperty(col.name)">
                                <component :is="bodyCelTemplate[col.name]" :content="props.row[col.name]" />
                            </div>
                            <div v-else>{{ props.row[col.name] }}</div>
                        </template>
                    </slot>
                </q-td>
            </q-tr>
        </template>

        <template v-slot:no-data>
            <div class="full-width row flex-center text-red q-gutter-sm">
                <q-icon size="2em" name="sentiment_dissatisfied" />
                <span> {{ noDataMsg }} </span>
            </div>
        </template>
    </q-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ItalicBold from 'components/common/table/utilities/ItalicBold.vue';
import EditBtn from 'components/common/table/utilities/EditBtn.vue';
import DeleteBtn from 'components/common/table/utilities/DeleteBtn.vue';

export default defineComponent({
    name: 'EcTable',
    components: { DeleteBtn, EditBtn, ItalicBold },
    props: {
        rows: [],
        columns: [],
        noDataMsg: { type: String, default: 'Well this is sad... No data found' },
        urlPath: { type: String, default: '' },
        hideSearch: { type: Boolean, default: false },
        statusColumnName: { type: String, default: 'status' },
        statusSuccessValues: { type: Array, default: () => ['active'] },
        bodyCelTemplate: {
            type: Object,
            default: () => ({}),
        },
        selectedRowId: {
            type: String,
            default: '',
        },
    },
    data(): any {
        return {};
    },

    setup() {
        return {};
    },

    mounted() {
        console.log('ec table mounted');
    },

    computed: {},

    methods: {},
});
</script>
