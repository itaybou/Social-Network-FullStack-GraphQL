import { rule, shield } from 'graphql-shield'

import { Context } from '../context'
import { getUserId } from '../user'

const rules = {
  isAuthenticatedUser: rule()((_parent, _args, context: Context) => {
    const userId = getUserId(context)
    return Boolean(userId)
  }),
  isPostOwner: rule()(async (_parent, args, context) => {
    const userId = getUserId(context)
    const author = await context.prisma.post
      .findUnique({
        where: {
          id: String(args.id),
        },
      })
      .author()
    return userId === author.id
  }),
}

export const permissions = shield({
  Query: {
    // current_user: rules.isAuthenticatedUser,
    // draftsByUser: rules.isAuthenticatedUser,
    // postById: rules.isAuthenticatedUser,
  },
  Mutation: {
    // createDraft: rules.isAuthenticatedUser,
    // deletePost: rules.isPostOwner,
    // incrementPostViewCount: rules.isAuthenticatedUser,
    // togglePublishPost: rules.isPostOwner,
  },
})
