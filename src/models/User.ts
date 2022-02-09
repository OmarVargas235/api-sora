import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
	userName: {
		type: String,
		lowercase: true,
		unique: true,
	},
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
		lowercase: true,
	},
	area: {
		type: Object,
		required: true,
	},
	modules: Array,
	tokenURL: String,
});

export const User = mongoose.model('User', modelSchema);