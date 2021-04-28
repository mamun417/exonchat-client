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

        <template v-slot:body="props"
            ><q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <!-- if you want you can change status or any by following rules -->
                    <slot :name="`cell-{col.name}`">
                        <template v-if="col.name === statusColumnName">
                            <!-- make data/row key to status and make value & change col field to status also or ignore -->
                            <!-- you can make this component -->
                            <q-badge :color="statusSuccessValues.includes(props.row[col.name]) ? 'green' : 'orange'">
                                {{ props.row[col.name] }}
                            </q-badge>
                        </template>
                        <template v-if="col.name === 'action'">
                            <!-- you can make this cpmponent also -->
                            <slot name="action-at-start" :row="props.row">
                                <!-- use btns or anything at start position -->
                                <!-- you will get row data by writing -->
                                <!-- <template v-slot:action-at-start="slotProps.row" -->
                            </slot>

                            <!-- use emit at edit -->
                            <q-btn
                                icon="create"
                                text-color="green"
                                size="sm"
                                @click="$emit('handleEdit', props.row)"
                                dense
                                flat
                            ></q-btn>
                            <slot name="action-at-middle" :row="props.row">
                                <!-- use btns or anything at start position -->
                                <!-- you will get row data by writing -->
                                <!-- <template v-slot:action-at-last="slotProps.row" -->
                            </slot>
                            <!-- delete modal component use here and pass reloadData func -->
                            <!-- make sure reloadData func is common in parent also so that -->
                            <!-- future filter, serach, pagination n data reload can happen -->
                            <q-btn
                                @click="showConfirmDeleteModal(props.row)"
                                icon="delete"
                                text-color="red"
                                size="sm"
                                dense
                                flat
                            ></q-btn>
                            <slot name="action-at-end" :row="props.row">
                                <!-- use btns or anything at start position -->
                                <!-- you will get row data by writing -->
                                <!-- <template v-slot:action-at-last="slotProps.row" -->
                            </slot>
                        </template>
                        <template v-else>
                            <!-- if a col name is has design same across all then -->
                            <!-- if check [names].includes(name) then show this component -->
                            {{ props.row[col.name] }}</template
                        >
                    </slot>
                </q-td></q-tr
            ></template
        >

        <template v-slot:no-data>
            <div class="full-width row flex-center text-red q-gutter-sm">
                <q-icon size="2em" name="sentiment_dissatisfied" />
                <span> {{ noDataMsg }} </span>
            </div>
        </template>
    </q-table>
</template>

<script lang="ts">
import _ from 'lodash';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'EcTable',
    props: {
        rows: [],
        columns: [],
        noDataMsg: { type: String, default: 'Well this is sad... No data found' },
        urlPath: { type: String, default: '' },
        hideSearch: { type: Boolean, default: false },
        statusColumnName: { type: String, default: 'status' },
        statusSuccessValues: { type: Array, default: () => ['active'] },
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
