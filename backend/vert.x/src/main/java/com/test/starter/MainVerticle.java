package com.test.starter;

import com.test.starter.model.Feedback;
import com.test.starter.model.FeedbackType;
import com.test.starter.model.Retrospective;
import com.test.starter.repository.RetrospectiveRepository;
import com.test.starter.repository.RetrospectiveRepositoryImpl;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.MultiMap;
import io.vertx.core.Promise;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CorsHandler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;

public class MainVerticle extends AbstractVerticle {

  private static final Logger LOGGER = LogManager.getLogger(MainVerticle.class);
  private final RetrospectiveRepository repository = new RetrospectiveRepositoryImpl();

  public static void main(String[] args) {
    Vertx vertx = Vertx.vertx();
    vertx.deployVerticle(MainVerticle.class.getName());
  }
  @Override
  public void start(Promise<Void> startPromise) {

    final Router router = Router.router(this.vertx);

    router.route().handler(CorsHandler.create("*")
                            .allowedMethods(ofAllowMethods()));

    router.route().handler(BodyHandler.create());

    router.post("/addRetrospective").handler(this::addRetrospective);
    router.post("/addFeedback").handler(this::addFeedback);
    router.put("/updateFeedback").handler(this::updateFeedback);
    router.get("/searchRetrospective").handler(this::searchRetrospective);
    router.get("/searchRetrospectiveByDate").handler(this::searchRetrospectiveByDate);

    vertx.createHttpServer().requestHandler(router).listen(8888, http -> {
      if (http.succeeded()) {
        startPromise.complete();
        System.out.println("HTTP server started on port 8888");
      } else {
        startPromise.fail(http.cause());
      }
    });
  }

  private Set<HttpMethod> ofAllowMethods() {
    Set<HttpMethod> allowedMethods = new HashSet<>();
    allowedMethods.add(HttpMethod.GET);
    allowedMethods.add(HttpMethod.POST);
    allowedMethods.add(HttpMethod.PUT);
    allowedMethods.add(HttpMethod.OPTIONS);
    return allowedMethods;
  }

  private void addRetrospective(RoutingContext rc) {
    final JsonObject bodyJson = rc.body().asJsonObject();
    LOGGER.info("Add retrospective: {}", bodyJson.toString());

    final String name = bodyJson.getString("name");
    final String summary = bodyJson.getString("summary");
    final String date = bodyJson.getString("date");
    final JsonArray participants = bodyJson.getJsonArray("participants");

    if (validateRetrospective(name, summary, date, participants)) {
      final Retrospective retrospective = new Retrospective(name, summary, date, participants);
      repository.addRetrospective(retrospective, ar -> {
        if (ar.succeeded()) {
          rc.response().setStatusCode(201).putHeader("content-type", "application/json").end(ar.result().toString());
        } else {
          rc.response().setStatusCode(409).end(ar.cause().getMessage());
        }
      });
    } else {
      rc.fail(400);
    }
  }

  private void addFeedback(RoutingContext rc) {
    final JsonObject bodyJson = rc.body().asJsonObject();
    LOGGER.info("Add feedback: {}", bodyJson.toString());

    final String retroName = bodyJson.getString("retroName");
    final String name = bodyJson.getString("name");
    final String body = bodyJson.getString("body");
    final String typeString = formatTypeString(bodyJson.getString("type"));

    try {
      final FeedbackType type = FeedbackType.valueOf(typeString);

      if (validateFeedback(retroName, name, body)) {
        final Feedback feedback = new Feedback(name, body, type);
        repository.addFeedback(retroName, feedback, ar -> {
          if (ar.succeeded()) {
            rc.response().setStatusCode(201).putHeader("content-type", "application/json").end(ar.result().toString());
          } else {
            final String message = ar.cause().getMessage();
            if (message.equals("Retrospective name does not exist")) {
              rc.response().setStatusCode(404).end(message);
            } else {
              rc.response().setStatusCode(409).end(message);
            }
          }
        });
      } else {
        rc.fail(400);
      }
    } catch (Exception e) {
      LOGGER.error("Invalid feedback type: {}", typeString);
      rc.fail(400);
    }
  }

