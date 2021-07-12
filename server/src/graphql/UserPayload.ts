import { objectType } from 'nexus'

export const UserPayload = objectType({
  name: 'UserPayload',
  definition(t) {
    t.list.field('followers', { type: 'Following' })
    t.field('user', { type: 'User' })
  },
})
