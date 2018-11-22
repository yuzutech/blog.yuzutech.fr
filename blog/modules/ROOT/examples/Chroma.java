package org.chroma;

import org.graalvm.polyglot.Value;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

public interface Chroma {

  Chroma darken();

  Chroma saturate(int value);

  String hex();

  List<Integer> rgba();

  static Chroma create(String color) {
    try {
      Value chroma = GraalVMChroma.create().getChroma(); // <1>
      Value instance = chroma.newInstance(color); // <2>
      return new ChromaInstance(instance); // <3>
    } catch (IOException | URISyntaxException e) {
      throw new RuntimeException("Unable to instantiate Chroma GraalVM");
    }
  }
}
