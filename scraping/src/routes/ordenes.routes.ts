import { Router } from 'express';

import { getOrdenes, postOrdenes } from '../controllers/ordenes.controller';

const router:Router = Router();

router.get('', getOrdenes)
      .post('', postOrdenes);


export default router;