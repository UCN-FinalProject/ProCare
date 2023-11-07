import { Redis } from "@upstash/redis";
import { env } from "~/env.mjs";

const redis = new Redis({
  // TODO: add to env
  url: "https://eu2-enough-donkey-30343.upstash.io",
  token:
    "AXaHASQgZjVkYWY4MzktZGMxYS00NmI2LTlhNTctOWRmNjFmODQwODRjYjhkYjM0NWNmYTEzNDdjNDk2OGJlZTg2ODBkMzZkMDU=",
});

export default redis;
