import { objectType } from '@nexus/schema'

export const LikePost = objectType({
  name: 'LikePost',
  definition(t) {
    t.model.id()
    t.model.post()
    t.model.likedAt()
  },
})
