import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import type { Space, Post, Idea, User } from './types';

// Helper to convert Firestore timestamp to Date
const convertTimestamp = (data: any) => {
    const convert = (obj: any) => {
        for (const key in obj) {
            if (obj[key] instanceof Timestamp) {
                obj[key] = obj[key].toDate();
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                convert(obj[key]);
            }
        }
        return obj;
    }
    return convert(data);
};


// Fetch all spaces for the dashboard
export const getSpaces = async (): Promise<Space[]> => {
    const spacesCol = collection(db, 'spaces');
    const spacesSnapshot = await getDocs(spacesCol);
    
    const spaceList = await Promise.all(spacesSnapshot.docs.map(async (d) => {
        const spaceData = d.data();
        const spaceId = d.id;

        const postsCol = collection(db, 'spaces', spaceId, 'posts');
        const ideasCol = collection(db, 'spaces', spaceId, 'ideas');
        const postsSnapshot = await getDocs(postsCol);
        const ideasSnapshot = await getDocs(ideasCol);

        return {
            id: spaceId,
            name: spaceData.name,
            team: spaceData.team,
            posts: postsSnapshot.docs.map(postDoc => convertTimestamp({ id: postDoc.id, ...postDoc.data() })) as Post[],
            ideas: ideasSnapshot.docs.map(ideaDoc => ({ id: ideaDoc.id, ...ideaDoc.data() })) as Idea[],
            inviteToken: spaceData.inviteToken,
        } as Space;
    }));

    return spaceList;
};

// Fetch a single space by its ID
export const getSpaceById = async (spaceId: string): Promise<Space | null> => {
    const spaceRef = doc(db, 'spaces', spaceId);
    const spaceSnap = await getDoc(spaceRef);

    if (!spaceSnap.exists()) {
        return null;
    }

    const spaceData = spaceSnap.data();

    // Fetch subcollections
    const postsCol = collection(db, 'spaces', spaceId, 'posts');
    const ideasCol = collection(db, 'spaces', spaceId, 'ideas');

    const postsSnapshot = await getDocs(postsCol);
    const ideasSnapshot = await getDocs(ideasCol);

    const posts = postsSnapshot.docs.map(d => convertTimestamp({ id: d.id, ...d.data() })) as Post[];
    const ideas = ideasSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Idea[];

    return {
        id: spaceSnap.id,
        name: spaceData.name,
        team: spaceData.team,
        posts,
        ideas,
        inviteToken: spaceData.inviteToken,
    } as Space;
};

// Add a new space
export const addSpace = async (spaceData: { name: string; team: User[] }): Promise<Space> => {
    const spacesCol = collection(db, 'spaces');
    const docRef = await addDoc(spacesCol, {
        ...spaceData,
        createdAt: serverTimestamp(),
        inviteToken: `${spaceData.name.slice(0,4).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    });
    
    const newSpaceDoc = await getDoc(docRef);
    const newSpaceData = newSpaceDoc.data();

    return {
        id: docRef.id,
        name: spaceData.name,
        team: spaceData.team,
        posts: [],
        ideas: [],
        inviteToken: newSpaceData?.inviteToken,
    } as Space;
}
