import { db } from "../lib/firebaseconfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import type {
  Client,
  ClientDetails,
  CreateClientInput,
  UpdateClientInput,
  ClientStatus,
} from "../types/client";
import getFirebaseErrorMessage from "../components/ui/ErrorMessage";

interface FirebaseError {
  code?: string;
  message?: string;
}

const convertTimestamp = (timestamp: Timestamp | Date | undefined): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  return timestamp.toDate();
};

const convertFirestoreClient = (
  doc: QueryDocumentSnapshot<DocumentData>
): Client => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name || "",
    email: data.email || "",
    phone: data.phone,
    company: data.company || "",
    document: data.document,
    status: data.status || "ativo",
    plan: data.plan,
    totalNumbers: data.totalNumbers || 0,
    activeNumbers: data.activeNumbers || 0,
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
    createdBy: data.createdBy,
  };
};

export const clientService = {
  async list(): Promise<Client[]> {
    try {
      const clientsRef = collection(db, "clients");
      const q = query(clientsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(convertFirestoreClient);
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao listar clientes: ${message}`);
    }
  },

  async getById(id: string): Promise<ClientDetails | null> {
    try {
      const clientRef = doc(db, "clients", id);
      const clientDoc = await getDoc(clientRef);

      if (!clientDoc.exists()) {
        return null;
      }

      const clientData = convertFirestoreClient(
        clientDoc as QueryDocumentSnapshot<DocumentData>
      );

      // Buscar números associados ao cliente
      const numbersRef = collection(db, "numbers");
      const numbersQuery = query(
        numbersRef,
        where("company", "==", clientData.company),
        orderBy("createdAt", "desc")
      );
      const numbersSnapshot = await getDocs(numbersQuery);

      const numbers = numbersSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          number: data.number || "",
          displayName: data.displayName || "",
          status: data.status || "pausado",
        };
      });

      // Buscar informações de billing se existir
      let billingInfo;
      const billingRef = doc(db, "clients", id, "billing", "current");
      const billingDoc = await getDoc(billingRef);

      if (billingDoc.exists()) {
        const billingData = billingDoc.data();
        billingInfo = {
          plan: billingData.plan || clientData.plan || "",
          monthlyValue: billingData.monthlyValue || 0,
          nextBilling: convertTimestamp(billingData.nextBilling),
          paymentMethod: billingData.paymentMethod,
        };
      }

      return {
        ...clientData,
        numbers,
        billingInfo,
      };
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao buscar cliente: ${message}`);
    }
  },

  async create(input: CreateClientInput): Promise<Client> {
    try {
      const clientsRef = collection(db, "clients");

      const newClientData = {
        ...input,
        status: "ativo" as ClientStatus,
        totalNumbers: 0,
        activeNumbers: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(clientsRef, newClientData);

      const createdDoc = await getDoc(docRef);
      if (!createdDoc.exists()) {
        throw new Error("Erro ao criar cliente no banco de dados");
      }

      return convertFirestoreClient(
        createdDoc as QueryDocumentSnapshot<DocumentData>
      );
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao criar cliente: ${message}`);
    }
  },

  async update(id: string, input: UpdateClientInput): Promise<Client | null> {
    try {
      const clientRef = doc(db, "clients", id);
      const clientDoc = await getDoc(clientRef);

      if (!clientDoc.exists()) {
        return null;
      }

      const updateData: Record<string, unknown> = {
        ...input,
        updatedAt: serverTimestamp(),
      };

      // Remove campos undefined
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      await updateDoc(clientRef, updateData);

      const updatedDoc = await getDoc(clientRef);
      return convertFirestoreClient(
        updatedDoc as QueryDocumentSnapshot<DocumentData>
      );
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao atualizar cliente: ${message}`);
    }
  },

  async updateStatus(id: string, status: ClientStatus): Promise<Client | null> {
    return this.update(id, { status });
  },

  async delete(id: string): Promise<void> {
    try {
      const clientRef = doc(db, "clients", id);
      await deleteDoc(clientRef);
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao deletar cliente: ${message}`);
    }
  },

  async listByStatus(status: ClientStatus): Promise<Client[]> {
    try {
      const clientsRef = collection(db, "clients");
      const q = query(
        clientsRef,
        where("status", "==", status),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(convertFirestoreClient);
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao listar clientes por status: ${message}`);
    }
  },

  async searchByCompany(company: string): Promise<Client[]> {
    try {
      const clientsRef = collection(db, "clients");
      const q = query(
        clientsRef,
        where("company", ">=", company),
        where("company", "<=", company + "\uf8ff"),
        orderBy("company"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(convertFirestoreClient);
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao buscar clientes: ${message}`);
    }
  },
};
