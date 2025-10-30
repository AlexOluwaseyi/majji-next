import prisma from "@/lib/prisma";
import { generateUsername, hashPassword } from "./utils";

export async function getUserById(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function getAllUsers() {
  try {
    return await prisma.user.findMany({
      select: { id: true, email: true, name: true, username: true, type: true, isAdmin: true, rating: true }
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function createUser(data: {
  email: string;
  name: string;
  password: string;
  type: "buyer" | "seller";
  company?: string;
}) {
  try {
    // Hash the password before creating the user
    const hashedPassword = await hashPassword(data.password);

    return await prisma.user.create({
      data: {
        ...data,
        username: generateUsername(data.email),
        password: hashedPassword,
      },
      select: { id: true, email: true, name: true, username: true, type: true, isAdmin: true, company: true }
    });
  } catch (error) {
    console.error("Error creating user in DB:", error);
    throw new Error("Failed to create user");
  }
}

export async function updateUser(userId: string, data: Partial<{
  name: string;
  type: "buyer" | "seller";
  isAdmin: boolean;
  rating: number;
}>) {
  return await prisma.user.update({
    where: { id: userId },
    data,
  });
}

export async function deleteUser(userId: string) {
  return await prisma.user.delete({
    where: { id: userId },
  });
}
