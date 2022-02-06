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
	idRol: {
		type: Number,
		required: true,
	},
	rol: {
		type: String,
		required: true,
		trim: true,
	},
	modules: Array,
    img: String,
	tokenURL: String,
});

export const User = mongoose.model('User', modelSchema);