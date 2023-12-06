package com.test.starter;

import com.test.starter.model.Feedback;
import com.test.starter.model.FeedbackType;
import com.test.starter.model.Retrospective;
import com.test.starter.repository.RetrospectiveRepository;
import com.test.starter.repository.RetrospectiveRepositoryImpl;
import io.vertx.core.json.JsonArray;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.junit.VertxUnitRunner;
import org.json.JSONObject;
import org.json.XML;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.runner.RunWith;

import java.util.Map;

@RunWith(VertxUnitRunner.class)
public class RetrospectiveRepositoryTest {
  private RetrospectiveRepository repository;
  private Retrospective retrospective1;
  private Retrospective retrospective2;
  private Retrospective retrospective3;
  private Feedback feedback1;
  private Feedback feedback2;
  @Before
  public void setup() {
    repository = new RetrospectiveRepositoryImpl();
    retrospective1 = new Retrospective(
      "Retrospective 1", "Post release retrospective", "22/07/2022", new JsonArray().add("Viktor"));
    retrospective2 = new Retrospective(
      "Retrospective 2", "Post release retrospective", "28/07/2022", new JsonArray().add("Gareth"));
    retrospective3 = new Retrospective(
      "Retrospective 3", "Post release retrospective", "28/07/2022", new JsonArray().add("Mike"));
    feedback1 = new Feedback("Gareth", "Sprint objective met", FeedbackType.Positive);
    feedback2 = new Feedback("Viktor", "Too many items piled up in the awaiting QA", FeedbackType.Negative);
  }

  @Test
  public void shouldAddRetrospective(TestContext context) {
    repository.addRetrospective(retrospective1, ar -> {
      context.assertTrue(ar.succeeded());
    });
  }

  @Test
  public void shouldNotAddDuplicateRetrospective(TestContext context) {
    repository.addRetrospective(retrospective1, ar -> {
      context.assertTrue(ar.succeeded());
    });
    repository.addRetrospective(retrospective1, ar -> {
      context.assertFalse(ar.succeeded());
    });
  }

  @Test
  public void shouldAddFeedback(TestContext context) {
    repository.addRetrospective(retrospective1, ar -> {
      repository.addFeedback(retrospective1.getName(), feedback1, ar2 -> {
        context.assertTrue(ar2.succeeded());
      });
    });
  }

  @Test
  public void shouldNotAddFeedbackForUnknownRetrospective(TestContext context) {
    repository.addFeedback(retrospective3.getName(), feedback1, ar2 -> {
      context.assertFalse(ar2.succeeded());
    });
  }

  @Test
  public void shouldUpdateFeedback(TestContext context) {
    repository.addRetrospective(retrospective1, ar -> {
      repository.addFeedback(retrospective1.getName(), feedback2, ar2 -> {
        feedback2.setBody("We should be looking to start using VS2015");
        feedback2.setType(FeedbackType.Idea);
        repository.updateFeedback(retrospective1.getName(), feedback2, ar3 -> {
          context.assertTrue(ar3.succeeded());
          Map<String, Feedback> feedbacks = retrospective1.getFeedbacks();
          Feedback feedback = feedbacks.get(feedback2.getName());
          context.assertEquals(feedback.getBody(), "We should be looking to start using VS2015");
          context.assertEquals(feedback.getType(), FeedbackType.Idea);
        });
      });
    });
  }

  @Test
  public void shouldReturnRetrospectivesByCurrentPageAndPageSize(TestContext context) {
    repository.addRetrospective(retrospective1, ar -> {
      repository.addRetrospective(retrospective2, ar2 -> {
        repository.addRetrospective(retrospective3, ar3 -> {
          repository.searchRetrospectives(1, 2, ar4 -> {
            context.assertTrue(ar4.succeeded());
            context.assertEquals(ar4.result().size(), 2);
          });
        });
      });
    });
  }

  @Test
  public void shouldReturnRetrospectivesByDate(TestContext context) {
    repository.addRetrospective(retrospective1, ar -> {
      repository.addRetrospective(retrospective2, ar2 -> {
        repository.addRetrospective(retrospective3, ar3 -> {
          repository.searchRetrospectivesByDate("28/07/2022", null, null , ar4 -> {
            context.assertTrue(ar4.succeeded());
            context.assertEquals(ar4.result().size(), 2);
          });
        });
      });
    });
  }

  @Test
  public void shouldReturnRetrospectivesByDateAndPagination(TestContext context) {
    repository.addRetrospective(retrospective1, ar -> {
      repository.addRetrospective(retrospective2, ar2 -> {
        repository.addRetrospective(retrospective3, ar3 -> {
          repository.searchRetrospectivesByDate("28/07/2022", "1", "1" , ar4 -> {
            context.assertTrue(ar4.succeeded());
            context.assertEquals(ar4.result().size(), 1);
          });
        });
      });
    });
  }

  @Test
  public void givenJsonString_whenConvertToXMLUsingJsonJava_thenConverted() {
    String jsonString = "{\"name\":\"John\", \"age\":20, \"address\":{\"street\":\"Wall Street\", \"city\":\"New York\"}}";
    JSONObject jsonObject = new JSONObject(jsonString);
    String xmlString = XML.toString(jsonObject);
    Assertions.assertEquals("<address><city>New York</city><street>Wall Street</street></address><name>John</name><age>20</age>", xmlString);
  }
}
