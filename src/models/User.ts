import { model, Schema } from 'mongoose';

const modelSchema = new Schema({
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
	rol: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Roles',
	},
	area: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Area',
	},
	active: {
		type: Boolean,
		required: true,
		default: true,
	},
	nameRol: {
		type: String,
		required: true,
		trim: true,
	},
	nameArea: {
		type: String,
		required: true,
		trim: true,
	},
	modules: Array,
	tokenURL: String,
});

export const User = model('User', modelSchema);