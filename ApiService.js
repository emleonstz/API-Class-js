class ApiService {
    constructor(baseURL, apiKey = null) {
        this.baseURL = baseURL ?? "http://localhost:8080/";
        this.apiKey = apiKey ?? localStorage.getItem("api_key") || "";
    }

    // Store API key after login
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem("api_key", apiKey);
    }

    getApiKey() {
        return this.apiKey;
    }

    // Remove API key on logout
    clearApiKey() {
        this.apiKey = "";
        localStorage.removeItem("api_key");
    }

    // Main fetch method with error handling
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        showLoader();

        const headers = {
            "Content-Type": "application/json",
            "X-API-Key": this.apiKey,
            ...options.headers,
        };

        if (options.body instanceof FormData) {
            delete headers["Content-Type"];
        }

        const config = {
            ...options,
            headers,
            credentials: "include",
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw await this.handleHttpError(response);
            }
            const data = await response.json();
            return { success: true, data, response };
        } catch (error) {
            return this.handleRequestError(error);
        } finally {
            hideLoader();
        }
    }

    async handleHttpError(response) {
        let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {}
        const error = new Error(errorMessage);
        error.status = response.status;
        error.response = response;
        return error;
    }

    handleRequestError(error) {
        if (error.name === "TypeError" && error.message.includes("fetch")) {
            return {
                success: false,
                error: {
                    message: "Network error. Please check your connection.",
                    code: "NETWORK_ERROR",
                    original: error,
                },
            };
        }
        return {
            success: false,
            error: {
                message: error.message || "An unexpected error occurred",
                code: error.status || "UNKNOWN_ERROR",
                original: error,
            },
        };
    }

    // Convenience methods
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: "GET" });
    }

    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: "POST",
            body: data instanceof FormData ? data : JSON.stringify(data),
        });
    }

    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: "DELETE" });
    }
}
