package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.LessonCompletionDTO;
import br.edu.ifsp.prsi.finquest.dto.LessonDetailsDTO;
import br.edu.ifsp.prsi.finquest.dto.QuizQuestionDTO;

import java.util.List;

public interface LessonService {

    LessonDetailsDTO getLessonDetails(String lessonId);

    List<QuizQuestionDTO> getLessonQuiz(String lessonId);

    LessonCompletionDTO completeLesson(String lessonId, String userId);

}
