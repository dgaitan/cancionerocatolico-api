import { startMailWorker } from './mail.worker';

export function startWorkers() {
  return [startMailWorker()];
}
