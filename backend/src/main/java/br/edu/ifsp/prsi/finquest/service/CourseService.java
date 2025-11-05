package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.CourseProgressDTO;

import java.util.List;

public interface CourseService {

    List<CourseProgressDTO> getCoursesForUser(String userId);

}
