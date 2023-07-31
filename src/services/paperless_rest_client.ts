import { apiFormat } from "@controller/paperless"
const ADMIN_BASIC_TOKEN = process.env.PAPERLESS_ADMIN_BASIC_TOKEN || ''
type objType = "correspondents" | "document_types" | "documents" | "logs" | "tags" | "saved_views" | "storage_paths" | "tasks" | "users" | "groups" | "mail_accounts" | "mail_rules"
export function paperless(obj: objType) {
  const mappingObj = {
    "correspondents": "/api/correspondents",
    "document_types": "/api/document_types",
    "documents": "/api/documents",
    "logs": "/api/logs",
    "tags": "/api/tags",
    "saved_views": "/api/saved_views",
    "storage_paths": "/api/storage_paths",
    "tasks": "/api/tasks",
    "users": "/api/users",
    "groups": "/api/groups",
    "mail_accounts": "/api/mail_accounts",
    "mail_rules": "/api/mail_rules"
  }
  return {
    get: async () => {
      return await apiFormat(mappingObj[obj], ADMIN_BASIC_TOKEN, "GET")
    },
    create: async (data: any) => {
      return await apiFormat(mappingObj[obj], ADMIN_BASIC_TOKEN, "POST", data)
    },
    update: async (data: any, id: any) => {
      return await apiFormat(mappingObj[obj], ADMIN_BASIC_TOKEN, "PUT", data, id)
    },
    delete: async (id: any) => {
      return await apiFormat(mappingObj[obj], ADMIN_BASIC_TOKEN, "DELETE", null, id)
    }
  }
}