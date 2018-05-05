"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const util_1 = require("../util/util");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator_1.default.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    type: {
        type: String,
        trim: true,
        required: true,
        default: 'user',
        enum: ['user', 'admin', 'super']
    },
    tokens: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ]
});
userSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    // TODO fix for production env
    const token = jsonwebtoken_1.default
        .sign({
        _id: user._id.toHexString(),
        access
    }, process.env.JWT_SECRET || '')
        .toString();
    user.tokens = user.tokens.concat([
        {
            access,
            token
        }
    ]);
    return user.save().then(() => {
        return token;
    });
};
userSchema.methods.removeToken = function (token) {
    const user = this;
    return user.update({
        $pull: {
            tokens: { token }
        }
    });
};
userSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;
    try {
        // TODO fix for production env
        decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
    }
    catch (e) {
        return Promise.reject(new Error('JWT verification failed'));
    }
    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};
userSchema.statics.findByCredentials = function (username, password) {
    const User = this;
    return User.findOne({ username }).then((user) => {
        if (!user) {
            return Promise.reject(new Error('User not found'));
        }
        return new Promise((resolve, reject) => {
            bcryptjs_1.default.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                }
                else {
                    reject();
                }
            });
        });
    });
};
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    return util_1.pick(userObject, ['_id', 'email', 'username']);
};
userSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        bcryptjs_1.default.genSalt(10, (err, salt) => {
            bcryptjs_1.default.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});
const User = mongoose_1.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map