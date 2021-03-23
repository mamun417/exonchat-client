export interface AuthStateInterface {
    token: any;
}

function state(): AuthStateInterface {
    return {
        token: localStorage.getItem('token') || '',
        //user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {},
    };
}

export default state;
