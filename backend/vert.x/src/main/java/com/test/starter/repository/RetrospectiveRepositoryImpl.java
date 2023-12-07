package com.test.starter.repository;

import com.test.starter.model.Feedback;
import com.test.starter.model.Retrospective;
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonObject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.*;
import java.util.stream.Collectors;

import static java.lang.Math.min;

public class RetrospectiveRepositoryImpl implements RetrospectiveRepository {
  private static final Logger LOGGER = LogManager.getLogger(RetrospectiveRepositoryImpl.class);
  Map<String, Retrospective> repository = new LinkedHashMap<>();

  @Override
  public void addRetrospective(Retrospective retrospective, Handler<AsyncResult<JsonObject>> resultHandler) {
    final String name = retrospective.getName();
    if (repository.containsKey(name)) {
      resultHandler.handle(Future.failedFuture("Retrospective name already exists"));
    } else {
      repository.put(name, retrospective);
      resultHandler.handle(Future.succeededFuture(retrospective.toJson()));
    }
  }

  @Override
  public void addFeedback(String retroName, Feedback feedback, Handler<AsyncResult<JsonObject>> resultHandler) {
    final Retrospective retrospective = repository.get(retroName);
    if (retrospective == null) {
      resultHandler.handle(Future.failedFuture("Retrospective name does not exist"));
    } else {
      final Map<String, Feedback> feedbacks = retrospective.getFeedbacks();
      final String name = feedback.getName();
      if (feedbacks.containsKey(name)) {
        resultHandler.handle(Future.failedFuture("Feedback name already exists"));
      } else {
        feedbacks.put(name, feedback);
        resultHandler.handle(Future.succeededFuture(retrospective.toJson()));
      }
    }
  }

  @Override
  public void updateFeedback(String retroName, Feedback feedback, Handler<AsyncResult<Void>> resultHandler) {
    final Retrospective retrospective = repository.get(retroName);
    if (retrospective == null) {
      resultHandler.handle(Future.failedFuture("Retrospective name does not exist"));
    } else {
      final Map<String, Feedback> feedbacks = retrospective.getFeedbacks();
      final String name = feedback.getName();
      feedbacks.put(name, feedback);
      resultHandler.handle(Future.succeededFuture());
    }
  }

  @Override
  public void searchRetrospectives(int currentPage, int pageSize, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    final List<JsonObject> list = new ArrayList<>();
    final int repositorySize = repository.values().size();
    final int startIndex = (currentPage - 1) * pageSize;
    final int endIndex = min(repositorySize, startIndex + pageSize);
    int counter = 0;
    for (Retrospective retrospective : repository.values()) {
      counter++;
      if (counter > endIndex) break;
      if (counter > startIndex && counter <= endIndex) {
        list.add(retrospective.toJson());
      }
    }
    resultHandler.handle(Future.succeededFuture(list));
  }

  @Override
  public void searchRetrospectivesByDate(String date, String currentPageParam, String pageSizeParam, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    final List<JsonObject> list = new ArrayList<>();
    final List<Retrospective> retrospectives = repository.values().stream()
      .filter(retrospective -> retrospective.getDate().equals(date)).collect(Collectors.toList());
    int currentPage = 0;
    int pageSize = 0;
    try {
      currentPage = Integer.parseInt(currentPageParam);
      pageSize = Integer.parseInt(pageSizeParam);
    } catch (Exception e) {
      LOGGER.debug("Invalid currentPage {} and pageSize {}", currentPageParam, pageSizeParam);
    }
    if (currentPage > 0 && pageSize > 0) {
      final int retrospectivesSize = retrospectives.size();
      final int startIndex = (currentPage - 1) * pageSize;
      final int endIndex = min(retrospectivesSize, startIndex + pageSize);
      int counter = 0;
      for (Retrospective retrospective : repository.values()) {
        counter++;
        if (counter > endIndex) break;
        if (counter > startIndex && counter <= endIndex) {
          list.add(retrospective.toJson());
        }
      }
    } else {
      retrospectives.forEach(retrospective -> {
        list.add(retrospective.toJson());
      });
    }
    resultHandler.handle(Future.succeededFuture(list));
  }
}
