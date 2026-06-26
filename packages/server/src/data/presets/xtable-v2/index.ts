import { IRunContext } from "../../../types/context";
import { IDataAnalysisPreset, IDatabaseSchema } from "../../types";
import { getDBSchema as _getDBSchema } from "./request.js";

// ---

const getDataSchema = async (ctx: IRunContext): Promise<IDatabaseSchema> => {
  const result = await _getDBSchema(ctx);
  return result.info;
};

// ---

export const xtablePreset: IDataAnalysisPreset = {
  id: "xtable",
  description: "多维表格数据",
  prompt: "",
  database_schema: getDataSchema,
  query_executor: "xtable",
};
