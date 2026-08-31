// CredShield CLI Launcher — Undeployed Local Network Mode
// Connects to local Docker services (node:9944, indexer:8088, proof-server:6300)
// without spinning up its own containers.

import { createLogger } from '../logger-utils.js';
import { run } from '../index.js';
import { UndeployedStandaloneConfig } from '../config.js';

const config = new UndeployedStandaloneConfig();
const logger = await createLogger(config.logDir);
const testEnvironment = config.getEnvironment(logger);
await run(config, testEnvironment, logger);
