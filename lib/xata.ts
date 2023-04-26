import { buildClient } from '@xata.io/client'
import type {
  SchemaInference,
  XataRecord,
  BaseClientOptions,
} from '@xata.io/client'

const tables = [
  {
    name: 'articles',
    columns: [
      { name: 'published_at', type: 'text' },
      { name: 'title', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'platform', type: 'string' },
      { name: 'url', type: 'string' },
    ],
  },
  {
    name: 'appearances',
    columns: [
      { name: 'date', type: 'text' },
      { name: 'name', type: 'string' },
      { name: 'title', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'recording', type: 'string' },
      { name: 'slides', type: 'string' },
      { name: 'url', type: 'string' },
      { name: 'type', type: 'string' },
      { name: 'published', type: 'bool' },
      { name: 'isFuture', type: 'bool' },
      { name: 'place', type: 'string' },
    ],
  },
] as const

export type SchemaTables = typeof tables
export type InferredTypes = SchemaInference<SchemaTables>

export type Articles = InferredTypes['articles']
export type ArticlesRecord = Articles & XataRecord

export type Appearances = InferredTypes['appearances']
export type AppearancesRecord = Appearances & XataRecord

export type DatabaseSchema = {
  articles: ArticlesRecord
  appearances: AppearancesRecord
}

class XataClient extends buildClient()<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super(
      {
        ...options,
        databaseURL: 'https://atila-r3s7jg.eu-west-1.xata.sh/db/atilaio',
      },
      tables
    )
  }
}

export const xata = new XataClient()
