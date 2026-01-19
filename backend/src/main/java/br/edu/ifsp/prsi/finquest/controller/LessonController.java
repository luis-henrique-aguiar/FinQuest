package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.dto.LessonCompletionDTO;
import br.edu.ifsp.prsi.finquest.dto.LessonDetailsDTO;
import br.edu.ifsp.prsi.finquest.dto.QuizQuestionDTO;
import br.edu.ifsp.prsi.finquest.service.LessonService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lessons")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @GetMapping("/{lessonId}")
    public ResponseEntity<LessonDetailsDTO> getLessonById(@PathVariable String lessonId) {
        LessonDetailsDTO lessonDetails = lessonService.getLessonDetails(lessonId);
        return ResponseEntity.ok(lessonDetails);
    }

    @GetMapping("/{lessonId}/quiz")
    public ResponseEntity<List<QuizQuestionDTO>> getLessonQuiz(@PathVariable String lessonId) {
        List<QuizQuestionDTO> quiz = lessonService.getLessonQuiz(lessonId);
        return ResponseEntity.ok(quiz);
    }

    @PostMapping("/{lessonId}/complete")
    public ResponseEntity<LessonCompletionDTO> completeLesson(
            @PathVariable String lessonId, @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        LessonCompletionDTO reward = lessonService.completeLesson(lessonId, userId);
        return ResponseEntity.ok(reward);
    }

    @GetMapping("/{lessonId}/content")
    public ResponseEntity<String> getLessonContent(@PathVariable String lessonId) {
        String content = lessonService.getLessonContent(lessonId);
        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.TEXT_PLAIN)
                .body(content);
    }
}
