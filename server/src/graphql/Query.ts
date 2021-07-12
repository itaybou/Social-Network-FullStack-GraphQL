import { arg, intArg, nonNull, queryType, stringArg } from 'nexus'

import { Context } from '../context'
import { getUserId } from '../user'

export const Query = queryType({
  definition(t) {
    t.nonNull.list.nonNull.field('users', {
      type: 'User',
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.user.findMany()
      },
    })

    t.field('user', {
      type: 'UserPayload',
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: async (_parent, { userId }, context: Context) => {
        const result = await context.prisma.$transaction([
          context.prisma.user.findUnique({
            where: {
              id: String(userId),
            },
          }),
          context.prisma.following.findMany({
            where: {
              followId: String(userId),
            },
          }),
        ])

        return {
          user: result[0],
          followers: result[1],
        }
      },
    })

    t.nonNull.list.nonNull.field('search_users', {
      type: 'User',
      args: {
        searchInput: nonNull(stringArg()),
      },
      resolve: async (_parent, { searchInput }, context: Context) => {
        console.log(searchInput)
        if (!searchInput || searchInput.length < 2) return []
        return context.prisma.user.findMany({
          where: {
            AND: [
              {
                OR: [
                  {
                    name: {
                      contains: searchInput,
                      mode: 'insensitive',
                    },
                  },
                  {
                    name: {
                      startsWith: searchInput,
                      mode: 'insensitive',
                    },
                  },
                  {
                    email: {
                      startsWith: searchInput,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            ],
          },
        })
      },
    })

    t.nullable.field('current_user', {
      type: 'UserPayload',
      resolve: async (_parent, _args, context: Context) => {
        const userId = getUserId(context)

        const result = await context.prisma.$transaction([
          context.prisma.user.findUnique({
            where: {
              id: String(userId),
            },
          }),
          context.prisma.following.findMany({
            where: {
              followId: String(userId),
            },
          }),
        ])

        return {
          user: result[0],
          followers: result[1] ?? [],
        }
      },
    })

    t.nonNull.field('posts', {
      type: 'PostsPayload',
      args: {
        skip: nonNull(intArg()),
        take: nonNull(intArg()),
      },
      resolve: async (_parent, { skip, take }, context: Context) => {
        const userId = getUserId(context)

        const following = (
          await context.prisma.following.findMany({
            where: { userId },
            select: {
              followId: true,
            },
          })
        ).map((f) => f.followId)

        const result = await context.prisma.$transaction([
          context.prisma.post.findMany({
            where: {
              authorId: {
                in: following,
              },
            },
            orderBy: [
              {
                createdAt: 'desc',
              },
            ],
            skip,
            take,
          }),
          context.prisma.post.count(),
        ])

        return {
          posts: result[0],
          total: result[1],
        }
      },
    })

    t.field('post', {
      type: 'Post',
      args: { postId: nonNull(stringArg()) },
      resolve: (_root, { postId }, context) => {
        return context.prisma.post.findFirst({
          where: {
            id: String(postId),
          },
        })
      },
    })

    t.nonNull.list.nonNull.field('popular_posts', {
      type: 'Post',
      args: { minDatetime: nonNull(stringArg()) },
      resolve: (_parent, { minDatetime }, context: Context) => {
        return context.prisma.post.findMany({
          where: {
            createdAt: {
              gte: new Date(minDatetime),
            },
          },
          orderBy: [
            {
              likes: {
                count: 'desc',
              },
            },
            {
              createdAt: 'desc',
            },
          ],
          take: 5,
        })
      },
    })
  },
})
