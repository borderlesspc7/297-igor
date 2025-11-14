import { db } from "../lib/firebaseconfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
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
  PhoneNumber,
  NumberDetails,
  CreateNumberInput,
  UpdateNumberInput,
  Interaction,
  HeatingPlan,
  NumberHealth,
  NumberStatus,
  InteractionType,
} from "../types/number";
import getFirebaseErrorMessage from "../components/ui/ErrorMessage";

interface FirebaseError {
  code?: string;
  message?: string;
}

// Helper para converter Timestamp do Firestore para Date
const convertTimestamp = (timestamp: Timestamp | Date | undefined): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  return timestamp.toDate();
};

// Helper para converter Date para Firestore Timestamp (se necessário)
const toFirestoreData = <T extends Record<string, unknown>>(
  data: T
): Partial<T> => {
  const converted = { ...data };

  // Converter Date para serverTimestamp() será feito nas operações de write
  // Remover campos undefined
  Object.keys(converted).forEach((key) => {
    if (converted[key] === undefined) {
      delete converted[key];
    }
  });

  return converted;
};

// Converter documento do Firestore para PhoneNumber
const convertFirestoreNumber = (
  doc: QueryDocumentSnapshot<DocumentData>
): PhoneNumber => {
  const data = doc.data();
  return {
    id: doc.id,
    number: data.number || "",
    displayName: data.displayName || "",
    profilePhoto: data.profilePhoto,
    company: data.company || "",
    status: data.status || "pausado",
    operator: data.operator,
    heatingStartDate: convertTimestamp(data.heatingStartDate),
    lastActivity: convertTimestamp(data.lastActivity),
    progressPercent: data.progressPercent || 0,
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
  };
};

