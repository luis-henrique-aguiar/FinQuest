package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.service.StorageService;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
public class FirebaseStorageServiceImpl implements StorageService {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseStorageServiceImpl.class);
    private static final String BUCKET_NAME = "finquest-65954.firebasestorage.app";
    private static final String LESSONS_FOLDER = "lessons/";
    
    private final Storage storage;

    public FirebaseStorageServiceImpl() {
        try {
            logger.info("Inicializando Firebase Storage com credenciais...");
            
            ClassPathResource serviceAccountResource =
                    new ClassPathResource("finquest-65954-firebase-adminsdk-fbsvc-33095347ec.json");

            if (!serviceAccountResource.exists()) {
                logger.error("CRÍTICO: Arquivo de credenciais do Firebase NÃO ENCONTRADO no classpath!");
                throw new IOException("Arquivo de credenciais ausente para Firebase Storage.");
            }

            GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccountResource.getInputStream());
            
            this.storage = StorageOptions.newBuilder()
                    .setCredentials(credentials)
                    .build()
                    .getService();
            
            logger.info("✅ Firebase Storage inicializado com sucesso");
        } catch (IOException e) {
            logger.error("FALHA ao inicializar Firebase Storage: {}", e.getMessage(), e);
            throw new RuntimeException("Não foi possível inicializar Firebase Storage", e);
        }
    }

    @Override
    public String uploadLessonContent(MultipartFile file, String lessonId) throws IOException {
        String fileName = LESSONS_FOLDER + lessonId + ".md";
        BlobId blobId = BlobId.of(BUCKET_NAME, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType("text/markdown")
                .build();

        storage.create(blobInfo, file.getBytes());
        
        return generatePublicUrl(fileName);
    }

    @Override
    public String uploadLessonContentFromString(String content, String lessonId) throws IOException {
        String fileName = LESSONS_FOLDER + lessonId + ".md";
        BlobId blobId = BlobId.of(BUCKET_NAME, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType("text/markdown; charset=utf-8")
                .build();

        byte[] bytes = content.getBytes(StandardCharsets.UTF_8);
        storage.create(blobInfo, bytes);
        
        return generatePublicUrl(fileName);
    }

    @Override
    public String getLessonContent(String contentUrl) throws IOException {
        // Aceita tanto URL completa quanto path relativo
        String fileName = contentUrl.startsWith("http") 
            ? extractFileNameFromUrl(contentUrl)
            : contentUrl;
            
        BlobId blobId = BlobId.of(BUCKET_NAME, fileName);
        Blob blob = storage.get(blobId);
        
        if (blob == null) {
            throw new IOException("Lesson content not found: " + contentUrl);
        }
        
        byte[] content = blob.getContent();
        return new String(content, StandardCharsets.UTF_8);
    }

    @Override
    public void deleteLessonContent(String contentUrl) throws IOException {
        // Aceita tanto URL completa quanto path relativo
        String fileName = contentUrl.startsWith("http") 
            ? extractFileNameFromUrl(contentUrl)
            : contentUrl;
            
        BlobId blobId = BlobId.of(BUCKET_NAME, fileName);
        boolean deleted = storage.delete(blobId);
        
        if (!deleted) {
            throw new IOException("Failed to delete lesson content: " + contentUrl);
        }
    }

    @Override
    public String updateLessonContent(String content, String contentUrl) throws IOException {
        // Aceita tanto URL completa quanto path relativo
        String fileName = contentUrl.startsWith("http") 
            ? extractFileNameFromUrl(contentUrl)
            : contentUrl;
            
        BlobId blobId = BlobId.of(BUCKET_NAME, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType("text/markdown; charset=utf-8")
                .build();

        byte[] bytes = content.getBytes(StandardCharsets.UTF_8);
        storage.create(blobInfo, bytes);
        
        return generatePublicUrl(fileName);
    }

    private String generatePublicUrl(String fileName) {
        // Gera URL pública do Firebase Storage
        String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8)
                .replace("+", "%20");
        return String.format(
            "https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media",
            BUCKET_NAME,
            encodedFileName
        );
    }

    private String extractFileNameFromUrl(String contentUrl) {
        // Extrai o nome do arquivo da URL do Firebase Storage
        // URL format: https://firebasestorage.googleapis.com/v0/b/BUCKET/o/FILENAME?alt=media
        String[] parts = contentUrl.split("/o/");
        if (parts.length < 2) {
            throw new IllegalArgumentException("Invalid Firebase Storage URL: " + contentUrl);
        }
        
        String fileNamePart = parts[1].split("\\?")[0];
        return java.net.URLDecoder.decode(fileNamePart, StandardCharsets.UTF_8);
    }
}
