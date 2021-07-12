import { APP_SECRET, getUserId } from '../user'
import { compare, hash } from 'bcryptjs'
import { intArg, mutationType, nonNull, stringArg } from 'nexus'

import { Context } from '../context'
import { sign } from 'jsonwebtoken'

export const Mutation = mutationType({
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, { name, email, password }, context: Context) => {
        const hashedPassword = await hash(password, 10)
        const user = await context.prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        })

        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, { email, password }, context: Context) => {
        const user = await context.prisma.user.findUnique({
          where: {
            email,
          },
        })
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('create_profile', {
      type: 'Profile',
      args: {
        bio: stringArg(),
        location: stringArg(),
        website: stringArg(),
        avatar: stringArg(),
      },
      resolve: (_root, args, context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('Could not authenticate user.')

        return context.prisma.profile.create({
          data: {
            ...args,
            user: { connect: { id: String(userId) } },
          },
        })
      },
    })

    t.field('update_profile', {
      type: 'Profile',
      args: {
        id: stringArg(),
        bio: stringArg(),
        location: stringArg(),
        website: stringArg(),
        avatar: stringArg(),
      },
      resolve: (_root, { id, ...args }, context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('Could not authenticate user.')

        return context.prisma.profile.update({
          data: {
            ...args,
          },
          where: { id: String(id) },
        })
      },
    })

    t.field('create_post', {
      type: 'Post',
      args: {
        content: nonNull(stringArg()),
      },
      resolve: (_root, { content }, context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('Could not authenticate user.')

        return context.prisma.post.create({
          data: {
            content,
            author: { connect: { id: String(userId) } },
          },
        })
      },
    })

    t.field('like_post', {
      type: 'LikePost',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: (_root, { id }, context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('Could not authenticate user.')

        return context.prisma.likePost.create({
          data: {
            post: { connect: { id: String(id) } },
            user: { connect: { id: String(userId) } },
          },
        })
      },
    })

    t.field('unlike_post', {
      type: 'LikePost',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: (_root, { id, ...args }, context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('Could not authenticate user.')

        return context.prisma.likePost.delete({
          where: {
            id,
          },
        })
      },
    })

    t.field('create_comment', {
      type: 'Comment',
      args: {
        content: nonNull(stringArg()),
        postId: nonNull(stringArg()),
      },
      resolve: (_root, { content, postId }, context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('Could not authenticate user.')

        return context.prisma.comment.create({
          data: {
            content,
            user: { connect: { id: String(userId) } },
            post: { connect: { id: String(postId) } },
          },
        })
      },
    })

    t.field('create_comment_reply', {
      type: 'Comment',
      args: {
        content: nonNull(stringArg()),
        postId: nonNull(stringArg()),
        commentId: nonNull(stringArg()),
      },
      resolve: (_root, { content, postId, commentId }, context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('Could not authenticate user.')

        return context.prisma.comment.create({
          data: {
            content,
            user: { connect: { id: String(userId) } },
            comment: { connect: { id: String(commentId) } },
          },
        })
      },
    })

    t.field('follow', {
      type: 'Following',
      args: {
        name: nonNull(stringArg()),
        followId: nonNull(stringArg()),
        avatar: nonNull(stringArg()),
      },
      resolve: (_root, { name, followId, avatar }, context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('Could not authenticate user.')

        return context.prisma.following.create({
          data: {
            name,
            avatar,
            followId,
            user: { connect: { id: String(userId) } },
          },
        })
      },
    })

    t.field('unfollow', {
      type: 'Following',
      args: {
        followId: nonNull(stringArg()),
      },
      resolve: (_root, { followId, ...args }, context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('Could not authenticate user.')

        return context.prisma.following.delete({
          where: {
            id: followId,
          },
        })
      },
    })
  },
})
