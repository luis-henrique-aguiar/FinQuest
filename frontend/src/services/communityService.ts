import api from "./api";

// ========================================
// Types & Interfaces
// ========================================

export interface UserSimpleDTO {
  id: number;
  name: string;
  email: string;
  photoUrl?: string;
  level: number;
  totalXp: number;
  followerCount?: number;
  followingCount?: number;
}

export const PostType = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  ACHIEVEMENT: "ACHIEVEMENT",
  TIP: "TIP",
  QUESTION: "QUESTION",
  STORY: "STORY",
} as const;

export type PostType = (typeof PostType)[keyof typeof PostType];

export const PostCategory = {
  CONQUISTAS: "CONQUISTAS",
  DICAS: "DICAS",
  HISTORIAS: "HISTORIAS",
  PERGUNTAS: "PERGUNTAS",
  METAS: "METAS",
  GERAL: "GERAL",
} as const;

export type PostCategory = (typeof PostCategory)[keyof typeof PostCategory];

export const PostStatus = {
  ACTIVE: "ACTIVE",
  MODERATED: "MODERATED",
  REMOVED: "REMOVED",
} as const;

export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus];

export const ReactionType = {
  LIKE: "LIKE",
  CELEBRATE: "CELEBRATE",
  INSIGHT: "INSIGHT",
  INSPIRING: "INSPIRING",
  LOVE: "LOVE",
} as const;

export type ReactionType = (typeof ReactionType)[keyof typeof ReactionType];

export const ReportType = {
  SPAM: "SPAM",
  INAPPROPRIATE_CONTENT: "INAPPROPRIATE_CONTENT",
  MISINFORMATION: "MISINFORMATION",
  HARASSMENT: "HARASSMENT",
  OTHER: "OTHER",
} as const;

export type ReportType = (typeof ReportType)[keyof typeof ReportType];

