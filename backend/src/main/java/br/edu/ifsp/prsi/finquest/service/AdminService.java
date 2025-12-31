package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.AdminStatsDTO;
import br.edu.ifsp.prsi.finquest.dto.CourseSimpleDTO;
import br.edu.ifsp.prsi.finquest.dto.CourseWithLessonsDTO;
import br.edu.ifsp.prsi.finquest.dto.UserSummaryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminService {

    AdminStatsDTO getSystemStats();

    Page<UserSummaryDTO> getAllUsers(Pageable pageable);

    void promoteUserToAdmin(String targetUserId, String adminUserId);

    List<CourseSimpleDTO> getAllCourses();

    List<CourseWithLessonsDTO> getAllCoursesWithLessons();

}
