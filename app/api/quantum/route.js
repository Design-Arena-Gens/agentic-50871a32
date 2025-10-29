export async function GET() {
  try {
    const response = await fetch('https://schrodice40.com/api/quantum', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shots: 65536
      }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error('Error fetching quantum data:', error);
    return Response.json(
      { error: 'Failed to fetch quantum simulation data', details: error.message },
      { status: 500 }
    );
  }
}
