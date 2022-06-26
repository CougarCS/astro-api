import app from './app';

import logger from './utils/logger/logger';

const PORT = 5050;

app.listen(PORT, () => {
  logger.info(`API is listening at http://localhost:${PORT}`);
});
