// app/types/index.ts

// --- Tipos de Autenticação e Usuário ---

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string; // Tornando opcional, como no modelo
};

// NOVO: Um tipo User simplificado que corresponde ao nosso modelo Mongoose
export interface User {
  _id: string; // MUDANÇA: Usamos _id, que vem do MongoDB
  name: string;
  email: string;
  phone: string;
  role: "client" | "admin";
  address?: Address;
  createdAt: string; // Mongoose adiciona timestamps como strings ISO
  updatedAt: string;
}

// NOVO: O tipo para a sessão que guardamos no cookie
export type SessionType = {
  userId: string;
  name: string;
  role: string;
};


// --- Tipos de Inventário (Produtos e Serviços) ---

export interface ProductType {
  _id: string; // MUDANÇA: Usamos _id
  name: string;
  description: string;
  price: number;
  quantity: number;
  soldQuantity?: number;
  image: string;
  type: "product";
}

export interface ServiceType {
  _id: string; // MUDANÇA: Usamos _id
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  icon?: string;
  type: "service";
}


// --- Tipos de Agendamento e Carrinho ---

// NOVO: O tipo Appointment agora reflete os dados "populados" do Mongoose
export interface Appointment {
  _id: string;
  date: string; // A data vem como uma string ISO do banco
  status: "scheduled" | "completed" | "canceled" | "cancelled";
  // Em vez de IDs e nomes separados, temos objetos aninhados
  user: {
    _id: string;
    name: string;
  };
  service: {
    _id: string;
    name: string;
  };
}

// NOVO: Um tipo para os itens do carrinho, que estava faltando
export interface CartItem {
  id: string; // Aqui usamos o _id do produto/serviço
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: "product" | "service";
  description?: string;
  // Campos específicos para agendamento
  date?: string;
  time?: string;
}
