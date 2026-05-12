import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import "express-session";

declare module "express-session" {
  interface SessionData {
    admin: boolean;
    username: string;
  }
}

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "veltrix2024";

const router: IRouter = Router();

// POST /admin/login
router.post("/admin/login", (req: Request, res: Response) => {
  const { username, password } = req.body ?? {};
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.admin = true;
    req.session.username = username;
    res.json({ authenticated: true, username });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

// POST /admin/logout
router.post("/admin/logout", (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// GET /admin/me
router.get("/admin/me", (req: Request, res: Response) => {
  if (req.session.admin) {
    res.json({ authenticated: true, username: req.session.username });
  } else {
    res.json({ authenticated: false });
  }
});

// Middleware: require admin session
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session.admin) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

export default router;
