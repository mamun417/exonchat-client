export interface AuthStateInterface {
    token: string;
    user: any;
}

function state(): AuthStateInterface {
    const checkUser = localStorage.getItem('user') || '{}';

    return {
        token: localStorage.getItem('token') || '',
        user: JSON.parse(checkUser),
    };
}

export default state;
