/* eslint-disable camelcase */
class User {
    constructor(display_name, email_id, password, photo_url, role, shop_name, shop_status, shop_statuses, shop_url, shopify_token, store_description, user_id) {
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
        this.user_id = user_id;
    }

    toString() {
        return `${this.display_name}, ${this.email_id}, ${this.shop_name}`;
    }
}

// var cityConverter = {
//     toFirestore: function(city) {
//         return {
//             name: city.name,
//             state: city.state,
//             country: city.country
//         };
//     },
//     fromFirestore: function(snapshot, options) {
//         const data = snapshot.data(options);
//         return new City(data.name, data.state, data.country);
//     }
// };

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
        return new User(data.display_name, data.email_id, data.password, data.photo_url, data.role, data.shop_name, data.shop_status, data.shop_statuses, data.shop_url, data.shopify_token, data.store_description, data.user_id);
    }
};
