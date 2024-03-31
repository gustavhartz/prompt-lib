import { logger } from "@/utils/logger";
import {
  handleAuth,
  handleLogout,
  handleLogin,
  handleCallback,
} from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

export const GET = handleAuth({
  onError(req: Request, error: Error) {
    logger.error(error);
  },
  logout: async (req: NextApiRequest, res: NextApiResponse) => {
    return handleLogout(req, res);
  },
  login: async (req: NextApiRequest, res: NextApiResponse) => {
    return handleLogin(req, res, {
      returnTo: "/api/management/login",
    });
  },
  callback: async (req: NextApiRequest, res: NextApiResponse) => {
    return handleCallback(req, res);
  },
});
