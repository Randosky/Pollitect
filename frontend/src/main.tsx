import { createRoot } from "react-dom/client";

import "@styles/icons.scss";
import "@styles/root.scss";

import Layout from "./layout";

createRoot(document.getElementById("root")!).render(<Layout />);
