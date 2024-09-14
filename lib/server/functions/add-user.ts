'use server';
import db from '@/db';
import { usersSchema } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Define the return type for the function
interface AddUserResponse {
  status: 'success' | 'error' | 'exists';
  message: string;
  data?: any;
  error?: string;
}

// Define the structure of the session user object
interface SessionUser {
  email: string;
  name: string;
  image: string;
}

// Main function to add a user
export default async function addUser(
  user: SessionUser,
): Promise<AddUserResponse> {
  console.log('Adding user...');
  try {
    const session = user;

    // Ensure session exists
    if (!session) {
      return {
        status: 'error',
        message: 'No session found. Please log in.',
      };
    }

    const { email, name, image } = session;

    // Check if the user already exists
    const existingUser = await db
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.email, email as string));

    if (existingUser.length > 0) {
      return {
        status: 'exists',
        message: 'User already exists.',
        data: existingUser,
      };
    }

    // Insert new user into the database
    const newUser = await db.insert(usersSchema).values({
      email,
      name,
      image,
    });
    console.log('User added:', newUser);
    return {
      status: 'success',
      message: 'User added successfully.',
      data: newUser,
    };
  } catch (error: any) {
    // Handle potential errors
    return {
      status: 'error',
      message: 'An error occurred while adding the user.',
      error: error.message,
    };
  }
}
