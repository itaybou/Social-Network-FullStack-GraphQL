import { Context } from '../context'
import { objectType } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.email()
    t.model.posts({ pagination: false })
    t.model.profile()
    t.model.likePosts()
    t.model.comments()
    t.model.following()
  },
})
