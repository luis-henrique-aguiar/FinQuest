package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.CourseDetailsDTO;
import br.edu.ifsp.prsi.finquest.dto.CourseProgressDTO;

import java.util.List;

public interface CourseService {

    List<CourseProgressDTO> getCoursesForUser(String userId);

    CourseDetailsDTO getCourseDetailsForUser(String courseId, String userId);

}
