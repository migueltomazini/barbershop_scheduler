// models/Appointment.ts
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IAppointment extends Document {
  date: Date;
  status: string;
  user: mongoose.Schema.Types.ObjectId;
  service: mongoose.Schema.Types.ObjectId;
}

const AppointmentSchema: Schema = new Schema({
  date: { type: Date, required: true },
  status: { 
    type: String, 
    required: true, 
    // CORREÇÃO AQUI: Adicionamos 'cancelled' para aceitar os dados do seu db.json
    enum: ['scheduled', 'completed', 'canceled', 'cancelled'] 
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
}, {
  timestamps: true
});

export default models.Appointment || model<IAppointment>('Appointment', AppointmentSchema);