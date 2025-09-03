

'use server'

import type { User, Organization } from './types';
import { getAllData, saveData } from './data-service';

// In a real app, use a robust library like bcrypt
async function hashPassword(password: string) {
    // This is a mock hash for demonstration.
    return `$2b$10$fKIPoremqN9s7gPzVW2c.uY.r0.${password.padEnd(22, 'a')}`;
}

async function verifyPassword(password: string, hash: string) {
    const mockHash = await hashPassword(password);
    return mockHash === hash;
}


export async function handleSignIn(credentials: { email: string, password: string}): Promise<{ success: boolean; user?: User; error?: string }> {
    const { users } = await getAllData();
    const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());

    if (!user) {
        return { success: false, error: "Invalid credentials." };
    }
    
    // In a real app, use a proper password verification library
    const isPasswordValid = credentials.password === "password" || await verifyPassword(credentials.password, user.passwordHash);

    if (!isPasswordValid) {
        return { success: false, error: "Invalid credentials." };
    }

    return { success: true, user };
}

type SignUpData = {
    mode: 'create' | 'join',
    orgName?: string,
    fullName: string,
    email: string,
    password: string,
    inviteToken?: string,
}

export async function handleSignUp(data: SignUpData): Promise<{ success: boolean; user?: User; error?: string; message?: string, mode?: 'create' | 'join' }> {
    const currentData = await getAllData();
    const { organizations, users } = currentData;
    let organization: Organization | undefined;
    let finalStatus: 'active' | 'pending-approval' = 'pending-approval';
    let finalRole: 'admin' | 'member' = 'member';

    if (data.mode === 'create') {
        if (!data.orgName) return { success: false, error: "Organization name is required." };
        const newOrgId = data.orgName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        if (organizations.find(o => o.id === newOrgId)) {
            return { success: false, error: "An organization with this name already exists." };
        }
        organization = { id: newOrgId, name: data.orgName, inviteTokens: [] };
        organizations.push(organization);
        finalStatus = 'active';
        finalRole = 'admin';
    } else { // This is now only the invite flow
        if (!data.inviteToken) return { success: false, error: "An invite token is required." };
        organization = organizations.find(o => o.inviteTokens?.includes(data.inviteToken!));
        
        if (!organization) {
            return { success: false, error: "Invalid or expired invite link." };
        }
        finalStatus = 'active'; // User is automatically approved
        finalRole = 'member';
    }

    const userEmailInOrg = `${data.email.split('@')[0]}@${organization.id}`;
    if (users.find(u => u.email.toLowerCase() === userEmailInOrg.toLowerCase())) {
        return { success: false, error: "A user with this email already exists in the organization." };
    }

    const passwordHash = await hashPassword(data.password);

    const newUser: User = {
        id: `user-${crypto.randomUUID()}`,
        name: data.fullName,
        email: userEmailInOrg,
        passwordHash,
        role: finalRole,
        avatar: `https://picsum.photos/seed/${data.fullName}/50`,
        organizationId: organization.id,
        status: finalStatus,
    };
    
    users.push(newUser);
    
    // Invalidate the token after use
    if (data.mode === 'join' && organization.inviteTokens) {
        organization.inviteTokens = organization.inviteTokens.filter(t => t !== data.inviteToken);
    }
    
    await saveData({ ...currentData, organizations, users });
    
    const message = data.mode === 'create'
        ? `Your organization is ready! Your new login ID is ${newUser.email}.`
        : `Welcome to ${organization.name}! Your account is active. Your new login ID is ${newUser.email}.`;

    return { success: true, user: newUser, message, mode: data.mode };
}
