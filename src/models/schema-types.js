import mongoose from 'mongoose';

const { Schema } = mongoose;

export { mongoose, Schema };
export const ref = model => ({ type: Schema.Types.ObjectId, ref: model, required: true });
export const vnd = { type: Number, required: true, min: 0, validate: Number.isSafeInteger };
export const time = { type: String, required: true, match: /^(?:[01]\d|2[0-3]):[03]0$/ };
