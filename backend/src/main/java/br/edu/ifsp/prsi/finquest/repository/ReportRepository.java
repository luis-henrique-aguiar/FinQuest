package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.model.Report;
import br.edu.ifsp.prsi.finquest.model.ReportStatus;
import br.edu.ifsp.prsi.finquest.model.ReportType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    // Find reports by status
    @Query("SELECT r FROM Report r WHERE r.status = :status ORDER BY r.createdAt DESC")
    Page<Report> findByStatus(@Param("status") ReportStatus status, Pageable pageable);

    // Find reports by type
    @Query("SELECT r FROM Report r WHERE r.reportType = :type ORDER BY r.createdAt DESC")
    Page<Report> findByReportType(@Param("type") ReportType type, Pageable pageable);

    // Find reports for a specific post
    @Query("SELECT r FROM Report r WHERE r.post.id = :postId ORDER BY r.createdAt DESC")
    List<Report> findByPostId(@Param("postId") Long postId);

    // Find reports for a specific comment
    @Query("SELECT r FROM Report r WHERE r.comment.id = :commentId ORDER BY r.createdAt DESC")
    List<Report> findByCommentId(@Param("commentId") Long commentId);

    // Count pending reports
    long countByStatus(ReportStatus status);

    // Count reports for a post
    long countByPostId(Long postId);

    // Count reports for a comment
    long countByCommentId(Long commentId);

    // Find reports by reporter
    @Query("SELECT r FROM Report r WHERE r.reporter.id = :reporterId ORDER BY r.createdAt DESC")
    Page<Report> findByReporterId(@Param("reporterId") Long reporterId, Pageable pageable);

    // Find all reports for moderation (pending and analyzed)
    @Query("SELECT r FROM Report r WHERE r.status IN ('PENDING', 'ANALYZED') ORDER BY r.createdAt DESC")
    Page<Report> findPendingReports(Pageable pageable);

    // Check if user already reported a post
    boolean existsByReporterIdAndPostId(String reporterId, Long postId);

    // Check if user already reported a comment
    boolean existsByReporterIdAndCommentId(String reporterId, Long commentId);
}
