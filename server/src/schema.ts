import * as types from './graphql'

import {
  asNexusMethod,
  enumType,
  inputObjectType,
  makeSchema,
  objectType,
} from 'nexus'

import { Context } from './context'
import { DateTimeResolver } from 'graphql-scalars'
import { applyMiddleware } from 'graphql-middleware'
import { nexusPrisma } from 'nexus-plugin-prisma'
import path from 'path'
import { permissions } from './permissions'

const schemaWithoutPermissions = makeSchema({
  types,
  plugins: [nexusPrisma()],
  outputs: {
    schema: path.join(__dirname, '/../schema.graphql'),
    typegen: path.join(__dirname, '/generated/nexus.ts'),
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})

export const schema = applyMiddleware(schemaWithoutPermissions, permissions)
