export type ClientStatus = "ativo" | "inativo" | "suspenso" | "cancelado";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  document?: string;
  status: ClientStatus;
  plan?: string;
  totalNumbers: number;
  activeNumbers: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

export interface CreateClientInput {
  name: string;
  email: string;
  phone?: string;
  company: string;
  document?: string;
  plan?: string;
}

export interface UpdateClientInput {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  document?: string;
  status?: ClientStatus;
  plan?: string;
}

export interface ClientDetails extends Client {
  numbers?: {
    id: string;
    number: string;
    displayName: string;
    status: string;
  }[];
  billingInfo?: {
    plan: string;
    monthlyValue: number;
    nextBilling?: Date;
    paymentMethod?: string;
  };
}
