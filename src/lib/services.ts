
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, Timestamp, query, where, writeBatch } from "firebase/firestore";
import type { Space, Post, Idea, User, AppUser, Notification } from './types';

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

// Fetch user profile from Firestore
export const getUserProfile = async (userId: string): Promise<AppUser | null> => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return { uid: userSnap.id, ...userSnap.data() } as AppUser;
    }
    return null;
}

// Fetch all spaces for the dashboard for a given user
export const getSpaces = async (userId: string): Promise<Space[]> => {
    const spacesCol = collection(db, 'spaces');
    const q = query(spacesCol, where('memberIds', 'array-contains', userId));
    const spacesSnapshot = await getDocs(q);
    
    const spaceList = await Promise.all(spacesSnapshot.docs.map(async (d) => {
        const spaceData = d.data();
        const spaceId = d.id;

        const postsCol = collection(db, 'spaces', spaceId, 'posts');
        const ideasCol = collection(db, 'spaces', spaceId, 'ideas');
        const postsSnapshot = await getDocs(postsCol);
        const ideasSnapshot = await getDocs(ideasCol);

        return {
            id: spaceId,
            ...spaceData,
            posts: postsSnapshot.docs.map(postDoc => convertTimestamp({ id: postDoc.id, ...postDoc.data() }) as Post),
            ideas: ideasSnapshot.docs.map(ideaDoc => ({ id: ideaDoc.id, ...ideaDoc.data() }) as Idea),
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

    const postsCol = collection(db, 'spaces', spaceId, 'posts');
    const ideasCol = collection(db, 'spaces', spaceId, 'ideas');

    const postsSnapshot = await getDocs(postsCol);
    const ideasSnapshot = await getDocs(ideasCol);

    const posts = postsSnapshot.docs.map(d => convertTimestamp({ id: d.id, ...d.data() }) as Post);
    const ideas = ideasSnapshot.docs.map(d => ({ id: d.id, ...d.data() }) as Idea);

    return {
        id: spaceSnap.id,
        ...spaceData,
        posts,
        ideas,
    } as Space;
};

// Add a new space
export const addSpace = async (spaceData: { name: string; team: User[], memberIds: string[] }): Promise<Space> => {
    const spacesCol = collection(db, 'spaces');
    const docRef = await addDoc(spacesCol, {
        ...spaceData,
        createdAt: serverTimestamp(),
        inviteToken: `${spaceData.name.slice(0,4).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    });
    
    const newSpaceDoc = await getDoc(docRef);
    const newSpaceData = newSpaceDoc.data();

    return {
        id: docRef.id,
        ...newSpaceData,
        posts: [],
        ideas: [],
    } as Space;
};

// Add a user to a space using an invite token and regenerate the token
export const joinSpaceWithToken = async (userId: string, token: string): Promise<Space | null> => {
    const spacesRef = collection(db, 'spaces');
    const q = query(spacesRef, where('inviteToken', '==', token));
    const spaceSnapshot = await getDocs(q);

    if (spaceSnapshot.empty) {
        throw new Error("رمز دعوة غير صالح.");
    }
    
    const spaceDoc = spaceSnapshot.docs[0];
    const spaceData = spaceDoc.data() as Space;

    if (spaceData.memberIds.length >= 3) {
        throw new Error("مساحة العمل هذه ممتلئة بالفعل.");
    }
    
    if (spaceData.memberIds.includes(userId)) {
        throw new Error("أنت عضو بالفعل في مساحة العمل هذه.");
    }

    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
        throw new Error("لم يتم العثور على ملف تعريف المستخدم.");
    }

    const user: User = { id: userProfile.uid, name: userProfile.name, avatarUrl: userProfile.avatarUrl };
    
    const spaceRef = doc(db, 'spaces', spaceDoc.id);
    
    const updatedTeam = [...spaceData.team, user];
    const updatedMemberIds = [...spaceData.memberIds, userId];

    const newInviteToken = updatedMemberIds.length < 3
        ? `${spaceData.name.slice(0,4).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
        : null;

    await updateDoc(spaceRef, {
        team: updatedTeam,
        memberIds: updatedMemberIds,
        inviteToken: newInviteToken
    });

    return getSpaceById(spaceDoc.id);
}


// Add a new Post to a space
export const addPost = async (spaceId: string, postData: Omit<Post, 'id'>): Promise<Post> => {
    const postsCol = collection(db, 'spaces', spaceId, 'posts');
    const docRef = await addDoc(postsCol, { ...postData, scheduledAt: Timestamp.fromDate(postData.scheduledAt as Date) });
    const newPostDoc = await getDoc(docRef);
    return convertTimestamp({ id: newPostDoc.id, ...newPostDoc.data() }) as Post;
}

// Update an existing Post
export const updatePost = async (spaceId: string, postId: string, postData: Partial<Post>): Promise<void> => {
    const postRef = doc(db, 'spaces', spaceId, 'posts', postId);
    const dataToUpdate = { ...postData };
    if (dataToUpdate.scheduledAt instanceof Date) {
        dataToUpdate.scheduledAt = Timestamp.fromDate(dataToUpdate.scheduledAt);
    }
    await updateDoc(postRef, dataToUpdate);
}

// Add a new Idea to a space
export const addIdea = async (spaceId: string, ideaData: Omit<Idea, 'id'>): Promise<Idea> => {
    const ideasCol = collection(db, 'spaces', spaceId, 'ideas');
    const docRef = await addDoc(ideasCol, ideaData);
    
    const space = await getSpaceById(spaceId);
    if (space) {
        const batch = writeBatch(db);
        const notificationsCol = collection(db, 'notifications');
        space.memberIds.forEach(memberId => {
            if (memberId !== ideaData.createdBy.id) {
                const newNotifRef = doc(notificationsCol);
                batch.set(newNotifRef, {
                    userId: memberId,
                    message: `${ideaData.createdBy.name} أضاف فكرة جديدة في "${space.name}"`,
                    link: `/spaces/${spaceId}`,
                    read: false,
                    createdAt: serverTimestamp(),
                });
            }
        });
        await batch.commit();
    }
    
    return {
        id: docRef.id,
        ...ideaData
    }
}

// Update an existing Idea
export const updateIdea = async (spaceId: string, ideaId: string, content: string): Promise<void> => {
    const ideaRef = doc(db, 'spaces', spaceId, 'ideas', ideaId);
    await updateDoc(ideaRef, { content });
};


// Delete an idea from a space
export const deleteIdea = async (spaceId: string, ideaId: string): Promise<void> => {
    const ideaRef = doc(db, 'spaces', spaceId, 'ideas', ideaId);
    await deleteDoc(ideaRef);
}

// Delete a space (owner only)
export const deleteSpace = async (spaceId: string): Promise<void> => {
    const spaceRef = doc(db, 'spaces', spaceId);
    await deleteDoc(spaceRef);
};

// Leave a space
export const leaveSpace = async (spaceId: string, userId: string): Promise<void> => {
    const space = await getSpaceById(spaceId);
    if (!space) {
        throw new Error("لم يتم العثور على المساحة.");
    }
    
    const remainingTeam = space.team.filter(member => member.id !== userId);
    const remainingMemberIds = space.memberIds.filter(id => id !== userId);

    if (remainingMemberIds.length === 0) {
        await deleteSpace(spaceId);
    } else {
        const spaceRef = doc(db, 'spaces', spaceId);
        await updateDoc(spaceRef, {
            team: remainingTeam,
            memberIds: remainingMemberIds
        });
    }
};


// Fetch notifications for a user
export const getNotifications = async (userId: string): Promise<Notification[]> => {
    const notificationsCol = collection(db, 'notifications');
    const q = query(notificationsCol, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => convertTimestamp({ id: d.id, ...d.data() }) as Notification)
        .sort((a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime());
};

// Mark notifications as read
export const markNotificationsAsRead = async (notificationIds: string[]): Promise<void> => {
    const batch = writeBatch(db);
    notificationIds.forEach(id => {
        const notifRef = doc(db, 'notifications', id);
        batch.update(notifRef, { read: true });
    });
    await batch.commit();
};
