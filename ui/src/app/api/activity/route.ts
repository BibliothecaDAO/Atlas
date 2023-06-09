import { formatQueryString } from "@/functions/utils";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const query: any = await request.json()

  try {
    const res = await fetch(`https://api.reservoir.tools/collections/activity/v5?collection=${query.collection}&${formatQueryString(query.types, 'types')}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.RESERVOIR_API_KEY || '',
        'Access-Control-Allow-Origin': '*'
      },
    });
    const data: any = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Internal server error' })
  }
}