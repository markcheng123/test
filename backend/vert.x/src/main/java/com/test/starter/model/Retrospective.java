package com.test.starter.model;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.HashMap;
import java.util.Map;

public class Retrospective {
  String name;
  String summary;
  String date;
  JsonArray participants;
  final Map<String, Feedback> feedbacks = new HashMap<>();

  public Retrospective(String name, String summary, String date, JsonArray participants) {
    this.setName(name);
    this.setSummary(summary);
    this.setDate(date);
    this.setParticipants(participants);
  }

  public JsonObject toJson() {
    JsonObject jsonObject = new JsonObject();
    jsonObject.put("name", this.name);
    jsonObject.put("summary", this.summary);
    jsonObject.put("date", this.date);
    jsonObject.put("participants", this.participants);
    JsonArray jsonArray = new JsonArray();
    for (Feedback feedback : feedbacks.values()) {
      jsonArray.add(feedback.toJson());
    }
    jsonObject.put("feedbacks", jsonArray);
    return jsonObject;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getSummary() {
    return summary;
  }

  public void setSummary(String summary) {
    this.summary = summary;
  }

  public String getDate() {
    return date;
  }

  public void setDate(String date) {
    this.date = date;
  }

  public JsonArray getParticipants() {
    return participants;
  }

  public void setParticipants(JsonArray participants) {
    this.participants = participants;
  }

  public Map<String, Feedback> getFeedbacks() {
    return feedbacks;
  }
}
