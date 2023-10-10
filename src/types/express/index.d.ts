declare namespace Express {
  export interface Request {
    authorizedUser?: {
      id: string;
      email: string;
      walletAddress: string;
      projectId: string;
    };
  }
}
