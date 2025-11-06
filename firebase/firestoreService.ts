
import { db } from './firebaseConfig';
import { doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { UserProfile, ScanHistoryItem } from '../types';

// USERS Collection
const USERS_COLLECTION = 'users';

/**
 * Creates or updates a user's profile in Firestore.
 * @param uid The user's unique ID from Firebase Auth.
 * @param email The user's email.
 * @param profileData The user profile data (displayName, age).
 */
export const updateUserProfile = async (uid: string, email: string, profileData: UserProfile): Promise<void> => {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(userDocRef, {
        email,
        ...profileData,
    }, { merge: true }); // merge: true prevents overwriting other fields if they exist
};

/**
 * Retrieves a user's profile from Firestore.
 * @param uid The user's unique ID.
 * @returns The user's profile data, or null if not found.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            displayName: data.displayName,
            age: data.age,
        };
    } else {
        console.log("No such user profile!");
        return null;
    }
};

// SCANS Subcollection (nested under a user)
const SCANS_COLLECTION = 'scans';

/**
 * Adds a new scan result to a user's history in Firestore as a subcollection.
 * @param userId The ID of the user performing the scan.
 * @param scanData The data for the scan (symptoms, analysis, etc.).
 */
export const addScanToHistory = async (userId: string, scanData: Omit<ScanHistoryItem, 'id' | 'userId' | 'timestamp'>): Promise<void> => {
    try {
        const scansCollectionRef = collection(db, USERS_COLLECTION, userId, SCANS_COLLECTION);
        await addDoc(scansCollectionRef, {
            ...scanData,
            timestamp: serverTimestamp(), // Use server timestamp for consistency
        });
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Could not save scan to history.");
    }
};

/**
 * Retrieves a user's scan history from their subcollection in Firestore, ordered by most recent.
 * @param userId The ID of the user.
 * @returns An array of scan history items.
 */
export const getScanHistory = async (userId: string): Promise<ScanHistoryItem[]> => {
    const scansCollectionRef = collection(db, USERS_COLLECTION, userId, SCANS_COLLECTION);
    const scansQuery = query(
        scansCollectionRef,
        orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(scansQuery);
    const history: ScanHistoryItem[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        history.push({
            id: doc.id,
            userId: userId, // The userId is from the path, not the document
            symptoms: data.symptoms,
            analysis: data.analysis,
            // Convert Firestore Timestamp to JS Date
            timestamp: (data.timestamp as Timestamp).toDate(),
            images: data.images,
            ageAtScan: data.ageAtScan
        });
    });

    return history;
};
