package com.taskflow;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = "frontend.url=http://localhost:5173")
class TaskflowApplicationTests {

	@Test
	void contextLoads() {
	}

}
