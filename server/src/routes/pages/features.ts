import { Router } from "express";

import appRouter from "@/lib/appRouter";

const router = Router();

router.get("/analysis", appRouter("features/analysis.html"));
router.get("/archive", appRouter("features/archive.html"));

export default router;
