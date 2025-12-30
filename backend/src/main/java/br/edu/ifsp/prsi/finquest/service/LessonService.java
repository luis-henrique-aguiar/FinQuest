package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.*;

import java.util.List;

public interface LessonService {

    LessonDetailsDTO getLessonDetails(String lessonId);

    List<QuizQuestionDTO> getLessonQuiz(String lessonId);

    LessonCompletionDTO completeLesson(String lessonId, String userId);

    // Content Management Methods
    LessonDetailsDTO createLesson(LessonCreateDTO dto);

    LessonDetailsDTO updateLesson(String lessonId, LessonUpdateDTO dto);

    void deleteLesson(String lessonId);

    List<LessonSummaryDTO> getAllLessonsForAdmin(String courseId, Boolean isDraft);

    void updateLessonQuiz(String lessonId, List<QuizCreateDTO> questions);

}
