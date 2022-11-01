/* eslint-disable camelcase */
class User {
    constructor(display_name, email_id, password, photo_url, role, shop_name, store_description, user_id, shop_status = "", shop_statuses = [], shopify_token = "", shop_url = "", store_created_at = new Date()) {
        this.display_name = display_name;
        this.email_id = email_id;
        this.password = password;
        this.photo_url = photo_url;
        this.role = role;
        this.shop_name = shop_name;
        this.shop_status = shop_status;
        this.shop_statuses = shop_statuses;
        this.shop_url = shop_url;
        this.shopify_token = shopify_token;
        this.store_description = store_description;
        this.user_id = user_id || this.email_id;
        this.store_created_at = store_created_at;
    }

    toString() {
        return `${this.display_name}, ${this.email_id}, ${this.shop_name}`;
    }
}

// Firestore data converter
module.exports.UserConverter = {
    toFirestore: (user) => {
        return {
            display_name: user.display_name,
            email_id: user.email_id,
            password: user.password,
            photo_url: user.photo_url,
            role: user.role,
            shop_name: user.shop_name,
            shop_status: user.shop_status,
            shop_statuses: user.shop_statuses,
            shop_url: user.shop_url,
            shopify_token: user.shopify_token,
            store_description: user.store_description,
            user_id: user.user_id
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.display_name, data.email_id, data.password, data.photo_url, data.role, data.shop_name, data.store_description, data.shop_status, data.shop_statuses, data.shopify_token, data.shop_url, data.store_created_at);
    },
    toUserObject: (data) => {
        return new User(data.display_name, data.email_id, data.password, data.photo_url, data.role, data.shop_name, data.store_description, data.shop_status, data.shop_statuses, data.shopify_token, data.shop_url, data.store_created_at);
    }
};
