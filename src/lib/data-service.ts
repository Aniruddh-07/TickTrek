

'use server'

import fs from 'fs/promises';
import path from 'path';
import type { Organization, User, Team, Project, Ticket, Task } from './types';

interface DataSnapshot {
  organizations: Organization[];
  users: User[];
  teams: Team[];
  projects: Project[];
  tickets: Ticket[];
  tasks: Task[];
}

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'db.json');

// Ensure the directory and file exist
async function ensureDbFile() {
  try {
    await fs.access(dataFilePath);
  } catch {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    // This is where you can seed initial data
    const initialData: DataSnapshot = {
      organizations: [
        { id: 'ticktrek-inc', name: 'TickTrek Inc.' }
      ],
      users: [
        {
          id: 'user-1',
          name: 'Admin User',
          email: 'admin.user@ticktrek-inc',
          passwordHash: '$2b$10$fKIPoremqN9s7gPzVW2c.uY.r0.C4F8FmJ1234567890abcdef', // Hashed "password"
          role: 'admin',
          avatar: 'https://picsum.photos/seed/admin/50',
          organizationId: 'ticktrek-inc',
          status: 'active',
        },
      ],
      teams: [],
      projects: [],
      tickets: [],
      tasks: [],
    };
    await fs.writeFile(dataFilePath, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

export async function getAllData(): Promise<DataSnapshot> {
  await ensureDbFile();
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading data file:", error);
    // Return a default empty state if file is corrupted or empty
    return { organizations: [], users: [], teams: [], projects: [], tickets: [], tasks: [] };
  }
}

export async function saveData(data: DataSnapshot): Promise<void> {
  await ensureDbFile();
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing data file:", error);
    throw new Error("Failed to save data.");
  }
}


export async function generateInviteToken(orgId: string): Promise<string> {
    const currentData = await getAllData();
    const organization = currentData.organizations.find(o => o.id === orgId);
    if (!organization) {
        throw new Error('Organization not found');
    }
    
    const token = `invite-${crypto.randomUUID()}`;
    
    if (!organization.inviteTokens) {
        organization.inviteTokens = [];
    }
    organization.inviteTokens.push(token);

    await saveData(currentData);

    return token;
}
