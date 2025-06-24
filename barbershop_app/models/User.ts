// models/User.ts
import mongoose, { Schema, Document, models, model } from 'mongoose';

// A interface e o sub-schema de endereço não mudam.
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'admin' | 'client';
  address?: any;
}

const AddressSchema: Schema = new Schema({
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
}, { _id: false });

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  
  // A senha agora é apenas uma String simples.
  // A opção 'select: false' ainda é uma boa prática para não expor a senha em buscas gerais.
  password: { type: String, required: true, select: false },
  
  phone: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'client'], default: 'client' },
  address: { type: AddressSchema, required: false },
}, {
  timestamps: true
});

// REMOVIDO: O middleware UserSchema.pre('save', ...) foi completamente removido.

export default models.User || model<IUser>('User', UserSchema);