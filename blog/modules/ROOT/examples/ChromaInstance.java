package org.chroma;

import org.graalvm.polyglot.Value;

import java.util.ArrayList;
import java.util.List;

public class ChromaInstance implements Chroma {

  private Value chromaInstance;

  public ChromaInstance(Value chromaInstance) {
    this.chromaInstance = chromaInstance; // <1>
  }

  @Override
  public Chroma darken() {
    return new ChromaInstance(chromaInstance.getMember("darken").execute()); // <2>
  }

  @Override
  public Chroma saturate(int value) {
    return new ChromaInstance(chromaInstance.getMember("saturate").execute(value)); // <3>
  }

  @Override
  public String hex() {
    return chromaInstance.getMember("hex").execute().asString(); // <4>
  }

  @Override
  public List<Integer> rgba() {
    List<Integer> result = new ArrayList<>();
    Value value = chromaInstance.getMember("rgba").execute(); // <5>
    if (value.hasArrayElements()) {
      for (int i = 0; i < value.getArraySize(); i++) {
        result.add(value.getArrayElement(i).asInt());
      }
    }
    return result;
  }
}
