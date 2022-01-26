import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
    name: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		trim: true,
	},
    img: String,
});

export const User = mongoose.model('User', modelSchema);