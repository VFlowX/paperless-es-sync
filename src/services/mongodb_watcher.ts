import { _client } from "@db/mongodb";
import { logger } from "./logger";
import { paperless } from "./paperless_rest_client";
import { vuejx } from "./vuejx-core";
const DB = 'CSDL_TCMT'
const SITE = 'tcmt'

export function startWatchMongo() {
  watchT_CanBo();
  watchC_Role();
}

export async function watchT_CanBo() {
  const filter = []
  const options = {
    fullDocument: 'updateLookup'
  }
  const changeStream = _client.db(DB).collection('T_CanBo').watch(filter, options)
  while (await changeStream.hasNext()) {
    let doc = await changeStream.next()
    console.log(doc);
    // const paperlessUsers = await paperless('users').get()
    // console.log(paperlessUsers)
  }
}
export async function watchC_Role() {
  const filter = []
  const options = {
    fullDocument: 'updateLookup'
  }
  const changeStream = _client.db(DB).collection('C_ROLE').watch(filter, options)
  while (await changeStream.hasNext()) {
    let doc: any = await changeStream.next()
    if (doc?.updateDescription?.updatedFields?.noupdatePaperless) {
      continue;
    }

    const groupData = {
      name: doc.fullDocument?.MaMuc,
      permissions: [] // TODO mapping role
    }
    if (doc.fullDocument?.paperless_groupID) {
      // update
      const paperlessUsers = await paperless('groups').update(groupData, doc.fullDocument?.paperless_groupID)
      logger('paperless').info(`Update groups ${JSON.stringify(paperlessUsers)}`)
    }
    else {
      //create
      const paperlessUsers = await paperless('groups').create(groupData)
      if (paperlessUsers?.id) {
        logger('paperless').info('created', {
          _id: doc.fullDocument._id,
          paperless_groupID: paperlessUsers.id,
          noupdatePaperless: Number(doc?.fullDocument?.noupdatePaperless || 0) + 1
        });

        const test = await vuejx(DB, SITE).userUpdateById('C_ROLE', {
          _id: doc.fullDocument._id,
          paperless_groupID: paperlessUsers.id,
          noupdatePaperless: Number(doc?.fullDocument?.noupdatePaperless || 0) + 1
        })
        console.log('test', test);

      }
    }
  }
  function updatePaperless() {

  }
}