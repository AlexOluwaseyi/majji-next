import { NextRequest, NextResponse } from "next/server"
import { createUser, getAllUsers } from "@/lib/users"

/**
 * API Route to get all users
 * @returns users fetched from the database
 */
export async function GET() {
  try {
    const users = await getAllUsers()
    if (!users) {
      return NextResponse.json({ error: "No users found" }, { status: 404 })
    }
    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

/**
 * API Route to create a new user
 * @param request - get request body from form data
 * @returns user created in the database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, type } = body


    if (!name || !email || !password || !type) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }
    const user = await createUser({
      name,
      email,
      password: body.password,
      type: body.type,
      company: body.company,
    })

    if (!user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
