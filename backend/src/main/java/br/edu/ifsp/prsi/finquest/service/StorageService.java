package br.edu.ifsp.prsi.finquest.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface StorageService {
    
    /**
     * Faz upload de um arquivo markdown para o Firebase Storage
     * @param file Arquivo markdown a ser enviado
     * @param lessonId ID da lição para criar o path único
     * @return URL pública do arquivo no storage
     */
    String uploadLessonContent(MultipartFile file, String lessonId) throws IOException;
    
    /**
     * Faz upload de conteúdo markdown como string
     * @param content Conteúdo markdown em string
     * @param lessonId ID da lição
     * @return URL pública do arquivo no storage
     */
    String uploadLessonContentFromString(String content, String lessonId) throws IOException;
    
    /**
     * Recupera o conteúdo de uma lição do storage
     * @param contentUrl URL do arquivo no storage
     * @return Conteúdo markdown como string
     */
    String getLessonContent(String contentUrl) throws IOException;
    
    /**
     * Deleta um arquivo de lição do storage
     * @param contentUrl URL do arquivo a ser deletado
     */
    void deleteLessonContent(String contentUrl) throws IOException;
    
    /**
     * Atualiza o conteúdo de uma lição existente
     * @param content Novo conteúdo markdown
     * @param contentUrl URL do arquivo existente
     * @return URL pública do arquivo atualizado
     */
    String updateLessonContent(String content, String contentUrl) throws IOException;
}