  private void updateFeedback(RoutingContext rc) {
    final JsonObject bodyJson = rc.body().asJsonObject();
    LOGGER.info("Update feedback: {}", bodyJson.toString());

    final String retroName = bodyJson.getString("retroName");
    final String name = bodyJson.getString("name");
    final String body = bodyJson.getString("body");
    final String typeString = formatTypeString(bodyJson.getString("type"));

    try {
      final FeedbackType type = FeedbackType.valueOf(typeString);

      if (validateFeedback(retroName, name, body)) {
        final Feedback feedback = new Feedback(name, body, type);
        repository.updateFeedback(retroName, feedback, ar -> {
          if (ar.succeeded()) {
            rc.response().setStatusCode(200).end();
          } else {
            rc.response().setStatusCode(404).end(ar.cause().getMessage());
          }
        });
      } else {
        rc.fail(400);
      }
    } catch (Exception e) {
      LOGGER.error("Invalid feedback type: {}", typeString);
      rc.fail(400);
    }
  }

  private void searchRetrospective(RoutingContext rc) {
    final HttpServerRequest request = rc.request();
    final MultiMap params =  request.params();
    final String currentPageParam = params.get("currentPage");
    final String pageSizeParam = params.get("pageSize");
    final String accept = request.headers().get("Accept");
    try {
      final int currentPage = Integer.parseInt(currentPageParam);
      final int pageSize = Integer.parseInt(pageSizeParam);
      if (currentPage > 0 && pageSize > 0) {
        repository.searchRetrospectives(currentPage, pageSize, ar -> {
          final List<JsonObject> result = ar.result();
          dynamicReturn(rc, accept, result);
        });
      } else {
        LOGGER.error("Invalid currentPage {} and  pageSize: {}", currentPageParam, pageSizeParam);
        rc.fail(400);
      }
    } catch (Exception e) {
      LOGGER.error("Invalid currentPage {} and  pageSize: {}", currentPageParam, pageSizeParam);
      rc.fail(400);
    }
  }

  private void searchRetrospectiveByDate(RoutingContext rc) {
    final HttpServerRequest request = rc.request();
    final MultiMap params =  request.params();
    final String date = params.get("date");
    final String currentPage = params.get("currentPage");
    final String pageSize = params.get("pageSize");
    final String accept = request.headers().get("Accept");

    if (date != null && isValidateDateFormat(date)) {
      repository.searchRetrospectivesByDate(date, currentPage, pageSize, ar -> {
        final List<JsonObject> result = ar.result();
        dynamicReturn(rc, accept, result);
      });
    } else {
      LOGGER.error("Invalid date: {}", date);
      rc.fail(400);
    }
  }

  private boolean validateRetrospective(String name, String summary, String date, JsonArray participants) {
    if (name == null || name.trim().isEmpty()) {
      LOGGER.error("Invalid retrospective name: {}", name);
      return false;
    }
    if (summary == null || summary.trim().isEmpty()) {
      LOGGER.error("Invalid retrospective summary: {}", summary);
      return false;
    }
    if (date == null || !isValidateDateFormat(date)) {
      LOGGER.error("Invalid retrospective date: {}", date);
      return false;
    }
    if (participants == null || participants.size() == 0) {
      LOGGER.error("Invalid retrospective participants: {}", participants);
      return false;
    }
    return true;
  }

  private boolean validateFeedback(String retroName, String name, String body) {
    if (retroName == null || retroName.trim().isEmpty()) {
      LOGGER.error("Invalid retrospective name: {}", retroName);
      return false;
    }
    if (name == null || name.trim().isEmpty()) {
      LOGGER.error("Invalid feedback name: {}", name);
      return false;
    }
    if (body == null || body.trim().isEmpty()) {
      LOGGER.error("Invalid feedback body: {}", body);
      return false;
    }
    return true;
  }

  private String formatTypeString(String type) {
      if (type != null) {
        return type.substring(0, 1).toUpperCase() + type.substring(1).toLowerCase();
      }
      return null;
  }

  private boolean isValidateDateFormat(String date) {
    return date.matches("([0-9]{2})/([0-9]{2})/([0-9]{4})");
  }

  private void dynamicReturn(RoutingContext rc, String accept, List<JsonObject> result) {
    if (accept.equals("text/xml")) {
      JSONArray jsonArray = new JSONArray();
      for (JsonObject retrospective: result) {
        JSONObject jsonObject = new JSONObject(retrospective.toString());
        jsonArray.put(jsonObject);
      }
      String xmlText = XML.toString(jsonArray);
      rc.response()
        .putHeader("content-type", "text/xml")
        .setStatusCode(200)
        .end(xmlText);
    } else {
      rc.response()
        .putHeader("content-type", "application/json")
        .setStatusCode(200)
        .end(result.toString());
    }
  }
}