export const numberService = {
  // Listar todos os números
  async list(): Promise<PhoneNumber[]> {
    try {
      const numbersRef = collection(db, "numbers");
      const q = query(numbersRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(convertFirestoreNumber);
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao listar números: ${message}`);
    }
  },

  // Buscar número por ID (com detalhes completos)
  async getById(id: string): Promise<NumberDetails | null> {
    try {
      const numberRef = doc(db, "numbers", id);
      const numberDoc = await getDoc(numberRef);

      if (!numberDoc.exists()) {
        return null;
      }

      const numberData = convertFirestoreNumber(
        numberDoc as QueryDocumentSnapshot<DocumentData>
      );

      // Buscar plano de aquecimento
      let heatingPlan: HeatingPlan | undefined;
      const planRef = collection(db, "numbers", id, "heatingPlans");
      const planSnapshot = await getDocs(
        query(planRef, orderBy("createdAt", "desc"))
      );

      if (!planSnapshot.empty) {
        const planDoc = planSnapshot.docs[0];
        const planData = planDoc.data();
        heatingPlan = {
          id: planDoc.id,
          numberId: id,
          dailyMessageLimit: planData.dailyMessageLimit || 0,
          weeklyMessageLimit: planData.weeklyMessageLimit || 0,
          messageTypes: planData.messageTypes || [],
          interactionRequirements: planData.interactionRequirements || {},
          createdAt: convertTimestamp(planData.createdAt),
          updatedAt: convertTimestamp(planData.updatedAt),
        };
      }

      // Buscar saúde do número
      let health: NumberHealth | undefined;
      const healthRef = doc(db, "numbers", id, "health", "current");
      const healthDoc = await getDoc(healthRef);

      if (healthDoc.exists()) {
        const healthData = healthDoc.data();
        health = {
          numberId: id,
          responseRate: healthData.responseRate || 0,
          blockRate: healthData.blockRate || 0,
          averageMessagesPerDay: healthData.averageMessagesPerDay || 0,
          formatDiversity: healthData.formatDiversity || {
            text: 0,
            audio: 0,
            image: 0,
            video: 0,
          },
          lastCalculated: convertTimestamp(healthData.lastCalculated),
        };
      }

      // Buscar interações
      const interactionsRef = collection(db, "numbers", id, "interactions");
      const interactionsQuery = query(
        interactionsRef,
        orderBy("timestamp", "desc")
      );
      const interactionsSnapshot = await getDocs(interactionsQuery);

      const interactions: Interaction[] = interactionsSnapshot.docs.map(
        (doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            numberId: id,
            type: data.type as InteractionType,
            description: data.description || "",
            metadata: data.metadata,
            timestamp: convertTimestamp(data.timestamp),
            createdBy: data.createdBy,
          };
        }
      );

      return {
        ...numberData,
        heatingPlan,
        health,
        interactions,
      };
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao buscar número: ${message}`);
    }
  },

  // Criar novo número
  async create(input: CreateNumberInput): Promise<PhoneNumber> {
    try {
      const numbersRef = collection(db, "numbers");

      const newNumberData = {
        ...input,
        status: "pausado" as NumberStatus,
        progressPercent: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(numbersRef, newNumberData);

      // Buscar o documento criado para retornar com timestamps convertidos
      const createdDoc = await getDoc(docRef);
      if (!createdDoc.exists()) {
        throw new Error("Erro ao criar número no banco de dados");
      }

      return convertFirestoreNumber(
        createdDoc as QueryDocumentSnapshot<DocumentData>
      );
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao criar número: ${message}`);
    }
  },

  // Atualizar número
  async update(
    id: string,
    input: UpdateNumberInput
  ): Promise<PhoneNumber | null> {
    try {
      const numberRef = doc(db, "numbers", id);
      const numberDoc = await getDoc(numberRef);

      if (!numberDoc.exists()) {
        return null;
      }

      const updateData = toFirestoreData({
        ...input,
        updatedAt: serverTimestamp(),
      });

      await updateDoc(numberRef, updateData);

      // Retornar o documento atualizado
      const updatedDoc = await getDoc(numberRef);
      return convertFirestoreNumber(
        updatedDoc as QueryDocumentSnapshot<DocumentData>
      );
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao atualizar número: ${message}`);
    }
  },

  // Atualizar status (Pausar/Reaquecer)
  async updateStatus(
    id: string,
    status: NumberStatus
  ): Promise<PhoneNumber | null> {
    return this.update(id, { status });
  },

  // Deletar número
  async delete(id: string): Promise<void> {
    try {
      const numberRef = doc(db, "numbers", id);
      await deleteDoc(numberRef);
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao deletar número: ${message}`);
    }
  },

  // Registrar interação manual
  async registerInteraction(
    numberId: string,
    interaction: Omit<Interaction, "id" | "numberId" | "timestamp">
  ): Promise<Interaction> {
    try {
      const interactionsRef = collection(
        db,
        "numbers",
        numberId,
        "interactions"
      );

      const interactionData = {
        ...interaction,
        timestamp: serverTimestamp(),
      };

      const docRef = await addDoc(interactionsRef, interactionData);

      // Atualizar lastActivity do número
      const numberRef = doc(db, "numbers", numberId);
      await updateDoc(numberRef, {
        lastActivity: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Buscar o documento criado
      const createdDoc = await getDoc(docRef);
      if (!createdDoc.exists()) {
        throw new Error("Erro ao registrar interação");
      }

      const data = createdDoc.data();
      return {
        id: createdDoc.id,
        numberId,
        type: data.type as InteractionType,
        description: data.description || "",
        metadata: data.metadata,
        timestamp: convertTimestamp(data.timestamp),
        createdBy: data.createdBy,
      };
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao registrar interação: ${message}`);
    }
  },

  // Buscar histórico de interações
  async getInteractions(
    numberId: string,
    limit?: number
  ): Promise<Interaction[]> {
    try {
      const interactionsRef = collection(
        db,
        "numbers",
        numberId,
        "interactions"
      );
      const q = query(interactionsRef, orderBy("timestamp", "desc"));

      if (limit) {
        // Firestore não tem limit simples, seria necessário usar startAfter
        // Por enquanto, buscamos todos e limitamos no código
      }

      const querySnapshot = await getDocs(q);

      const interactions = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          numberId,
          type: data.type as InteractionType,
          description: data.description || "",
          metadata: data.metadata,
          timestamp: convertTimestamp(data.timestamp),
          createdBy: data.createdBy,
        };
      });

      return limit ? interactions.slice(0, limit) : interactions;
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao buscar interações: ${message}`);
    }
  },

  // Configurar plano de aquecimento
  async setHeatingPlan(
    numberId: string,
    plan: Omit<HeatingPlan, "id" | "numberId" | "createdAt" | "updatedAt">
  ): Promise<HeatingPlan> {
    try {
      const plansRef = collection(db, "numbers", numberId, "heatingPlans");

      const planData = {
        ...plan,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(plansRef, planData);

      // Buscar o documento criado
      const createdDoc = await getDoc(docRef);
      if (!createdDoc.exists()) {
        throw new Error("Erro ao configurar plano");
      }

      const data = createdDoc.data();
      return {
        id: createdDoc.id,
        numberId,
        dailyMessageLimit: data.dailyMessageLimit || 0,
        weeklyMessageLimit: data.weeklyMessageLimit || 0,
        messageTypes: data.messageTypes || [],
        interactionRequirements: data.interactionRequirements || {},
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      };
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao configurar plano: ${message}`);
    }
  },

  // Atualizar plano de aquecimento existente
  async updateHeatingPlan(
    numberId: string,
    planId: string,
    plan: Partial<Omit<HeatingPlan, "id" | "numberId" | "createdAt">>
  ): Promise<HeatingPlan> {
    try {
      const planRef = doc(db, "numbers", numberId, "heatingPlans", planId);

      const updateData = toFirestoreData({
        ...plan,
        updatedAt: serverTimestamp(),
      });

      await updateDoc(planRef, updateData);

      // Buscar o documento atualizado
      const updatedDoc = await getDoc(planRef);
      if (!updatedDoc.exists()) {
        throw new Error("Plano não encontrado");
      }

      const data = updatedDoc.data();
      return {
        id: updatedDoc.id,
        numberId,
        dailyMessageLimit: data.dailyMessageLimit || 0,
        weeklyMessageLimit: data.weeklyMessageLimit || 0,
        messageTypes: data.messageTypes || [],
        interactionRequirements: data.interactionRequirements || {},
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      };
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao atualizar plano: ${message}`);
    }
  },

  // Salvar/atualizar saúde do número
  async saveNumberHealth(
    numberId: string,
    health: Omit<NumberHealth, "numberId" | "lastCalculated">
  ): Promise<NumberHealth> {
    try {
      const healthRef = doc(db, "numbers", numberId, "health", "current");

      const healthData = {
        ...health,
        lastCalculated: serverTimestamp(),
      };

      await setDoc(healthRef, healthData, { merge: true });

      // Buscar o documento salvo
      const savedDoc = await getDoc(healthRef);
      if (!savedDoc.exists()) {
        throw new Error("Erro ao salvar saúde do número");
      }

      const data = savedDoc.data();
      return {
        numberId,
        responseRate: data.responseRate || 0,
        blockRate: data.blockRate || 0,
        averageMessagesPerDay: data.averageMessagesPerDay || 0,
        formatDiversity: data.formatDiversity || {
          text: 0,
          audio: 0,
          image: 0,
          video: 0,
        },
        lastCalculated: convertTimestamp(data.lastCalculated),
      };
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao salvar saúde do número: ${message}`);
    }
  },

  // Buscar números por status
  async listByStatus(status: NumberStatus): Promise<PhoneNumber[]> {
    try {
      const numbersRef = collection(db, "numbers");
      const q = query(
        numbersRef,
        where("status", "==", status),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(convertFirestoreNumber);
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao listar números por status: ${message}`);
    }
  },

  // Buscar números por empresa
  async listByCompany(company: string): Promise<PhoneNumber[]> {
    try {
      const numbersRef = collection(db, "numbers");
      const q = query(
        numbersRef,
        where("company", "==", company),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(convertFirestoreNumber);
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error as FirebaseError);
      throw new Error(`Erro ao listar números por empresa: ${message}`);
    }
  },
};
