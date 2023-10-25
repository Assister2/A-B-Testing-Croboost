import { API_ROOT } from "../../constants";
import { Tokens, storeTokens } from "../../utils";

export interface LoginData {
    email: string;
    password: string;
}
export interface SignUpData {
    email: string;
    confirm_email: string;
    password: string;
    confirm_password: string;
}
export interface SignUpOk {
    status: "OK";
}

export const postLogin = async (data: LoginData) => {
    const response = await fetch(`${API_ROOT}/auth/manual/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (response.status >= 400 && response.status < 500) {
        // return await response.json();
        const json = await response.json();
        throw new Error(json.detail);
    }
    else if (response.status >= 500) {
        throw new Error("Server Error");
    }
    const json = await response.json();
    debugger
    storeTokens(json);
    return json as Tokens;
}
export const postSignUp = async (data: SignUpData) => {
    const response = await fetch(`${API_ROOT}/auth/manual/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (response.status >= 400 && response.status < 500) {
        const json = await response.json();
        const detail = json.detail;
        throw new Error(detail);
    }
    else if (response.status >= 500) {
        throw new Error("Server Error");
    }
    const json = await response.json();
    return json as SignUpOk;
}