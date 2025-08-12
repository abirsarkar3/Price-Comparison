import { type NextRequest, NextResponse } from "next/server"
import { updateUserCart } from "@/lib/cart-storage"

export async function POST(request: NextRequest) {
  try {
    const { userId, optimization } = await request.json()

    if (!userId || !optimization) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Apply the optimization to user's cart
    await updateUserCart(userId, optimization)

    return NextResponse.json({
      success: true,
      message: "Cart optimization applied successfully",
    })
  } catch (error) {
    console.error("Apply optimization error:", error)
    return NextResponse.json({ error: "Failed to apply optimization" }, { status: 500 })
  }
}