export interface PostDTO {
  id: number;
  author: UserSimpleDTO;
  type: PostType;
  category: PostCategory;
  content: string;
  hashtags?: string;
  imageUrls?: string[];
  relatedLessonId?: number;
  relatedGoalId?: number;
  status: PostStatus;
  reactionCount: number;
  commentCount: number;
  shareCount: number;
  reactionsByType: { [key: string]: number };
  currentUserReacted?: boolean;
  currentUserFollowsAuthor?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostCreateDTO {
  type: PostType;
  category: PostCategory;
  content: string;
  hashtags?: string;
  imageUrls?: string[];
  relatedLessonId?: number;
  relatedGoalId?: number;
}

export interface CommentDTO {
  id: number;
  postId: number;
  author: UserSimpleDTO;
  content: string;
  markedAsUseful: boolean;
  reactionCount: number;
  currentUserReacted?: boolean;
  replies?: CommentDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface CommentCreateDTO {
  postId: number;
  content: string;
  parentId?: number;
}

export interface ReportCreateDTO {
  reportType: ReportType;
  description?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// ========================================
// Post Operations
// ========================================

export const createPost = async (postData: PostCreateDTO): Promise<PostDTO> => {
  try {
    const response = await api.post("/community/posts", postData);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error(
        error.response?.data?.message ||
          "Limite diário de posts atingido ou dados inválidos"
      );
    }
    throw new Error("Erro ao criar post. Tente novamente.");
  }
};

export const getPostById = async (postId: number): Promise<PostDTO> => {
  try {
    const response = await api.get(`/community/posts/${postId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Post não encontrado");
    }
    throw new Error("Erro ao carregar post. Tente novamente.");
  }
};

export const getForYouFeed = async (
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<PostDTO>> => {
  const response = await api.get("/community/posts/feed/for-you", {
    params: { page, size },
  });
  return response.data;
};

export const getFollowingFeed = async (
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<PostDTO>> => {
  const response = await api.get("/community/posts/feed/following", {
    params: { page, size },
  });
  return response.data;
};

export const getExploreFeed = async (
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<PostDTO>> => {
  const response = await api.get("/community/posts/feed/explore", {
    params: { page, size },
  });
  return response.data;
};

export const getPostsByCategory = async (
  category: PostCategory,
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<PostDTO>> => {
  const response = await api.get(`/community/posts/category/${category}`, {
    params: { page, size },
  });
  return response.data;
};

export const getPostsByType = async (
  type: PostType,
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<PostDTO>> => {
  const response = await api.get(`/community/posts/type/${type}`, {
    params: { page, size },
  });
  return response.data;
};

export const getPostsByAuthor = async (
  authorId: number,
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<PostDTO>> => {
  const response = await api.get(`/community/posts/author/${authorId}`, {
    params: { page, size },
  });
  return response.data;
};

export const searchPosts = async (
  keyword: string,
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<PostDTO>> => {
  const response = await api.get("/community/posts/search", {
    params: { keyword, page, size },
  });
  return response.data;
};

export const updatePost = async (
  postId: number,
  postData: PostCreateDTO
): Promise<PostDTO> => {
  try {
    const response = await api.put(`/community/posts/${postId}`, postData);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Você não tem permissão para editar este post");
    }
    if (error.response?.status === 404) {
      throw new Error("Post não encontrado");
    }
    throw new Error("Erro ao atualizar post. Tente novamente.");
  }
};

export const deletePost = async (postId: number): Promise<void> => {
  try {
    await api.delete(`/community/posts/${postId}`);
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Você não tem permissão para deletar este post");
    }
    if (error.response?.status === 404) {
      throw new Error("Post não encontrado");
    }
    throw new Error("Erro ao deletar post. Tente novamente.");
  }
};

export const createAchievementPost = async (
  achievementType: string,
  achievementDetails: string
): Promise<PostDTO> => {
  const response = await api.post("/community/posts/achievement", null, {
    params: { achievementType, achievementDetails },
  });
  return response.data;
};

// ========================================
// Comment Operations
// ========================================

export const createComment = async (
  commentData: CommentCreateDTO
): Promise<CommentDTO> => {
  try {
    const response = await api.post("/community/comments", commentData);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Post não encontrado");
    }
    throw new Error("Erro ao criar comentário. Tente novamente.");
  }
};

export const getCommentsByPostId = async (
  postId: number,
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<CommentDTO>> => {
  const response = await api.get(`/community/posts/${postId}/comments`, {
    params: { page, size },
  });
  return response.data;
};

export const deleteComment = async (commentId: number): Promise<void> => {
  try {
    await api.delete(`/community/comments/${commentId}`);
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Você não tem permissão para deletar este comentário");
    }
    if (error.response?.status === 404) {
      throw new Error("Comentário não encontrado");
    }
    throw new Error("Erro ao deletar comentário. Tente novamente.");
  }
};

export const markCommentAsUseful = async (
  commentId: number
): Promise<CommentDTO> => {
  try {
    const response = await api.put(
      `/community/comments/${commentId}/mark-useful`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error(
        "Apenas o autor do post pode marcar comentários como úteis"
      );
    }
    if (error.response?.status === 404) {
      throw new Error("Comentário não encontrado");
    }
    throw new Error("Erro ao marcar comentário como útil. Tente novamente.");
  }
};

// ========================================
// Reaction Operations
// ========================================

export const addReactionToPost = async (
  postId: number,
  reactionType: ReactionType
): Promise<void> => {
  try {
    await api.post(`/community/posts/${postId}/reactions`, null, {
      params: { reactionType },
    });
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Post não encontrado");
    }
    throw new Error("Erro ao adicionar reação. Tente novamente.");
  }
};

export const removeReactionFromPost = async (postId: number): Promise<void> => {
  await api.delete(`/community/posts/${postId}/reactions`);
};

export const addReactionToComment = async (
  commentId: number,
  reactionType: ReactionType
): Promise<void> => {
  await api.post(`/community/comments/${commentId}/reactions`, null, {
    params: { reactionType },
  });
};

export const removeReactionFromComment = async (
  commentId: number
): Promise<void> => {
  await api.delete(`/community/comments/${commentId}/reactions`);
};

// ========================================
// Follow Operations
// ========================================

export const followUser = async (userId: number): Promise<void> => {
  try {
    await api.post(`/community/users/${userId}/follow`);
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error(
        error.response?.data?.message || "Não é possível seguir este usuário"
      );
    }
    if (error.response?.status === 404) {
      throw new Error("Usuário não encontrado");
    }
    throw new Error("Erro ao seguir usuário. Tente novamente.");
  }
};

export const unfollowUser = async (userId: number): Promise<void> => {
  try {
    await api.delete(`/community/users/${userId}/follow`);
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error("Você não segue este usuário");
    }
    if (error.response?.status === 404) {
      throw new Error("Usuário não encontrado");
    }
    throw new Error("Erro ao deixar de seguir usuário. Tente novamente.");
  }
};

export const isFollowing = async (userId: number): Promise<boolean> => {
  const response = await api.get(`/community/users/${userId}/is-following`);
  return response.data;
};

export const getFollowerCount = async (userId: number): Promise<number> => {
  const response = await api.get(`/community/users/${userId}/followers-count`);
  return response.data;
};

export const getFollowingCount = async (userId: number): Promise<number> => {
  const response = await api.get(`/community/users/${userId}/following-count`);
  return response.data;
};

// ========================================
// Report Operations
// ========================================

export const reportPost = async (
  postId: number,
  reportData: ReportCreateDTO
): Promise<void> => {
  try {
    await api.post(`/community/posts/${postId}/report`, reportData);
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error("Você já denunciou este post");
    }
    if (error.response?.status === 404) {
      throw new Error("Post não encontrado");
    }
    throw new Error("Erro ao denunciar post. Tente novamente.");
  }
};

export const reportComment = async (
  commentId: number,
  reportData: ReportCreateDTO
): Promise<void> => {
  try {
    await api.post(`/community/comments/${commentId}/report`, reportData);
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error("Você já denunciou este comentário");
    }
    if (error.response?.status === 404) {
      throw new Error("Comentário não encontrado");
    }
    throw new Error("Erro ao denunciar comentário. Tente novamente.");
  }
};

// ========================================
// User Profile Operations
// ========================================

export const getUserProfile = async (
  userId: number
): Promise<UserSimpleDTO> => {
  const response = await api.get(`/community/users/${userId}/profile`);
  return response.data;
};

// ========================================
// Helper Functions
// ========================================

export const getReactionIcon = (type: ReactionType): string => {
  const icons: { [key in ReactionType]: string } = {
    LIKE: "👍",
    CELEBRATE: "🎉",
    INSIGHT: "💡",
    INSPIRING: "💪",
    LOVE: "❤️",
  };
  return icons[type];
};

export const getReactionLabel = (type: ReactionType): string => {
  const labels: { [key in ReactionType]: string } = {
    LIKE: "Curtir",
    CELEBRATE: "Parabéns",
    INSIGHT: "Ótima dica",
    INSPIRING: "Inspirador",
    LOVE: "Amei",
  };
  return labels[type];
};

export const getCategoryLabel = (category: PostCategory): string => {
  const labels: { [key in PostCategory]: string } = {
    CONQUISTAS: "Conquistas",
    DICAS: "Dicas e Aprendizado",
    HISTORIAS: "Histórias Pessoais",
    PERGUNTAS: "Perguntas e Respostas",
    METAS: "Metas e Progresso",
    GERAL: "Geral",
  };
  return labels[category];
};

export const getTypeLabel = (type: PostType): string => {
  const labels: { [key in PostType]: string } = {
    TEXT: "Texto",
    IMAGE: "Imagem",
    ACHIEVEMENT: "Conquista",
    TIP: "Dica",
    QUESTION: "Pergunta",
    STORY: "História",
  };
  return labels[type];
};

export const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "agora";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}min`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}sem`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}m`;
  return `${Math.floor(seconds / 31536000)}a`;
};
