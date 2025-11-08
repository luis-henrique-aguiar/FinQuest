package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.LessonDetailsDTO;

public interface LessonService {

    LessonDetailsDTO getLessonDetails(String lessonId);

}
