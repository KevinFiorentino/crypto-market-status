import * as morgan from "morgan";
import Logger from "@configs/winston.config";

const stream: morgan.StreamOptions = {
  write: (message) => Logger.http(message),
};

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

const morganConfig = morgan(
  ":method :url :status - :response-time ms",
  { stream, skip }
);

export default morganConfig;
