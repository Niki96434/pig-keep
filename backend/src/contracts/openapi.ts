import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import fs from 'node:fs'
import path from 'node:path'

extendZodWithOpenApi(z)

export const registry = new OpenAPIRegistry()

export const ErrorSchema = registry.register(
  'Error',
  z.object({
    message: z.string().optional(),
    error: z.string().optional(),
  })
)

const defaultErrorResponse = {
  description: 'Error',
  content: {
    'application/json': {
      schema: ErrorSchema,
    },
  },
}

export const TagSchema = registry.register(
  'Tag',
  z.object({
    id: z.string().uuid(),
    name: z.string().max(255),
  })
)

export const TagCreateInSchema = registry.register(
  'TagCreateIn',
  z.object({
    name: z.string().trim().min(1).max(255),
  })
)

export const TagPutInSchema = registry.register(
  'TagPutIn',
  z.object({
    name: z.string().trim().min(1).max(255),
  })
)

export const TagPatchInSchema = registry.register(
  'TagPatchIn',
  z.object({
    name: z.string().trim().min(1).max(255),
  })
)

export const NoteSchema = registry.register(
  'Note',
  z.object({
    id: z.string().uuid(),
    title: z.string().max(255),
    content: z.string().max(1000),
    isArchive: z.boolean().nullable().optional(),
    isDeleted: z.boolean().nullable().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
)

export const NoteCreateInSchema = registry.register(
  'NoteCreateIn',
  z.object({
    title: z.string().trim().max(255).optional(),
    content: z.string().trim().max(1000).optional(),
  })
)

export const NotePutInSchema = registry.register(
  'NotePutIn',
  z.object({
    title: z.string().trim().max(255),
    content: z.string().trim().max(1000),
  })
)

export const NotePatchInSchema = registry.register(
  'NotePatchIn',
  z.object({
    title: z.string().trim().max(255).optional(),
    content: z.string().trim().max(1000).optional(),
    isArchive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  })
)

registry.registerPath({
  method: 'get',
  path: '/api/v1/notes',
  request: {
    query: z.object({
      search: z.string().optional(),
      tagId: z.string().uuid().optional(),
      isArchive: z.coerce.boolean().optional(),
      isDeleted: z.coerce.boolean().optional(),
    }),
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({ notes: z.array(NoteSchema) }),
        },
      },
    },
    default: defaultErrorResponse,
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/v1/notes',
  request: {
    body: {
      content: { 'application/json': { schema: NoteCreateInSchema } },
    },
  },
  responses: {
    201: {
      description: 'Created',
      content: {
        'application/json': {
          schema: z.object({ note: NoteSchema }),
        },
      },
    },
    default: defaultErrorResponse,
  },
})

registry.registerPath({
  method: 'delete',
  path: '/api/v1/notes/trash',
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
    default: defaultErrorResponse,
  },
})

registry.registerPath({
  method: 'delete',
  path: '/api/v1/notes/trash/{id}',
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
    default: defaultErrorResponse,
  },
})

registry.registerPath({
  method: 'patch',
  path: '/api/v1/notes/trash/{id}/restore',
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
    default: defaultErrorResponse,
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/v1/notes/{id}',
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({ note: NoteSchema }),
        },
      },
    },
    default: defaultErrorResponse,
  },
})

registry.registerPath({
  method: 'put',
  path: '/api/v1/notes/{id}',
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { 'application/json': { schema: NotePutInSchema } },
    },
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({ note: NoteSchema }),
        },
      },
    },
    default: defaultErrorResponse,
  },
})

registry.registerPath({
  method: 'patch',
  path: '/api/v1/notes/{id}',
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { 'application/json': { schema: NotePatchInSchema } },
    },
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({ note: NoteSchema }),
        },
      },
    },
    default: defaultErrorResponse,
  },
})

registry.registerPath({
  method: 'delete',
  path: '/api/v1/notes/{id}',
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
    default: defaultErrorResponse,
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/v1/notes/{id}/tags',
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({ tags: z.array(TagSchema) }),
        },
      },
    },
    default: defaultErrorResponse,
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/v1/notes/{id}/tags/{tagId}',
  request: {
    params: z.object({ id: z.string().uuid(), tagId: z.string().uuid() }),
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
    default: defaultErrorResponse,
  },
})

registry.registerPath({
  method: 'delete',
  path: '/api/v1/notes/{id}/tags/{tagId}',
  request: {
    params: z.object({ id: z.string().uuid(), tagId: z.string().uuid() }),
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
    default: defaultErrorResponse,
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/v1/tags',
  request: {
    query: z.object({ search: z.string().optional() }),
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({ tags: z.array(TagSchema) }),
        },
      },
    },
    default: defaultErrorResponse,
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/v1/tags',
  request: {
    body: {
      content: { 'application/json': { schema: TagCreateInSchema } },
    },
  },
  responses: {
    201: {
      description: 'Created',
      content: {
        'application/json': {
          schema: z.object({ tag: TagSchema }),
        },
      },
    },
    default: defaultErrorResponse,
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/v1/tags/{id}',
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({ tag: TagSchema }),
        },
      },
    },
    default: defaultErrorResponse,
  },
})

registry.registerPath({
  method: 'put',
  path: '/api/v1/tags/{id}',
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { 'application/json': { schema: TagPutInSchema } },
    },
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({ tag: TagSchema }),
        },
      },
    },
    default: defaultErrorResponse,
  },
})

registry.registerPath({
  method: 'patch',
  path: '/api/v1/tags/{id}',
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { 'application/json': { schema: TagPatchInSchema } },
    },
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({ tag: TagSchema }),
        },
      },
    },
    default: defaultErrorResponse,
  },
})

registry.registerPath({
  method: 'delete',
  path: '/api/v1/tags/{id}',
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
    default: defaultErrorResponse,
  },
})

export function generateOpenApiSpec() {
  const generator = new OpenApiGeneratorV31(registry.definitions)
  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Google Keep Microservices API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000' }],
  })
}

if (process.argv[1] && process.argv[1].endsWith('openapi.ts')) {
  const spec = generateOpenApiSpec()
  const outputPath = path.resolve(process.cwd(), 'openapi.json')
  fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2), 'utf-8')
}
