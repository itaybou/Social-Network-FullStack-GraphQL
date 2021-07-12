import { objectType } from 'nexus'

export const PostsPayload = objectType({
  name: 'PostsPayload',
  definition(t) {
    t.int('total')
    t.list.field('posts', { type: 'Post' })
  },
})
