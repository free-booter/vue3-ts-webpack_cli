declare module "dotenv-webpack" {
  import { Plugin } from "webpack";
  class DotenvPlugin extends Plugin {
    constructor(options?: { path?: string; systemvars?: boolean });
  }
  export = DotenvPlugin;
}
