export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { pickup, dropoff } = req.body;

    // 1. Authenticate with Stuart
    const authResponse = await fetch("https://api.stuart.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.STUART_CLIENT_ID,
        client_secret: process.env.STUART_CLIENT_SECRET,
        grant_type: "client_credentials"
      })
    });

    const authData = await authResponse.json();

    if (!authData.access_token) {
      return res.status(400).json({ error: "Failed to authenticate with Stuart", details: authData });
    }

    // 2. Create the delivery job
    const jobResponse = await fetch("https://api.stuart.com/v2/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.access_token}`
      },
      body: JSON.stringify({
        job: {
          pickup: {
            address: pickup.address,
            comment: pickup.comment || ""
          },
          dropoff: {
            address: dropoff.address,
            comment: dropoff.comment || "",
            contact: {
              firstname: dropoff.firstname,
              lastname: dropoff.lastname,
              phone: dropoff.phone
            }
          }
        }
      })
    });

    const jobData = await jobResponse.json();

    return res.status(200).json({
      message: "Delivery created successfully",
      stuartResponse: jobData
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
}
