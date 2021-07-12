import { objectType } from '@nexus/schema'

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id()
    t.model.content()
    t.model.author()
    t.model.createdAt()
    t.model.likes()
    t.model.comments()
  },
})
