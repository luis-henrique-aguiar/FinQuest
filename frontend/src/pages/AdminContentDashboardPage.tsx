import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronRight,
  Edit2,
  Trash2,
  Plus,
  Search,
  FileText,
  CheckCircle,
  Clock,
  FolderPlus,
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import {
  getCoursesWithLessons,
  deleteLesson,
  deleteCourse,
  type CourseWithLessons,
  type LessonSummaryDTO,
} from "../services/contentService";
import CourseModuleModal from "../components/CourseModuleModal";
import * as S from "./AdminContentDashboardPage.styles";

const AdminContentDashboardPage: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<CourseWithLessons[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<any | null>(null);

  useEffect(() => {
    loadCoursesWithLessons();
  }, []);

  const loadCoursesWithLessons = async () => {
    try {
      setLoading(true);
      const data = await getCoursesWithLessons();
      setCourses(data);
    } catch (error) {
      console.error("Erro ao carregar cursos e lições:", error);
      addToast("Erro ao carregar conteúdo", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCourse = (courseId: string) => {
    setExpandedCourses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const handleCreateLesson = () => {
    navigate("/admin/content/new");
  };

  const handleEditLesson = (lessonId: string) => {
    navigate(`/admin/content/edit/${lessonId}`);
  };

  const handleDeleteLesson = async (lessonId: string, lessonTitle: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a lição "${lessonTitle}"?`)) {
      return;
    }

    try {
      await deleteLesson(lessonId);
      addToast("Lição excluída com sucesso", "success");
      loadCoursesWithLessons();
    } catch (error) {
      console.error("Erro ao excluir lição:", error);
      addToast("Erro ao excluir lição", "error");
    }
  };

  const handleExpandAll = () => {
    setExpandedCourses(new Set(courses.map((c) => c.id)));
  };

  const handleCollapseAll = () => {
    setExpandedCourses(new Set());
  };

  const handleCreateModule = () => {
    setEditingModule(null);
    setModuleModalOpen(true);
  };

  const handleEditModule = (course: CourseWithLessons) => {
    setEditingModule({
      id: course.id,
      title: course.title,
      description: course.description,
      icon: '📚',
      recFinPoints: 100,
    });
    setModuleModalOpen(true);
  };

  const handleDeleteModule = async (courseId: string, courseTitle: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o módulo "${courseTitle}"?`)) {
      return;
    }

    try {
      await deleteCourse(courseId);
      addToast("Módulo excluído com sucesso", "success");
      loadCoursesWithLessons();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Erro ao excluir módulo";
      addToast(errorMessage, "error");
    }
  };

  // Filtrar cursos e lições com base na busca
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) {
      return courses;
    }

    const query = searchQuery.toLowerCase();
    return courses
      .map((course) => {
        const matchesCourse = course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query);

        const filteredLessons = course.lessons.filter((lesson) =>
          lesson.title.toLowerCase().includes(query)
        );

        if (matchesCourse || filteredLessons.length > 0) {
          return {
            ...course,
            lessons: matchesCourse ? course.lessons : filteredLessons,
          };
        }
        return null;
      })
      .filter((course): course is CourseWithLessons => course !== null);
  }, [courses, searchQuery]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const totalLessons = courses.reduce((acc, course) => acc + course.lessons.length, 0);
    const publishedLessons = courses.reduce(
      (acc, course) => acc + course.lessons.filter((l) => !l.isDraft).length,
      0
    );
    const draftLessons = totalLessons - publishedLessons;

    return { totalCourses, totalLessons, publishedLessons, draftLessons };
  }, [courses]);

  if (loading) {
    return (
      <S.PageContainer>
        <S.LoadingContainer>
          <div className="spinner" />
          <p>Carregando dashboard de conteúdo...</p>
        </S.LoadingContainer>
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer>
      <S.Header>
        <S.Title>
          <BookOpen size={32} />
          Dashboard de Conteúdo
        </S.Title>
        <S.Subtitle>
          Gerencie cursos, módulos e lições da plataforma
        </S.Subtitle>
      </S.Header>

      {/* Estatísticas */}
      <S.StatsGrid>
        <S.StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <S.StatLabel>Total de Cursos</S.StatLabel>
          <S.StatValue>{stats.totalCourses}</S.StatValue>
        </S.StatCard>

        <S.StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <S.StatLabel>Total de Lições</S.StatLabel>
          <S.StatValue>{stats.totalLessons}</S.StatValue>
        </S.StatCard>

        <S.StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <S.StatLabel>Lições Publicadas</S.StatLabel>
          <S.StatValue>{stats.publishedLessons}</S.StatValue>
        </S.StatCard>

        <S.StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <S.StatLabel>Rascunhos</S.StatLabel>
          <S.StatValue>{stats.draftLessons}</S.StatValue>
        </S.StatCard>
      </S.StatsGrid>

      {/* Barra de ação */}
      <S.ActionBar>
        <S.SearchContainer>
          <S.SearchIcon>
            <Search size={18} />
          </S.SearchIcon>
          <S.SearchInput
            type="text"
            placeholder="Buscar cursos ou lições..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </S.SearchContainer>

        <S.ButtonGroup>
          <S.ActionButton $variant="outline" onClick={handleExpandAll}>
            Expandir Todos
          </S.ActionButton>
          <S.ActionButton $variant="outline" onClick={handleCollapseAll}>
            Recolher Todos
          </S.ActionButton>
          <S.ActionButton $variant="primary" onClick={handleCreateModule}>
            <FolderPlus size={16} />
            Novo Módulo
          </S.ActionButton>
          <S.ActionButton $variant="primary" onClick={handleCreateLesson}>
            <Plus size={16} />
            Nova Lição
          </S.ActionButton>
        </S.ButtonGroup>
      </S.ActionBar>

      {/* Lista de cursos */}
      {filteredCourses.length === 0 ? (
        <S.EmptyState>
          <BookOpen />
          <h3>Nenhum conteúdo encontrado</h3>
          <p>
            {searchQuery
              ? "Nenhum curso ou lição corresponde à sua busca"
              : "Ainda não há conteúdo cadastrado. Clique em 'Nova Lição' para começar."}
          </p>
        </S.EmptyState>
      ) : (
        <S.CoursesContainer>
          {filteredCourses.map((course) => {
            const isExpanded = expandedCourses.has(course.id);

            return (
              <S.CourseCard
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <S.CourseHeader
                  $isExpanded={isExpanded}
                  onClick={() => handleToggleCourse(course.id)}
                >
                  <S.ExpandIcon $isExpanded={isExpanded}>
                    <ChevronRight />
                  </S.ExpandIcon>

                  <S.CourseIcon>
                    <BookOpen />
                  </S.CourseIcon>

                  <S.CourseInfo>
                    <S.CourseTitle>{course.title}</S.CourseTitle>
                    <S.CourseDescription>{course.description}</S.CourseDescription>
                  </S.CourseInfo>

                  <S.CourseBadge>
                    {course.lessons.length}{" "}
                    {course.lessons.length === 1 ? "lição" : "lições"}
                  </S.CourseBadge>

                  <S.ModuleActions onClick={(e) => e.stopPropagation()}>
                    <S.IconButton
                      onClick={() => handleEditModule(course)}
                      title="Editar módulo"
                    >
                      <Edit2 size={16} />
                    </S.IconButton>
                    <S.IconButton
                      className="danger"
                      onClick={() => handleDeleteModule(course.id, course.title)}
                      title="Excluir módulo"
                    >
                      <Trash2 size={16} />
                    </S.IconButton>
                  </S.ModuleActions>
                </S.CourseHeader>

                {isExpanded && (
                  <S.LessonsList
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {course.lessons.length === 0 ? (
                      <S.EmptyState>
                        <FileText />
                        <p>Nenhuma lição cadastrada para este curso</p>
                      </S.EmptyState>
                    ) : (
                      course.lessons.map((lesson) => (
                        <S.LessonItem
                          key={lesson.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <S.LessonOrder>{lesson.lessonOrder}</S.LessonOrder>

                          <S.LessonInfo>
                            <S.LessonTitle>{lesson.title}</S.LessonTitle>
                            <S.LessonMeta>
                              <S.LessonBadge
                                $variant={lesson.isDraft ? "draft" : "published"}
                              >
                                {lesson.isDraft ? (
                                  <>
                                    <Clock size={12} />
                                    Rascunho
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle size={12} />
                                    Publicado
                                  </>
                                )}
                              </S.LessonBadge>
                            </S.LessonMeta>
                          </S.LessonInfo>

                          <S.LessonActions>
                            <S.IconButton
                              onClick={() => handleEditLesson(lesson.id)}
                              title="Editar lição"
                            >
                              <Edit2 />
                            </S.IconButton>
                            <S.IconButton
                              className="danger"
                              onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                              title="Excluir lição"
                            >
                              <Trash2 />
                            </S.IconButton>
                          </S.LessonActions>
                        </S.LessonItem>
                      ))
                    )}
                  </S.LessonsList>
                )}
              </S.CourseCard>
            );
          })}
        </S.CoursesContainer>
      )}

      <CourseModuleModal
        isOpen={moduleModalOpen}
        onClose={() => setModuleModalOpen(false)}
        onSuccess={loadCoursesWithLessons}
        editingCourse={editingModule}
      />
    </S.PageContainer>
  );
};

export default AdminContentDashboardPage;
