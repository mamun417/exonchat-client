import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { SocketStateInterface } from './state';

const getters: GetterTree<SocketStateInterface, StateInterface> = {
    someAction(/* context */) {
        // your code
    },
    auth(/* context */) {
        // your code
    },
};

export default getters;
