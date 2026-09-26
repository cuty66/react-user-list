let refreshPromise = null;
export async function apiFetch(endpoint, options = {}, accessToken, refresh,  isRetry = false) {
    const response = await fetch(
        endpoint, {
            ...options,
            headers: {
                ...options?.headers,
                Authorization: `Bearer ${accessToken}`,
            }
        }
    );

    if(!response.ok) {
        if(response.status === 401) {
            if (isRetry) {
                return null;
            }
            if (!refreshPromise) {
                refreshPromise = refresh().finally(() => {
                    refreshPromise = null;
                });
            }
            const newToken = await refreshPromise;

            if(newToken) {
                return apiFetch(
                    endpoint,
                    options,
                    newToken,
                    refresh,
                    true
                );
            }
            return null;
        }
    
        throw new Error("Request failed");
    }
    return response;
}