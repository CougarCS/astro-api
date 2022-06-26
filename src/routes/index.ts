import { Router } from 'express';

const router = Router();

/* GET / */

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello, World! 👋' });
});

export default router;
