import { Context } from './context'
import { verify } from 'jsonwebtoken'

export const APP_SECRET = 'appsecret321'

interface Token {
  userId: string
}

export function getUserId(context: Context) {
  const authHeader = context.req.get('Authorization')

  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '')
    const verifiedToken = verify(token, APP_SECRET) as Token
    return verifiedToken && String(verifiedToken.userId)
  }
}
