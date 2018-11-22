package org.chroma;

import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Value;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;

public class GraalVMChroma {

  private final Value chroma;
  private static GraalVMChroma instance = null;

  private GraalVMChroma() {
    Context context = Context.create(); // <1>
    URL chromaResource = Thread.currentThread().getContextClassLoader().getResource("chroma.min.js");
    String content = new String(Files.readAllBytes(Paths.get(chromaResource.toURI()))); // <2>
    context.eval("js", content); // <3>
    chroma = context.eval("js", "chroma"); // <4>
  }

  public static GraalVMChroma create() {
    if (instance == null) {
      instance = new GraalVMChroma();
    }
    return instance;
  }

  public Value getChroma() {
    return chroma;
  }
}
