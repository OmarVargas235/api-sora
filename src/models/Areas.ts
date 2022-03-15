import { Schema, model }  from 'mongoose';

const modelSchema = new Schema({
    description: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
});

export const Area = model('Area', modelSchema);