import React, { createContext, useContext, useState, useCallback } from "react";
import { db } from "../utils/dbConfig"; // Adjust the path to your dbConfig
import { Users, Records, HealthProfessionals, Subscriptions, SubscriptionTransactions } from "../utils/schema"; // Adjust the path to your schema definitions
import { eq } from "drizzle-orm";

// Create a context 
const StateContext = createContext();

// Provider component
export const StateContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [healthProfessionals, setHealthProfessionals] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  // Function to fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      const result = await db.select().from(Users).execute();
      setUsers(result);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  // Function to fetch user details by email
  const fetchUserByEmail = useCallback(async (email) => {
    try {
      const result = await db
        .select()
        .from(Users)
        .where(eq(Users.createdBy, email))
        .execute();
      if (result.length > 0) {
        setCurrentUser(result[0]);
      }
    } catch (error) {
      console.error("Error fetching user by email:", error);
    }
  }, []);

  // Function to create a new user
  const createUser = useCallback(async (userData) => {
    try {
      const newUser = await db
        .insert(Users)
        .values(userData)
        .returning({ id: Users.id, createdBy: Users.createdBy })
        .execute();
      setUsers((prevUsers) => [...prevUsers, newUser[0]]);
      return newUser[0];
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }, []);

  // Function to fetch all records for a specific user
  const fetchUserRecords = useCallback(async (userEmail) => {
    try {
      const result = await db
        .select()
        .from(Records)
        .where(eq(Records.createdBy, userEmail))
        .execute();
      setRecords(result);
    } catch (error) {
      console.error("Error fetching user records:", error);
    }
  }, []);

  // Function to create a new record
  const createRecord = useCallback(async (recordData) => {
    try {
      const newRecord = await db
        .insert(Records)
        .values(recordData)
        .returning({ id: Records.id })
        .execute();
      setRecords((prevRecords) => [...prevRecords, newRecord[0]]);
      return newRecord[0];
    } catch (error) {
      console.error("Error creating record:", error);
      return null;
    }
  }, []);

  const updateRecord = useCallback(async (recordData) => {
    try {
      const { documentID, ...dataToUpdate } = recordData;
      console.log(documentID, dataToUpdate);
      const updatedRecords = await db
        .update(Records)
        .set(dataToUpdate)
        .where(eq(Records.id, documentID))
        .returning();
    } catch (error) {
      console.error("Error updating record:", error);
      return null;
    }
  }, []);

  // Health Professionals functions
  const fetchHealthProfessionals = useCallback(async () => {
    try {
      const result = await db.select().from(HealthProfessionals).execute();
      setHealthProfessionals(result);
    } catch (error) {
      console.error("Error fetching health professionals:", error);
    }
  }, []);

  const createHealthProfessional = useCallback(async (professionalData) => {
    try {
      const newProfessional = await db
        .insert(HealthProfessionals)
        .values(professionalData)
        .returning()
        .execute();
      setHealthProfessionals((prev) => [...prev, newProfessional[0]]);
      return newProfessional[0];
    } catch (error) {
      console.error("Error creating health professional:", error);
      return null;
    }
  }, []);

  const updateHealthProfessional = useCallback(async (id, professionalData) => {
    try {
      const updatedProfessional = await db
        .update(HealthProfessionals)
        .set(professionalData)
        .where(eq(HealthProfessionals.id, id))
        .returning()
        .execute();
      setHealthProfessionals((prev) =>
        prev.map((prof) => (prof.id === id ? updatedProfessional[0] : prof))
      );
      return updatedProfessional[0];
    } catch (error) {
      console.error("Error updating health professional:", error);
      return null;
    }
  }, []);

  // Subscription functions
  const fetchUserSubscriptions = useCallback(async (userId) => {
    try {
      const result = await db
        .select()
        .from(Subscriptions)
        .where(eq(Subscriptions.userId, userId))
        .execute();
      setSubscriptions(result);
    } catch (error) {
      console.error("Error fetching user subscriptions:", error);
    }
  }, []);

  const createSubscription = useCallback(async (subscriptionData) => {
    try {
      const newSubscription = await db
        .insert(Subscriptions)
        .values({
          ...subscriptionData,
          startDate: subscriptionData.startDate instanceof Date ? subscriptionData.startDate : new Date(subscriptionData.startDate),
          endDate: subscriptionData.endDate instanceof Date ? subscriptionData.endDate : new Date(subscriptionData.endDate),
        })
        .returning()
        .execute();
      setSubscriptions((prev) => [...prev, newSubscription[0]]);
      return newSubscription[0];
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error; // Rethrow the error so it can be caught in the component
    }
  }, []);

  const updateSubscription = useCallback(async (id, subscriptionData) => {
    try {
      const updatedSubscription = await db
        .update(Subscriptions)
        .set(subscriptionData)
        .where(eq(Subscriptions.id, id))
        .returning()
        .execute();
      setSubscriptions((prev) =>
        prev.map((sub) => (sub.id === id ? updatedSubscription[0] : sub))
      );
      return updatedSubscription[0];
    } catch (error) {
      console.error("Error updating subscription:", error);
      return null;
    }
  }, []);

  // Subscription Transaction function
  const createSubscriptionTransaction = useCallback(async (transactionData) => {
    try {
      const newTransaction = await db
        .insert(SubscriptionTransactions)
        .values(transactionData)
        .returning()
        .execute();
      return newTransaction[0];
    } catch (error) {
      console.error("Error creating subscription transaction:", error);
      throw error;
    }
  }, []);

  return (
    <StateContext.Provider
      value={{
        users,
        records,
        fetchUsers,
        fetchUserByEmail,
        createUser,
        fetchUserRecords,
        createRecord,
        currentUser,
        updateRecord,
        healthProfessionals,
        subscriptions,
        fetchHealthProfessionals,
        createHealthProfessional,
        updateHealthProfessional,
        fetchUserSubscriptions,
        createSubscription,
        updateSubscription,
        createSubscriptionTransaction,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Custom hook to use the context
export const useStateContext = () => useContext(StateContext);
