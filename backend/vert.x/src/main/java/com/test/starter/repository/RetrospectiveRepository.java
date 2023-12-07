package com.test.starter.repository;

import com.test.starter.model.Feedback;
import com.test.starter.model.Retrospective;
import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonObject;

import java.util.List;

public interface RetrospectiveRepository {

  void addRetrospective(Retrospective retrospective, Handler<AsyncResult<JsonObject>> resultHandler);

  void addFeedback(String retroName, Feedback feedback, Handler<AsyncResult<JsonObject>> resultHandler);

  void updateFeedback(String retroName, Feedback feedback, Handler<AsyncResult<Void>> resultHandler);

  void searchRetrospectives(int currentPage, int pageSize, Handler<AsyncResult<List<JsonObject>>> resultHandler);

  void searchRetrospectivesByDate(String date, String currentPageParam, String pageSizeParam, Handler<AsyncResult<List<JsonObject>>> resultHandler);

}
