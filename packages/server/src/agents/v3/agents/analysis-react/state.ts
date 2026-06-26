export class QueryAgentState {
  private _stop = false;
  private _result: string = "";
  private _chunks: string[] = [];
  private _lastTextChunks: string[] = [];

  get result() {
    return this._result;
  }

  push(chunk: string) {
    this._chunks.push(chunk);
    if (chunk.startsWith("d:{")) {
      this._stop = true;
      this._result = this._lastTextChunks.join("");
    }
    if (chunk.startsWith("0:")) {
      this._lastTextChunks.push(JSON.parse(chunk.slice(2)));
    } else if (!chunk.startsWith("e:")) {
      this._lastTextChunks = [];
    }
  }

  snapshot() {
    const node = {
      stage: "analysis",
      stop: this._stop,
      name: "深度思考",
      content: this._chunks,
      metadata: {
        stepIndex: 0,
      },
    };

    return {
      agent: "query",
      nodes: [node],
    };
  }
}
