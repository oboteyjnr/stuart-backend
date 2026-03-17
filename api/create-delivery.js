export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const order = req.body;

  // TODO: call Stuart API here using your credentials

  return res.status(200).json({
    message: 'Stub: delivery would be created here',
    order
  });
}
