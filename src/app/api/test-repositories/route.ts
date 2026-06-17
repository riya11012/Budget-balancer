import { NextResponse } from "next/server";

import {
    createUser,
    getUserByEmail,
} from "../../../repositories/user.repository";

export async function GET() {
  try {
    const user = await createUser(
      "Riya",
      "riya@test.com",
      "hashedpassword"
    );

    const foundUser = await getUserByEmail(
      "riya@test.com"
    );

    return NextResponse.json({
      created: user,
      found: foundUser,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}