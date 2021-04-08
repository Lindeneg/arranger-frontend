export const isResponseOk = (status: number): boolean => status >= 200 && status <= 299;

export const getAuthHeader = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`
    }
});
