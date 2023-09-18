// functions to store tokens in session storage
export interface Tokens {
    access_token: string;
    id_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    is_admin: boolean;
    is_subscribed: boolean;
    email: string;
}
export const storeTokens = (tokens: Tokens) => {
    localStorage.setItem('ab-website-tokens', JSON.stringify(tokens));
}
export const loadTokens = (): Tokens | null => {
    const tokens = localStorage.getItem('ab-website-tokens');
    if (tokens) {
        return JSON.parse(tokens);
    }
    return null;
}
export const resetTokens = () => {
    localStorage.removeItem('ab-website-tokens');
}