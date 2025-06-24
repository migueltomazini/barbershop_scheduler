import mongoose, { Schema, Document, models, model } from 'mongoose';

// Interface para garantir a tipagem do seu documento
export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  image: string;
  quantity: number;
  soldQuantity: number;
  type: string;
}

const ProductSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  soldQuantity: { 
    type: Number, 
    default: 0 
  },
  type: { 
    type: String, 
    default: 'product' 
  },
}, {
  // Adiciona os campos createdAt e updatedAt automaticamente
  timestamps: true 
});

// Evita que o modelo seja recompilado em cada hot-reload do Next.js
export default models.Product || model<IProduct>('Product', ProductSchema);