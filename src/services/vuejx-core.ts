import { requestVuejx } from "@controller/vuejx"

export function vuejx(db, site) {
  const mappedQuery = {
    userUpdateById: `mutation UserUpdateById($collection: String, $body: JSON) {
      userUpdateById(collection: $collection, body: $body)
    }`
  }

  return {
    userUpdateById: async (collection, body) => {
      return await requestVuejx(mappedQuery['userUpdateById'], {
        collection, body
      }, db, site)
    },
  }
}

