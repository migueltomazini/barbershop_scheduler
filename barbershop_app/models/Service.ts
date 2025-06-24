// models/Service.ts
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IService extends Document {
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  icon?: string; // Adicionando o campo opcional 'icon'
}

const ServiceSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  image: { type: String, required: true },
  icon: { type: String, required: false }, // ADICIONADO AQUI
}, {
  timestamps: true
});

export default models.Service || model<IService>('Service', ServiceSchema);