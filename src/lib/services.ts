
import { db, auth } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, Timestamp, query, where, writeBatch, runTransaction } from "firebase/firestore";
import type { Space, Post, Idea, User, AppUser, Notification, Invite, InviteToken } from './types';
import { updateProfile as firebaseUpdateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from 'firebase/auth';

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

// Update user profile in Auth and Firestore
export const updateProfile = async (userId: string, data: Partial<Pick<AppUser, 'name' | 'avatarUrl' | 'avatarColor' | 'avatarText'>>) => {
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.uid === userId) {
        // We only update displayName in auth, photoURL is no longer used from a URL.
        await firebaseUpdateProfile(currentUser, {
            displayName: data.name,
            photoURL: '', // Clear out photoURL
        });

        // Update Firestore user document
        const userRef = doc(db, "users", userId);
        const updateData: Partial<AppUser> = {};
        if (data.name) updateData.name = data.name;
        if (data.avatarColor) updateData.avatarColor = data.avatarColor;
        if (data.avatarText) updateData.avatarText = data.avatarText;
        updateData.avatarUrl = ''; // Ensure avatarUrl is empty
        
        await updateDoc(userRef, updateData);
    } else {
        throw new Error("User not authenticated or mismatch.");
    }
};

// Update user password
export const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    const user = auth.currentUser;
    if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        // Re-authenticate user before updating password
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
    } else {
         throw new Error("User not authenticated or email not available.");
    }
}

// Delete user account from Auth and Firestore
export const deleteUserAccount = async (): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User not authenticated.");
    }

    try {
        // First, delete the user's document from Firestore
        const userRef = doc(db, 'users', user.uid);
        await deleteDoc(userRef);

        // Then, delete the user from Firebase Authentication
        await deleteUser(user);
    } catch (error: any) {
        // Handle re-authentication if required for sensitive operations
        if (error.code === 'auth/requires-recent-login') {
            throw new Error('This operation is sensitive and requires recent authentication. Please sign out and sign back in to delete your account.');
        }
        console.error("Error deleting user account:", error);
        throw error;
    }
};


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
export const addSpace = async (spaceData: { name: string; description: string; team: User[], memberIds: string[] }): Promise<Space> => {
    const spaceDocRef = await addDoc(collection(db, 'spaces'), {
        ...spaceData,
        createdAt: serverTimestamp(),
    });
    
    const newSpaceDoc = await getDoc(spaceDocRef);
    const newSpaceData = newSpaceDoc.data();

    return {
        id: spaceDocRef.id,
        ...newSpaceData,
        posts: [],
        ideas: [],
    } as Space;
};

// Update space details
export const updateSpace = async (spaceId: string, name: string, description: string): Promise<void> => {
    const spaceRef = doc(db, 'spaces', spaceId);
    await updateDoc(spaceRef, { name, description });
};

// Add a new Post to a space
export const addPost = async (spaceId: string, postData: Omit<Post, 'id' | 'spaceId' | 'spaceName'>): Promise<Post> => {
    const postsCol = collection(db, 'spaces', spaceId, 'posts');
    const docRef = await addDoc(postsCol, { ...postData, scheduledAt: Timestamp.fromDate(postData.scheduledAt as Date) });
    const newPostDoc = await getDoc(docRef);
    return convertTimestamp({ id: newPostDoc.id, ...newPostDoc.data() }) as Post;
}

// Update an existing Post
export const updatePost = async (spaceId: string, postId: string, postData: Partial<Post>): Promise<void> => {
    const postRef = doc(db, 'spaces', spaceId, 'posts', postId);
    const dataToUpdate: { [key: string]: any } = { ...postData };
    if (dataToUpdate.scheduledAt instanceof Date) {
        dataToUpdate.scheduledAt = Timestamp.fromDate(dataToUpdate.scheduledAt);
    }
    // Remove space identifiers before updating subcollection document
    delete dataToUpdate.spaceId;
    delete dataToUpdate.spaceName;

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
    } as Idea
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

// --- Invitation System ---

