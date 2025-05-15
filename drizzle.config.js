import { url } from "inspector";

/** @type { import("drizzle-kit").config } */
export default {
    schema:"./utils/schema.js",
    dialect:'postgresql',
    dbCredentials:{
        url:'postgresql://neondb_owner:npg_kOB8DVbIyES0@ep-wandering-frog-a5gd8uhi-pooler.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require',
    }
}; 