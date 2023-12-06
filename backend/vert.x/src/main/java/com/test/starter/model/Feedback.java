package com.test.starter.model;

import io.vertx.core.json.JsonObject;

public class Feedback {
  String name;
  String body;
  FeedbackType type;

  public Feedback(String name, String body, FeedbackType type) {
    this.name = name;
    this.body = body;
    this.type = type;
  }

  public JsonObject toJson() {
    JsonObject jsonObject = new JsonObject();
    jsonObject.put("name", this.name);
    jsonObject.put("body", this.body);
    jsonObject.put("type", this.type);
    return jsonObject;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getBody() {
    return body;
  }

  public void setBody(String body) {
    this.body = body;
  }

  public FeedbackType getType() {
    return type;
  }

  public void setType(FeedbackType type) {
    this.type = type;
  }
}
