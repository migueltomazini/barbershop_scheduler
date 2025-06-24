// scripts/seed.ts
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../lib/mongoose';
import Service from '../models/Service';
import Product from '../models/Product';
import User from '../models/User';
import Appointment from '../models/Appointment';

import dbData from '../db.json';

async function seedDatabase() {
  await connectDB();
  console.log('Conectado ao banco de dados para o seed.');

  try {
    console.log('Limpando coleções antigas...');
    await Appointment.deleteMany({});
    await Service.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Coleções limpas.');

    console.log('Inserindo Produtos...');
    await Product.insertMany(dbData.products);
    console.log('Produtos inseridos.');
    
    // MUDANÇA IMPORTANTE AQUI:
    // Vamos criar os usuários e serviços e garantir que temos a referência correta.
    console.log('Inserindo Usuários e Serviços...');
    const usersToInsert = dbData.users.map(user => ({
      ...user,
      address: typeof user.address === 'object' ? user.address : undefined,
    }));
    
    // Usamos 'create' para ter acesso aos documentos recém-criados
    const createdUsers = await User.create(usersToInsert);
    const createdServices = await Service.create(dbData.services);
    console.log('Usuários e Serviços inseridos.');

    // CORREÇÃO NO MAPEAMENTO DE IDs:
    // Agora mapeamos o ID antigo (do JSON) para o _id novo (do MongoDB)
    const userIdMap = new Map();
    dbData.users.forEach((userJson, index) => {
      userIdMap.set(userJson.id, createdUsers[index]._id);
    });

    const serviceIdMap = new Map();
    dbData.services.forEach((serviceJson, index) => {
      serviceIdMap.set(serviceJson.id, createdServices[index]._id);
    });
    console.log('Mapa de IDs criado corretamente.');

    console.log('Processando e Inserindo Agendamentos (Appointments)...');

    const appointmentsToInsert = dbData.appointments.map(appt => {
      const [year, month, day] = appt.date.split('-').map(Number);
      const [hour, minute] = appt.time.split(':').map(Number);
      const appointmentDate = new Date(year, month - 1, day, hour, minute);

      // A lógica aqui continua a mesma, mas agora o .get() vai funcionar
      return {
        user: userIdMap.get(appt.clientId),
        service: serviceIdMap.get(appt.serviceId),
        date: appointmentDate,
        status: appt.status.toLowerCase(),
      };
    }).filter(appt => appt.user && appt.service);

    if (appointmentsToInsert.length > 0) {
        await Appointment.insertMany(appointmentsToInsert);
        console.log(`${appointmentsToInsert.length} agendamentos inseridos.`);
    } else {
        console.log('Nenhum agendamento válido para inserir. Verifique os IDs em db.json.');
    }

    console.log('Seed completo e realizado com sucesso!');

  } catch (error) {
    console.error('Erro ao realizar o seed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado do banco de dados.');
  }
}

seedDatabase();