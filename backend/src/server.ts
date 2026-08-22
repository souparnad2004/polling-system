import { startupApplication } from "./startup.js";

startupApplication()
.catch((error: unknown) => {
    if(error instanceof Error) {
        console.error(error.message);
    }
    process.exit(1);
})