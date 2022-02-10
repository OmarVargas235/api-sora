import { Schema, model }  from 'mongoose';

const modelSchema = new Schema({
    description: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    active: Boolean,
});

export const Area = model('Area', modelSchema);