// Create an invitation
export const createInvite = async (space: Space, fromUser: User, toEmail: string): Promise<void> => {
  // 1. Check if user is already a member
  const userQuery = query(collection(db, "users"), where("email", "==", toEmail));
  const userSnapshot = await getDocs(userQuery);
  if (!userSnapshot.empty) {
    const existingUserId = userSnapshot.docs[0].id;
    if (space.memberIds.includes(existingUserId)) {
      throw new Error("This user is already a member of the space.");
    }
  }

  // 2. Check for an existing pending invite
  const invitesRef = collection(db, 'invites');
  const existingInviteQuery = query(invitesRef, 
    where('spaceId', '==', space.id), 
    where('toEmail', '==', toEmail),
    where('status', '==', 'pending')
  );
  const existingInviteSnapshot = await getDocs(existingInviteQuery);
  if (!existingInviteSnapshot.empty) {
    throw new Error("An invitation has already been sent to this email address.");
  }
  
  // 3. Create the invite
  await addDoc(invitesRef, {
    spaceId: space.id,
    spaceName: space.name,
    fromUser,
    toEmail,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
};

// Get all pending invites for a user by email
export const getInvitesForUser = async (email: string): Promise<Invite[]> => {
  const invitesRef = collection(db, 'invites');
  const q = query(invitesRef, where('toEmail', '==', email), where('status', '==', 'pending'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => convertTimestamp({ id: d.id, ...d.data() }) as Invite);
};

// Accept an invitation
export const acceptInvite = async (inviteId: string, user: AppUser): Promise<void> => {
  await runTransaction(db, async (transaction) => {
    const inviteRef = doc(db, "invites", inviteId);
    const inviteDoc = await transaction.get(inviteRef);

    if (!inviteDoc.exists() || inviteDoc.data().toEmail !== user.email) {
      throw new Error("Invitation not found or invalid.");
    }
    
    const invite = inviteDoc.data() as Invite;
    const spaceRef = doc(db, "spaces", invite.spaceId);
    const spaceDoc = await transaction.get(spaceRef);
    
    if (!spaceDoc.exists()) {
        throw new Error("The invited space no longer exists.");
    }

    const spaceData = spaceDoc.data() as Space;

    if (spaceData.team.length >= 3) {
      throw new Error("This space is full.");
    }

    const newUser: User = {
        id: user.uid,
        name: user.name,
        avatarUrl: user.avatarUrl,
        avatarText: user.avatarText,
        avatarColor: user.avatarColor,
    };
    
    // Update space and invite in a transaction
    transaction.update(spaceRef, {
        memberIds: [...spaceData.memberIds, user.uid],
        team: [...spaceData.team, newUser]
    });
    transaction.update(inviteRef, { status: 'accepted' });

    // Create a notification for the inviter
    const notificationsCol = collection(db, 'notifications');
    const newNotifRef = doc(notificationsCol);
    transaction.set(newNotifRef, {
        userId: invite.fromUser.id,
        message: `${user.name} accepted your invitation to join "${invite.spaceName}"`,
        link: `/spaces/${invite.spaceId}`,
        read: false,
        createdAt: serverTimestamp(),
    });
  });
};

// Decline an invitation
export const declineInvite = async (inviteId: string): Promise<void> => {
  const inviteRef = doc(db, 'invites', inviteId);
  await updateDoc(inviteRef, { status: 'declined' });
};

// --- Token-Based Invitation System ---

// Generate secure 8-character token (excluding confusing characters)
const generateInviteToken = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude 0,1,I,O for clarity
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Check if token already exists
const isTokenUnique = async (token: string): Promise<boolean> => {
  const tokensRef = collection(db, 'inviteTokens');
  const q = query(tokensRef, where('token', '==', token), where('used', '==', false));
  const snapshot = await getDocs(q);
  return snapshot.empty;
};

// Generate unique invite token for a space
export const generateSpaceInviteToken = async (spaceId: string, ownerId: string): Promise<string> => {
  const user = auth.currentUser;
  if (!user || user.uid !== ownerId) {
    throw new Error("Only space owners can generate invite tokens.");
  }

  const space = await getSpaceById(spaceId);
  if (!space) {
    throw new Error("Space not found.");
  }

  if (space.team[0].id !== ownerId) {
    throw new Error("Only the space owner can generate invite tokens.");
  }

  if (space.team.length >= 3) {
    throw new Error("Space is full. Cannot generate invite token.");
  }

  // Generate unique token
  let token: string;
  let isUnique = false;
  let attempts = 0;
  
  do {
    token = generateInviteToken();
    isUnique = await isTokenUnique(token);
    attempts++;
  } while (!isUnique && attempts < 10);

  if (!isUnique) {
    throw new Error("Failed to generate unique token. Please try again.");
  }

  // Delete any existing unused tokens for this space
  const existingTokensRef = collection(db, 'inviteTokens');
  const existingQuery = query(existingTokensRef, 
    where('spaceId', '==', spaceId), 
    where('used', '==', false)
  );
  const existingSnapshot = await getDocs(existingQuery);
  const batch = writeBatch(db);
  existingSnapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  // Create new token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  const tokenData: Omit<InviteToken, 'id'> = {
    token,
    spaceId,
    spaceName: space.name,
    ownerId,
    ownerName: space.team[0].name,
    used: false,
    expiresAt: Timestamp.fromDate(expiresAt),
    createdAt: serverTimestamp() as Timestamp,
  };

  const tokenRef = doc(collection(db, 'inviteTokens'));
  batch.set(tokenRef, tokenData);
  
  // Update space with current invite token
  const spaceRef = doc(db, 'spaces', spaceId);
  batch.update(spaceRef, { inviteToken: token });

  await batch.commit();

  return token;
};

// Join space using invite token
export const joinSpaceWithToken = async (token: string, user: AppUser): Promise<Space> => {
  // First, find and validate the token outside of transaction
  const tokensRef = collection(db, 'inviteTokens');
  const tokenQuery = query(tokensRef, where('token', '==', token.toUpperCase()));
  const tokenSnapshot = await getDocs(tokenQuery);

  if (tokenSnapshot.empty) {
    throw new Error("Invalid invite code.");
  }

  const tokenDoc = tokenSnapshot.docs[0];
  const tokenData = convertTimestamp(tokenDoc.data()) as InviteToken;

  // Check if token is already used
  if (tokenData.used) {
    throw new Error("This invite code has already been used.");
  }

  // Check if token is expired
  const now = new Date();
  const expiresAt = tokenData.expiresAt as Date;
  if (now > expiresAt) {
    throw new Error("This invite code has expired.");
  }

  // Now run the transaction with the validated token
  return await runTransaction(db, async (transaction) => {
    // Get the space
    const spaceRef = doc(db, 'spaces', tokenData.spaceId);
    const spaceDoc = await transaction.get(spaceRef);

    if (!spaceDoc.exists()) {
      throw new Error("The invited space no longer exists.");
    }

    const spaceData = spaceDoc.data() as Space;

    // Check if user is already a member
    if (spaceData.memberIds.includes(user.uid)) {
      throw new Error("You are already a member of this space.");
    }

    // Check if space is full
    if (spaceData.team.length >= 3) {
      throw new Error("This space is full.");
    }

    const newUser: User = {
      id: user.uid,
      name: user.name,
      avatarUrl: user.avatarUrl,
      avatarText: user.avatarText,
      avatarColor: user.avatarColor,
    };

    // Update space with new member
    transaction.update(spaceRef, {
      memberIds: [...spaceData.memberIds, user.uid],
      team: [...spaceData.team, newUser],
      inviteToken: null, // Clear the invite token
    });

    // Mark token as used
    transaction.update(tokenDoc.ref, {
      used: true,
      usedBy: user.uid,
      usedAt: serverTimestamp(),
    });

    // Create notification for space owner
    const notificationsCol = collection(db, 'notifications');
    const newNotifRef = doc(notificationsCol);
    transaction.set(newNotifRef, {
      userId: tokenData.ownerId,
      message: `${user.name} joined "${tokenData.spaceName}" using your invite code`,
      link: `/spaces/${tokenData.spaceId}`,
      read: false,
      createdAt: serverTimestamp(),
    });

    return {
      ...spaceData,
      id: tokenData.spaceId,
      memberIds: [...spaceData.memberIds, user.uid],
      team: [...spaceData.team, newUser],
      posts: [], // Will be loaded separately
      ideas: [], // Will be loaded separately
    } as Space;
  });
};

// Validate invite token (without joining)
export const validateInviteToken = async (token: string): Promise<{ valid: boolean; spaceName?: string; ownerName?: string; error?: string }> => {
  try {
    console.log('Validating token:', token.toUpperCase());
    
    const tokensRef = collection(db, 'inviteTokens');
    const tokenQuery = query(tokensRef, where('token', '==', token.toUpperCase()));
    const tokenSnapshot = await getDocs(tokenQuery);

    console.log('Token query result:', tokenSnapshot.size, 'documents found');

    if (tokenSnapshot.empty) {
      return { valid: false, error: "Invalid invite code." };
    }

    const tokenDoc = tokenSnapshot.docs[0];
    const tokenData = convertTimestamp(tokenDoc.data()) as InviteToken;
    
    console.log('Token data:', tokenData);

    if (tokenData.used) {
      return { valid: false, error: "This invite code has already been used." };
    }

    const now = new Date();
    const expiresAt = tokenData.expiresAt as Date;
    if (now > expiresAt) {
      return { valid: false, error: "This invite code has expired." };
    }

    // Check if space still exists and isn't full
    const spaceRef = doc(db, 'spaces', tokenData.spaceId);
    const spaceDoc = await getDoc(spaceRef);

    if (!spaceDoc.exists()) {
      return { valid: false, error: "The invited space no longer exists." };
    }

    const spaceData = spaceDoc.data() as Space;
    if (spaceData.team.length >= 3) {
      return { valid: false, error: "This space is full." };
    }

    return {
      valid: true,
      spaceName: tokenData.spaceName,
      ownerName: tokenData.ownerName,
    };
  } catch (error: any) {
    console.error('Token validation error:', error);
    return { valid: false, error: `Failed to validate invite code: ${error.message}` };
  }
};

// Revoke/delete invite token (owner only)
export const revokeInviteToken = async (spaceId: string, ownerId: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user || user.uid !== ownerId) {
    throw new Error("Only space owners can revoke invite tokens.");
  }

  const batch = writeBatch(db);

  // Delete unused tokens for this space
  const tokensRef = collection(db, 'inviteTokens');
  const tokenQuery = query(tokensRef, 
    where('spaceId', '==', spaceId), 
    where('ownerId', '==', ownerId),
    where('used', '==', false)
  );
  const tokenSnapshot = await getDocs(tokenQuery);
  
  tokenSnapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  // Clear invite token from space
  const spaceRef = doc(db, 'spaces', spaceId);
  batch.update(spaceRef, { inviteToken: null });

  await batch.commit();
};
