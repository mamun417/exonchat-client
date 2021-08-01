export interface AuthStateInterface {
    token: string;
    user: any;
}

function state(): AuthStateInterface {
    const checkUser = localStorage.getItem('user') || '{}';

    return {
        token: localStorage.getItem('exonchat_token') || '',
        user: JSON.parse(checkUser),
    };
}

export default state;
