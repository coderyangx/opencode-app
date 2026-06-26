import { experimental_createMCPClient } from "ai";

export const searchToolsServerFactory = (): ReturnType<
  typeof experimental_createMCPClient
> => {
  const client = experimental_createMCPClient({
    transport: {
      type: "sse",
      url: "http://mcphub-server.sankuai.com/mcphub-api/d3a922e1479a4d",
    },
  });

  return client;
};
