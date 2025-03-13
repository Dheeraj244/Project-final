import { connect } from "@/db/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/user.model";
connect();

export async function POST(request) {
  try {
    const userID = await getDataFromToken(request);

    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }
    return NextResponse.json({
      message: "User found",
      data: user,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
