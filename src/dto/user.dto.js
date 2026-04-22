
class userDTO {
    constructor(user) {
        this.user_id = user.id;
        this.user_name = user.name;
        this.user_email = user.email;
        this.user_email_verified = user.email_verified;
        this.user_description = user.description;
    };

};

export default userDTO;

