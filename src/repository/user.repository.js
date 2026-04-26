import ServerError from "../helpers/error.helper.js"
import User from "../models/user.model.js"

class UserRepository {

    async create(username, email, password) {
        if (!username || !email || !password) {
            throw new ServerError('Faltan credenciales', 400);
        };
        return await User.create({
            name: username,
            email: email,
            password: password
        })
    }

    async deleteById(user_id) {
        if (!user_id) {
            throw new ServerError('Faltan credenciales', 400);
        };
        await User.findByIdAndDelete(user_id)
    }

    async getById(user_id) {
        if (!user_id) {
            throw new ServerError('Faltan credenciales', 400);
        };
        return await User.findById(user_id)
    }

    async updateById(id, new_user_props) {
        if (!id || !new_user_props) {
            throw new ServerError('Faltan credenciales', 400);
        };
        const new_user = await User.findByIdAndUpdate(
            id,
            new_user_props,
            { returnDocument: 'after' }
        )
        return new_user
    }

    async getByEmail(email) {
        if (!email) {
            throw new ServerError('Faltan credenciales', 400);
        };
        const user = await User.findOne({ email: email })
        return user
    }

    async getUser() {
        const user = await User.findOne()
        return user
    }

    async getByUsername(name) {
        if (!name) {
            throw new ServerError('Faltan credenciales', 400);
        };
        const user = await User.findOne({ name: name })
        return user
    }

    async updatePassword(id, hashedPassword) {
        return await User.findByIdAndUpdate(id, { password: hashedPassword }, { returnDocument: 'after' });
    }

}


const userRepository = new UserRepository()
export default userRepository