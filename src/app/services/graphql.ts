import request, { RequestDocument } from "graphql-request";
import { getToken, JWT } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { sign } from "jsonwebtoken";
const secret = process.env.AUTH_SECRET as string;

export async function queryGraphql<T>(
  query: RequestDocument,
  vars: Record<string, unknown> = {},
  headers: HeadersInit = {}
) {
  const apiUrl = process.env.GRAPHQL_URL as string;

  try {
    return await request<T>(apiUrl, query, vars, headers);
  } catch (err) {
    throw err;
  }
}

export const authorizedQueryGraphql = async <T extends Record<string, unknown>>(
  req: NextRequest,
  query: RequestDocument,
  vars: Record<string, unknown>,
  additionalHeaders?: HeadersInit
) => {
  const headers = await getAuthHeaders(req, additionalHeaders);

  try {
    return await queryGraphql<T>(query, vars, headers);
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param req
 * @param additionalHeaders
 * @returns
 */
const getAuthHeaders = async (
  req: NextRequest,
  additionalHeaders: HeadersInit = {}
) => {
  const isVercel = process.env.ENVIRONMENT !== "local";
  const token = await getToken({
    req,
    secret,
    secureCookie: isVercel,
    cookieName: isVercel
      ? "__Secure-authjs.session-token"
      : "authjs.session-token",
  });

  const headers = token
    ? getBearerTokenHeader(token, additionalHeaders)
    : additionalHeaders;

  return headers;
};

const getBearerTokenHeader = (token: JWT, additionalHeaders: HeadersInit) => {
  return {
    Authorization: `Bearer ${sign(token, secret)}`,
    ...additionalHeaders,
  };
};
