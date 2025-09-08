# API-Class-js

I use this JavaScript class for making API requests 

---

## ✨ Features

*  Centralized API request handling (`fetch` wrapper)
*  Optional `apiKey` parameter 
*  Built-in error handling (network + HTTP)
*  Loader hooks (`showLoader` / `hideLoader`)
*  Convenience methods: `get`, `post`, `put`, `delete`
*  Extendable for project-specific endpoints

---

## 🚀 Installation

Simply copy the `ApiService.js` file into your project and include it.

```html
<script src="ApiService.js"></script>
```

Or with ES modules:

```js
import ApiService from "./ApiService.js";
```

---

## 🔧 Usage

### Create an API client

```js
// 1. Load apiKey from localStorage (default)
const api = new ApiService("https://example.com");

// 2. Or pass apiKey explicitly
const api = new ApiService("https://example.com", "my-secret-key");
```

---

### GET request

```js
const res = await api.get("/api/products", { page: 1, limit: 10 });

if (res.success) {
  console.log(res.data);
} else {
  console.error(res.error.message);
}
```

---

### POST request

```js
const res = await api.post("/api/sale", { product_id: 1, quantity: 3 });
```

---

### PUT request

```js
const res = await api.put("/api/product/1", { name: "Updated Product" });
```

---

### DELETE request

```js
const res = await api.delete("/api/product/1");
```

---

### API key management

```js
// Set key after login
api.setApiKey("new-api-key-123");

// Get key
console.log(api.getApiKey());

// Clear key on logout
api.clearApiKey();
```

---

## 🔌 Extend for Project Endpoints

Instead of polluting `ApiService`, extend it:

```js
class ShopApi extends ApiService {
  async login(username, password) {
    return this.post("/api/login", { username, password });
  }

  async fetchProducts() {
    return this.get("/api/products");
  }
}

const shopApi = new ShopApi("https://example.com");
```

---

## ⚡ Notes

* `showLoader()` and `hideLoader()` must be defined in your project.
* API key is sent via header:

  ```
  X-API-Key: <your_api_key>
  ```
* You can modify header to `Authorization: Bearer <token>` if using JWT/OAuth.
