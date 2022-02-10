import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
	name: {
		type: String,
		lowercase: true,
		unique: true,
        required: true,
	},
});

export const Rol = mongoose.model('Roles', modelSchema);