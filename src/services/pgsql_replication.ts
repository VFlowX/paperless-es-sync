import { LogicalReplicationService, Pgoutput, PgoutputPlugin } from "pg-logical-replication";
import { logger } from "./logger";

const service = new LogicalReplicationService(
  /**
   * node-postgres Client options for connection
   * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/pg/index.d.ts#L16
   */
  {
    database: process.env.DB,
    user: process.env.USER_POSTGRE,
    password: process.env.PASSWORD_POSTGRE,
    port: process.env.PORT_POSTGRE,
    host: process.env.HOST_POSTGRE,
    // ...
  },
  /**
   * Logical replication service config
   * https://github.com/kibae/pg-logical-replication/blob/main/src/logical-replication-service.ts#L9
   */
  {
    acknowledge: {
      auto: true,
      timeoutSeconds: 10
    }
  }
)
/**
 * https://github.com/kibae/pg-logical-replication/blob/ts-main/src/output-plugins/pgoutput/pgoutput.plugin.ts
 */
const plugin = new PgoutputPlugin({
  protoVersion: 1,
  publicationNames: ['my_publication'], //create by exec sql
});


/**
 * https://github.com/kibae/pg-logical-replication/blob/ts-main/src/output-plugins/pgoutput/pgoutput.types.ts
 */
service.on('data', (lsn: string, log: Pgoutput.Message) => {
  // Do something what you want.
  if (log.tag == 'insert') {
    logger('PGSQL').info(`log.tag ${log.tag} ${log.relation.name}`);
    logger('PGSQL').info(JSON.stringify(log.new));
  }
  else if (log.tag == 'update') {
    logger('PGSQL').info(`log.tag ${log.tag} ${log.relation.name}`);
    logger('PGSQL').info(JSON.stringify(log.new));
  }
});

const slotName = 'document_slot';
export function watchDocumentPaperless() {
  service.subscribe(plugin, slotName)
    .catch((e) => {
      console.error(e);
    })
    .then(() => {
      setTimeout(watchDocumentPaperless, 1000);
    });
};